# agent_class.py
import os
import json
import random
import logging
import google.generativeai as genai
from dotenv import load_dotenv
from livekit.agents import Agent
from livekit.agents.llm import function_tool
from livekit.rtc import Room, DataPacket
from analyst_agent import generate_analysis_report

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()

# --- CONFIGURAÇÃO DA IA ---
try:
    api_key = os.environ.get("GOOGLE_API_KEY") or os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise KeyError
    genai.configure(api_key=api_key)
except KeyError:
    logger.error("ERRO: GOOGLE_API_KEY ou GEMINI_API_KEY não encontrada no .env")
    exit()

MODEL_LIGHT = genai.GenerativeModel('gemini-1.5-flash')
MODEL_PRO = genai.GenerativeModel('gemini-1.5-pro')

# --- PROMPTS (CORRIGIDOS) ---
PROMPT_MEDIUM = """
You are a Senior Software Engineer reviewing a partial solution.
Compare the candidate's code against the optimal approach, but keep it concise.
Analysis report for optimal solution: {analysis_report}
Candidate's partial solution: {user_solution}
Give feedback with 3 short sections: 1. General Direction, 2. Potential Issues, 3. Suggestion to continue.
Be encouraging and helpful.
"""

PROMPT_FINAL = """
You are an expert coding interviewer creating a final, detailed evaluation.
Evaluate the candidate's final solution based on the provided analysis report of the optimal solution.
Analysis report: {analysis_report}
Candidate's final solution: {user_solution}
Generate a Markdown report covering: 1. Correctness, 2. Complexity (Time & Space), 3. Code Quality, 4. Strengths & Weaknesses, and 5. Final Verdict. Be detailed, professional, and constructive.
"""

SYSTEM_PROMPT_INTERVIEWER = """
You are Ada, an advanced AI technical interviewer. You are friendly, professional, and methodical.
Your primary role is to be a conversational guide for the candidate. The candidate is in control of when they receive feedback via buttons in their interface.

**Your strict workflow is:**
1.  **Greeting:** Start the conversation *only once* with a friendly greeting, introduce yourself, and ask ONE behavioral question to warm up.
2.  **Present Problem:** After their response, you MUST call the `prepare_technical_question` tool. This will select a new problem and display it to the candidate.
3.  **Guide and Observe:** After the tool runs, explain the problem to the candidate. Then, let them work on the solution. Be prepared to deliver feedback when they request it.
4.  **Deliver Feedback on Request:** The candidate can click two types of buttons:
    * **Partial Feedback:** When they request partial feedback, the system will run an evaluation and provide you with the report. Your job is to present this feedback to them clearly and encouragingly.
    * **Final Submission:** When they submit their final solution, the system will run a more detailed final evaluation. Your job is to present this final report as the conclusion for the question.
5.  **Cycle:** After presenting the final feedback, ask the candidate if they would like to tackle another question. If they say yes, go back to step 2 by calling `prepare_technical_question` again.

Your main tasks are managing the conversation flow and delivering the feedback that the system provides you. You do not call the evaluation tools yourself.
"""

