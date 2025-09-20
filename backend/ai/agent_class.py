# agent_class.py

import os
import json
import random
import logging
import asyncio
from dotenv import load_dotenv
import google.generativeai as genai
from livekit.agents import Agent
from livekit.agents.llm import function_tool
from livekit.rtc import Room, DataPacket
from analyst_agent import generate_analysis_report  # assumindo que vamos usar a função

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
logging.getLogger("websockets").setLevel(logging.WARNING)

load_dotenv()

# --- CONFIGURE GOOGLE AI ---
api_key = os.environ.get("GOOGLE_API_KEY") or os.environ.get("GEMINI_API_KEY")
if not api_key:
    logger.error("ERRO: GOOGLE_API_KEY ou GEMINI_API_KEY não encontrada no .env")
    exit()

genai.configure(api_key=api_key)

MODEL = genai.GenerativeModel('gemini-1.5-flash')  # apenas um modelo


# --- PROMPTS ---

PROMPT_FINAL = """
Você é um entrevistador especializado em programação criando uma avaliação final e detalhada.
Avalie a solução final do candidato com base no relatório de análise fornecido da solução ótima.
Relatório de análise:
{analysis_report}
Solução final do candidato:
{user_solution}
Gere um relatório em Markdown abordando:
1. Correção,
2. Complexidade (Tempo & Espaço),
3. Qualidade do Código,
4. Pontos Fortes & Fracos,
5. Veredito Final.
Seja detalhado, profissional e construtivo.
"""


PROMPT_FEEDBACK = """
Você é um entrevistador experiente.
Analise a seguinte questão de entrevista técnica e a solução parcial fornecida pelo candidato.
Use o texto completo da questão (título, descrição e detalhes) e o relatório de análise do problema.

Questão:
Título: {title}
Descrição: {description}
Detalhes: {details}

Relatório de análise do problema:
{analysis_report}

Solução parcial do candidato:
{user_solution}

Forneça feedback em três seções:
1. Direção Geral
2. Pontos Potenciais de Problemas
3. Sugestões para continuar

Seja encorajador e profissional.
"""

SYSTEM_PROMPT_INTERVIEWER = """
Você é um entrevistador profissional chamado Ada. 
Seu comportamento deve seguir exatamente este fluxo, sem alterar a ordem:

1. Cumprimente o candidato com uma breve apresentação e faça UMA pergunta comportamental inicial.
2. Em seguida, chame a ferramenta `prepare_technical_question` UMA ÚNICA VEZ para obter a questão técnica e o relatório.
3. Leia o enunciado para o candidato da questão técnica fornecida pela ferramenta.
4. Você pode dar dicas, caso o candidato pergunte sobre a questão técnica.
5. Quando o candidato informar que finalizou a solução, diga para ele clicar no botão "enviar solução final".
6. Informe que ele será redirecionado para visualizar o feedback final.

Restrições importantes:
- Nunca pule etapas.
- Nunca faça múltiplas chamadas à ferramenta.
- Mantenha um tom profissional, amigável e direto.
"""


# Repita o ciclo até que o usuário encerre a entrevista.

class InterviewAgent(Agent):
    def __init__(self, room: Room):
        super().__init__(instructions=SYSTEM_PROMPT_INTERVIEWER)
        self.room = room
        self.current_question = None
        self.current_report = None
        self.lock = asyncio.Lock()

        # Carrega todas as questões em memória
        with open("data/questions.json", "r", encoding="utf-8") as f:
            self.questions = json.load(f)

        logger.info("InterviewAgent inicializado e ouvindo eventos.")

    @function_tool
    async def prepare_technical_question(self) -> dict:
        logger.info("Tool 'prepare_technical_question' called.")
        async with self.lock:
            try:
                # Escolhe uma questão
                selected_question = random.choice(self.questions)
                self.current_question = selected_question

                # Gera relatório incluindo todos os detalhes da questão
                prompt_for_report = f"""
Questão:
Título: {selected_question.get('title')}
Descrição: {selected_question.get('description')}
Detalhes: {selected_question.get('details', '')}

Por favor, gere um relatório detalhado para esta questão de entrevista técnica.
"""
                report_response = await MODEL.generate_content_async(prompt_for_report)
                report = report_response.text
                self.current_report = report

                # Envia para o frontend
                frontend_payload = {
                    "type": "SHOW_TECHNICAL_QUESTION",
                    "payload": {
                        **selected_question,
                        "report": report
                    }
                }

                if self.room and self.room.local_participant:
                    await self.room.local_participant.publish_data(
                        json.dumps(frontend_payload),
                        topic="interview_events"
                    )

                return {
                    "question": selected_question,
                    "report": report
                }

            except Exception as e:
                logger.error(f"Error in prepare_technical_question: {e}")
                return {"error": "Could not prepare the technical question."}

    async def evaluate_partial_solution(self, user_solution: str) -> str:
        if not self.current_report or not self.current_question:
            return "Error: No technical question prepared."

        try:
            prompt = PROMPT_FEEDBACK.format(
                title=self.current_question.get('title'),
                description=self.current_question.get('description'),
                details=self.current_question.get('details', ''),
                analysis_report=self.current_report,
                user_solution=user_solution
            )
            response = await MODEL.generate_content_async(prompt)
            return response.text
        except Exception as e:
            logger.error(f"Error in evaluate_partial_solution: {e}")
            return "Error: Could not generate feedback."


    async def evaluate_final_solution(self, user_solution: str) -> str:

        logger.info("Gerando feedback final...")

        if not self.current_report:

            return "Error: No technical question prepared."

        try:

            await asyncio.sleep(3)

            prompt = PROMPT_FINAL.format(

                analysis_report=self.current_report,

                user_solution=user_solution

            )

            response = await MODEL.generate_content_async(prompt)

            logger.info("Feedback final gerado")

            return response.text

        except Exception as e:

            logger.error(f"Error in evaluate_final_solution: {e}")

            return "Error: Could not generate final feedback."



    async def on_data_received(self, dp: DataPacket):

        # --- conversão ---

        if dp.topic != "agent_control":

            return

        try:

            data_str = dp.data.decode("utf-8") if isinstance(dp.data, bytes) else str(dp.data)

            message = json.loads(data_str)



            msg_type = message.get("type")

            code = message.get("payload", {}).get("text", "")



            logger.info(f"Evento recebido: {msg_type}, código tamanho={len(code)}")



            if msg_type == "REQUEST_PARTIAL_FEEDBACK":

                feedback_text = await self.evaluate_partial_solution(code)

                if self.room and self.room.local_participant:

                    await self.room.local_participant.publish_data(

                        json.dumps({"type": "PARTIAL_FEEDBACK_RESULT", "payload": {"text": feedback_text}}),

                        topic="interview_events"

                    )



            elif msg_type == "SUBMIT_SOLUTION_FINAL":

                feedback_text = await self.evaluate_final_solution(code)

                if self.room and self.room.local_participant:

                    await self.room.local_participant.publish_data(

                        json.dumps({"type": "FINAL_FEEDBACK_RESULT", "payload": {"text": feedback_text}}),

                        topic="interview_events"

                    )



            elif msg_type == "SPEAK_EVALUATION_RESULT":

                feedback_text = await self.evaluate_final_solution(code)

                if self.room and self.room.local_participant:

                    await self.room.local_participant.publish_data(

                        json.dumps({"type": "SHOW_EVALUATION_FEEDBACK", "payload": {"text": feedback_text}}),

                        topic="interview_events"

                    )



        except Exception as e:

            logger.error(f"Error in _on_data_received: {e}")