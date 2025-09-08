# agent_class.py
from livekit.agents import Agent
from livekit.agents.llm import function_tool 
from dotenv import load_dotenv
import json
import random
from analyst_agent import generate_analysis_report
from livekit.rtc import Room

load_dotenv()

SYSTEM_PROMPT_INTERVIEWER = """
You are an expert interviewer named Ada. You are professional and friendly.
Your entire process is a strict, repeating cycle. You MUST follow these steps precisely.

**Interview Flow:**

1.  **Greeting:** Start the conversation *only once* with a friendly greeting, introduce yourself, and ask ONE behavioral question.

2.  **First Technical Question:** After the candidate answers the behavioral question, you MUST immediately call your `prepare_technical_question` tool to get the first problem and its report.

3.  **Conduct Technical Interview:** Use the report you received from the tool to interview the candidate about this specific problem. Summarize the problem, ask for their high-level approach, and use the follow-up questions from the report.

4.  **Listen and Conclude Question:** Listen to the candidate's full solution and explanation. When they are finished, provide your final feedback on their performance for that specific question.

5.  **Conclude Interview Report** Give Interview report for candidate feedback.

Do not end the interview. Continue this cycle of fetching a new problem, interviewing, and giving feedback until the user decides to end the conversation.
"""

class InterviewAgent(Agent):
    def __init__(self, room: Room):
        super().__init__(
            instructions=SYSTEM_PROMPT_INTERVIEWER
        )
        self.room = room

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
            
            # await self.room.send_data(message_str, topic="interview_events")
            await self.room.local_participant.publish_data(message_str, topic="interview_events")

            report = await generate_analysis_report(selected_question)
            return report
            
        except Exception as e:
            print(f"ERROR: [Interview Agent] An error occurred in the tool: {e}")
            return "Error: Could not prepare the technical question."

    async def on_enter(self):
        pass