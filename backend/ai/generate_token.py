# generate_token.py
import os
from livekit.api import AccessToken, VideoGrants
from dotenv import load_dotenv

# Carrega as variáveis do arquivo .env
load_dotenv()

# Pega as configurações do seu arquivo .env
LIVEKIT_API_KEY = os.getenv("LIVEKIT_API_KEY")
LIVEKIT_API_SECRET = os.getenv("LIVEKIT_API_SECRET")

# --- Configurações do Token ---
# O nome da sala para a qual você quer gerar o token.
# O modo 'dev' provavelmente usa 'dev-room' como padrão.
ROOM_NAME = "dev-room" 
# Seu nome como participante na sala.
USER_IDENTITY = "Pedro-Humano"
# -----------------------------

def main():
    # Garante que as configurações estão presentes
    if not all([LIVEKIT_API_KEY, LIVEKIT_API_SECRET]):
        print("Erro: Verifique se LIVEKIT_API_KEY e LIVEKIT_API_SECRET estão no seu arquivo .env")
        return

    print(f"Gerando token para '{USER_IDENTITY}' entrar na sala '{ROOM_NAME}'...")

    # Cria um token de acesso para você (o humano)
    token = AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET) \
        .with_identity(USER_IDENTITY) \
        .with_name("Pedro (Humano)") \
        .with_grants(VideoGrants(room_join=True, room=ROOM_NAME)) \
        .to_jwt()

    print("\n✅ Token Gerado com Sucesso!")
    print("--------------------------------------------------")
    print("Copie a linha abaixo e cole no campo 'Token' do LiveKit Meet:")
    print(token)
    print("--------------------------------------------------")

if __name__ == "__main__":
    main()
