import os
from sanic import Blueprint, Request
from sanic.response import json as sanic_json
from livekit.api import AccessToken, VideoGrants


LIVEKIT_API_KEY = os.getenv("LIVEKIT_API_KEY")
LIVEKIT_API_SECRET = os.getenv("LIVEKIT_API_SECRET")

livekit_bp = Blueprint("livekit")


@livekit_bp.route("/token", methods=["POST"])
async def generate_token(request: Request):
    body = request.json

    if not body or "identity" not in body or "room" not in body:

        return sanic_json({"error": "Missing identity or room"}, status=400)

    identity = body["identity"]
    room = body["room"]
    name = body.get("name", "Candidato")

    at = AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET) \
        .with_identity(identity) \
        .with_name(name) \
        .with_grants(
            VideoGrants(
                room_join=True,
                room=room
            )
        )

    token = at.to_jwt()


    return sanic_json({
        "token": token,
        "room": room,
        "identity": identity,
        "name": name
    })