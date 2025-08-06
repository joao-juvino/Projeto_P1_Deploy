from sanic import Blueprint, Request
from sanic.response import json

general_bp = Blueprint("general", __name__)

@general_bp.route("/", methods=["GET"])
async def index():
    return json({"message": "Gotta go fast!"}, status=200)
