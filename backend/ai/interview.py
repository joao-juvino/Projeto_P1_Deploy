import os
from livekit.agents import JobContext, AgentSession
from livekit.plugins import deepgram, openai, elevenlabs
from agent_class import InterviewAgent


async def interview_entrypoint(ctx: JobContext):
    agent = InterviewAgent()
    session = AgentSession(
        stt=deepgram.STT(),
        llm=openai.LLM(model="gpt-4o"),
        tts=elevenlabs.TTS(),
    )

    await session.start(ctx.room, agent)
    await agent.session.audio_source.wait_done()

    async for stt_event in session.stt_stream:
        if not stt_event.is_final:
            continue

        user_text = stt_event.alternatives[0].text.strip()
        if not user_text:
            continue

        agent.session.chat.messages.append(
            openai.ChatMessage(role="user", text=user_text)
        )
        llm_stream = await session.llm.chat(agent.session.chat)

        agent.session.chat.messages.append(openai.ChatMessage(role="assistant", text=""))

        async for chunk in llm_stream:
            agent.session.chat.messages[-1].text += chunk
            await agent.session.audio_source.push_text(chunk)

        await agent.session.audio_source.flush()


if __name__ == "__main__":
    from livekit.agents import cli
    cli.run(interview_entrypoint)
