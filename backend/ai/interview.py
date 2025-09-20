import asyncio
from dotenv import load_dotenv
from livekit import agents
from livekit.agents import AgentSession, RoomInputOptions, AutoSubscribe
from livekit.plugins import noise_cancellation, silero, google
import elevenlabs
from agent_class import InterviewAgent

load_dotenv()

class ElevenLabsTTS:
    def init(self, voice="m151rjrbWXbBqyq56tly", model="eleven_turbo_v2"):
        self.voice = voice
        self.model = model

    async def generate(self, text: str) -> bytes:
        audio = elevenlabs.generate(
            text=text,
            voice=self.voice,  # usando Carla
            model=self.model
        )
        return audio

async def interview_entrypoint(ctx):
    await ctx.connect(auto_subscribe=AutoSubscribe.AUDIO_ONLY)

    session = AgentSession(
        llm=google.beta.realtime.RealtimeModel(
            model="gemini-2.0-flash-live-001",
            voice="Zephyr",
            temperature=0.8,
            input_audio_transcription={},
            output_audio_transcription={}
        ),
        vad=silero.VAD.load(),
        tts=ElevenLabsTTS()
    )

    agent_instance = InterviewAgent(room=ctx.room)

    # Registrando callback síncrono que cria tarefa assíncrona
    def on_data_received_sync(dp):
        asyncio.create_task(agent_instance.on_data_received(dp))

    ctx.room.on("data_received", on_data_received_sync)

    await session.start(
        room=ctx.room,
        agent=agent_instance,
        room_input_options=RoomInputOptions(
            noise_cancellation=noise_cancellation.BVC(),
        ),
    )

if __name__ == "__main__":
    agents.cli.run_app(
        agents.WorkerOptions(entrypoint_fnc=interview_entrypoint)
    )