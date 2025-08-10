from sanic import Request, WebSocket, Blueprint
from sanic.response import json
from app.services import interview_service

interview_bp = Blueprint("interview")
sessions = dict()

@app.websocket("/interview")
async def interview_chat(request: Request, ws: WebSocket):
    first_msg = await interview_service.start_interview()
    await ws.send(json(first_msg))

    async for msg in ws:
        data = json.loads(msg)
        session_id = data.get("session_id")
        answer = data.get("answer")
        try:
            reply = await interview_service.handle_message(session_id, answer)
        except Exception as e:
            print(f"An internal error has occurred: {str(e)}")
