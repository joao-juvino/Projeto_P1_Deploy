# agent_class.py
from livekit.agents import Agent
from livekit.agents.llm import function_tool 
from dotenv import load_dotenv
import json
import random
from analyst_agent import generate_analysis_report

load_dotenv()

SYSTEM_PROMPT_INTERVIEWER = """
# ... (Seu prompt continua o mesmo) ...
"""

class InterviewAgent(Agent):
    def __init__(self):
        super().__init__(
            instructions=SYSTEM_PROMPT_INTERVIEWER
        )

    @function_tool 
    async def prepare_technical_question(self) -> str:
        """
        Call this tool to get a new technical problem and a detailed report about it.
        You MUST call this tool after the behavioral question, and after each time the candidate finishes solving the previous technical question.
        """
        print("INFO: [Interview Agent] Tool 'prepare_technical_question' called.")
        try:
            with open("data/questions.json", "r", encoding="utf-8") as f:
                questions = json.load(f)
            selected_question = random.choice(questions)

            frontend_payload = {
                "type": "SHOW_TECHNICAL_QUESTION",
                "payload": selected_question
            }
            message_str = json.dumps(frontend_payload)
            
            await self.room.send_data(message_str, topic="interview_events")

            report = await generate_analysis_report(selected_question)
            return report
            
        except Exception as e:
            print(f"ERROR: [Interview Agent] An error occurred in the tool: {e}")
            return "Error: Could not prepare the technical question."

    async def on_enter(self):
        pass