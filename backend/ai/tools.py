import json
import random
from livekit.agents.llm import ToolSet, tool
from analyst_agent import generate_analysis_report

class InterviewToolSet(ToolSet):
    def __init__(self):
        super().__init__()

    @tool
    async def prepare_technical_question(self) -> str:
        """
        Call this tool to get a new technical problem and a detailed report about it.
        You MUST call this tool after the behavioral question, and after each time the candidate finishes solving the previous technical question.
        """
        print("INFO: [ToolSet] 'prepare_technical_question' called.")
        try:
            with open("data/questions.json", "r", encoding="utf-8") as f:
                questions = json.load(f)
            selected_question = random.choice(questions)

            report = await generate_analysis_report(selected_question)
            return report
            
        except Exception as e:
            print(f"ERROR: [ToolSet] An error occurred in the tool: {e}")
            return "Error: Could not prepare the technical question."