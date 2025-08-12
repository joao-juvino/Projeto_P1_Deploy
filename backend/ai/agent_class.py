from livekit.agents import Agent
from livekit.plugins import elevenlabs
from dotenv import load_dotenv

load_dotenv()

SYSTEM_PROMPT = """
You are an expert interviewer from a top-tier tech company. Your name is Ada.
You are professional, friendly, but also thorough. Your goal is to assess the
candidate's skills.

Your process is:
1.  Start with a friendly greeting and introduce yourself.
2.  Ask ONE behavioral question.
3.  Listen to the complete answer without interrupting.
4.  After the user answers, provide brief, positive feedback, and then ask ONE technical or coding-related conceptual question.
5.  Continue the conversation based on their responses.

Always speak in a clear, concise, and professional manner.
"""

class InterviewAgent(Agent):
    def __init__(self):
        super().__init__(instructions=SYSTEM_PROMPT)

    async def on_enter(self):
        # Gera a resposta inicial (saudação)
        initial_response = await self.session.generate_reply(
            instructions="Greet the user and introduce yourself."
        )
        # Faz o agente falar a resposta com TTS da ElevenLabs
        await self.session.say(initial_response, tts=elevenlabs.TTS())
