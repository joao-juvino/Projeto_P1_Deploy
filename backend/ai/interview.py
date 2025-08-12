from dotenv import load_dotenv

from livekit import agents
from livekit.agents import AgentSession, RoomInputOptions, AutoSubscribe
from livekit.plugins import noise_cancellation, silero, google, elevenlabs

from agent_class import InterviewAgent

load_dotenv()


async def interview_entrypoint(ctx):

    # Conectar à sala, ouvindo apenas áudio
    await ctx.connect(auto_subscribe=AutoSubscribe.AUDIO_ONLY)

    # Criar sessão do agente
    session = AgentSession(
        llm=google.beta.realtime.RealtimeModel(
            model="gemini-2.0-flash-live-001",
            voice="Zephyr",
            temperature=0.8,
            input_audio_transcription={},
            output_audio_transcription={}
        ),
        vad=silero.VAD.load(),
        tts=elevenlabs.TTS()
    )

    await session.start(
        room=ctx.room,
        agent=InterviewAgent(),
        room_input_options=RoomInputOptions(
            noise_cancellation=noise_cancellation.BVC(),
        ),
    )

if __name__ == "__main__":
    agents.cli.run_app(
        agents.WorkerOptions(entrypoint_fnc=interview_entrypoint)
    )