class InterviewAgent(Agent):
    def __init__(self, **kwargs):
        super().__init__(instructions=SYSTEM_PROMPT_INTERVIEWER, **kwargs)
        self.room = None
        self.current_question = None
        self.current_report = None
        self.on("data_received", self._on_data_received)
        logger.info("InterviewAgent inicializado e ouvindo eventos.")
    
    async def on_start(self, room: Room):
        self.room = room
        logger.info(f"✅ Agent conectado à sala: {room.name}")

    @function_tool 
    async def prepare_technical_question(self) -> str:
        logger.info("Tool 'prepare_technical_question' called.")
        try:
            with open("data/questions.json", "r", encoding="utf-8") as f:
                questions = json.load(f)
            selected_question = random.choice(questions)
            self.current_question = selected_question

            report = await generate_analysis_report(selected_question)
            self.current_report = report

            if self.room and self.room.local_participant:
                frontend_payload = {"type": "SHOW_TECHNICAL_QUESTION", "payload": selected_question}
                await self.room.local_participant.publish_data(
                    json.dumps(frontend_payload), 
                    topic="interview_events"
                )

            return f"Question prepared: {selected_question['title']}"
        except Exception as e:
            logger.error(f"Error in prepare_technical_question: {e}")
            return "Error: Could not prepare the technical question."

    async def evaluate_partial_solution(self, user_solution: str) -> str:
        """Avaliação parcial - não é @function_tool"""
        if not self.current_report:
            return "Error: No technical question prepared."
        try:
            prompt = PROMPT_MEDIUM.format(
                analysis_report=self.current_report,
                user_solution=user_solution
            )
            response = await MODEL_LIGHT.generate_content_async(prompt)
            return response.text
        except Exception as e:
            logger.error(f"Error in evaluate_partial_solution: {e}")
            return "Error: Could not generate partial feedback."

    async def evaluate_final_solution(self, user_solution: str) -> str:
        """Avaliação final - não é @function_tool"""
        if not self.current_report:
            return "Error: No technical question prepared."
        try:
            prompt = PROMPT_FINAL.format(
                analysis_report=self.current_report,
                user_solution=user_solution
            )
            response = await MODEL_PRO.generate_content_async(prompt)
            return response.text
        except Exception as e:
            logger.error(f"Error in evaluate_final_solution: {e}")
            return "Error: Could not generate final feedback."
            
    async def _on_data_received(self, dp: DataPacket):
        if dp.topic != "agent_control":
            return
            
        try:
            message = json.loads(dp.data)
            msg_type = message.get("type")
            
            if msg_type == "REQUEST_PARTIAL_FEEDBACK":
                code = message.get("payload", {}).get("text", "")
                logger.info("Recebido pedido de feedback parcial.")
                
                await self.say("Analisando seu progresso, um momento...", allow_interruptions=True)
                feedback_text = await self.evaluate_partial_solution(code)
                
                if self.room and self.room.local_participant:
                    frontend_payload = {
                        "type": "PARTIAL_FEEDBACK_RESULT",
                        "payload": {"text": feedback_text}
                    }
                    await self.room.local_participant.publish_data(
                        json.dumps(frontend_payload),
                        topic="interview_events" 
                    )
                    await self.say(feedback_text, allow_interruptions=True)
            
            elif msg_type == "SUBMIT_SOLUTION_FINAL":
                code = message.get("payload", {}).get("text", "")
                logger.info("Recebida submissão de solução final.")
                
                await self.say("Recebi sua solução final. Fazendo análise completa...", allow_interruptions=False)
                feedback_text = await self.evaluate_final_solution(code)
                
                if self.room and self.room.local_participant:
                    frontend_payload = {
                        "type": "FINAL_FEEDBACK_RESULT",
                        "payload": {"text": feedback_text}
                    }
                    await self.room.local_participant.publish_data(
                        json.dumps(frontend_payload),
                        topic="interview_events" 
                    )
                    await self.say(feedback_text, allow_interruptions=False)
            
            elif msg_type == "SPEAK_EVALUATION_RESULT":  # Mantém compatibilidade
                code = message.get("payload", {}).get("text", "")
                logger.info("Recebido pedido de avaliação (legado).")
                feedback_text = await self.evaluate_final_solution(code)
                
                if self.room and self.room.local_participant:
                    frontend_payload = {
                        "type": "SHOW_EVALUATION_FEEDBACK",
                        "payload": {"text": feedback_text}
                    }
                    await self.room.local_participant.publish_data(
                        json.dumps(frontend_payload),
                        topic="interview_events" 
                    )
                    await self.say(feedback_text)

        except Exception as e:
            logger.error(f"Error in _on_data_received: {e}")