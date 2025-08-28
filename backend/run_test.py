# run_test.py
import os
import asyncio
from urllib.parse import urlencode
from livekit_api import LiveKitAPI, AccessToken, VideoGrants
from dotenv import load_dotenv

# Carrega as variáveis do arquivo .env
load_dotenv()

# Pega as configurações do seu arquivo .env
LIVEKIT_URL = os.getenv("LIVEKIT_URL")
LIVEKIT_API_KEY = os.getenv("LIVEKIT_API_KEY")
LIVEKIT_API_SECRET = os.getenv("LIVEKIT_API_SECRET")

# --- Configurações do Teste ---
ROOM_NAME = "minha-conversa-com-ada"
USER_IDENTITY = "Pedro-Humano"
# -----------------------------

async def main():
    # 1. INICIAR O AGENTE (Equivalente ao `dispatch-job`)
    # ----------------------------------------------------
    print(f"Enviando agente para a sala: '{ROOM_NAME}'...")
    
    # Cria uma conexão com a API do LiveKit
    api = LiveKitAPI(url=LIVEKIT_URL, api_key=LIVEKIT_API_KEY, api_secret=LIVEKIT_API_SECRET)
    
    try:
        # Manda a ordem para um worker disponível entrar na sala
        await api.dispatch_job(room_name=ROOM_NAME)
        print("-> Agente despachado com sucesso!")
    except Exception as e:
        print(f"Erro ao despachar o agente: {e}")
        await api.aclose()
        return

    # 2. CRIAR O LINK DE CONVITE (Equivalente ao `create-token`)
    # --------------------------------------------------------
    print(f"Gerando link de convite para '{USER_IDENTITY}' entrar na sala...")

    # Cria um token de acesso para você (o humano)
    token = AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET) \
        .with_identity(USER_IDENTITY) \
        .with_name("Pedro (Humano)") \
        .with_grants(VideoGrants(room_join=True, room=ROOM_NAME)) \
        .to_jwt()

    # Monta a URL completa do LiveKit Meet
    params = urlencode({"token": token})
    join_url = f"https://meet.livekit.io/#/rooms/{ROOM_NAME}?{params}"

    print("\n✅ TUDO PRONTO!")
    print("--------------------------------------------------")
    print("Seu link de convite para falar com a Ada é:")
    print(join_url)
    print("--------------------------------------------------")
    
    # Fecha a conexão da API
    await api.aclose()

if __name__ == "__main__":
    # Garante que as configurações estão presentes
    if not all([LIVEKIT_URL, LIVEKIT_API_KEY, LIVEKIT_API_SECRET]):
        print("Erro: Verifique se as variáveis LIVEKIT_URL, LIVEKIT_API_KEY, e LIVEKIT_API_SECRET estão no seu arquivo .env")
    else:
        asyncio.run(main())
