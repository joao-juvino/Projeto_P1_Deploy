# generate_token.py
import os
from livekit.api import AccessToken, VideoGrants
from dotenv import load_dotenv

load_dotenv()

LIVEKIT_API_KEY = os.getenv("LIVEKIT_API_KEY")
LIVEKIT_API_SECRET = os.getenv("LIVEKIT_API_SECRET")


ROOM_NAME = "dev-room" 

USER_IDENTITY = "Pedro"


def main():

    if not all([LIVEKIT_API_KEY, LIVEKIT_API_SECRET]):
        print("Erro: Verifique se LIVEKIT_API_KEY e LIVEKIT_API_SECRET estão no seu arquivo .env")
        return

    print(f"Gerando token para '{USER_IDENTITY}' entrar na sala '{ROOM_NAME}'...")

    token = AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET) \
        .with_identity(USER_IDENTITY) \
        .with_name("Pedro (Humano)") \
        .with_grants(VideoGrants(room_join=True, room=ROOM_NAME)) \
        .to_jwt()

    print(token)

if __name__ == "__main__":
    main()
