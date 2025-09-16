from sanic import Blueprint, Request
from sanic.response import json

general_bp = Blueprint("general")

@general_bp.route("/", methods=["GET"])
async def index(request: Request):
    return json({"message": "API is running!"})

