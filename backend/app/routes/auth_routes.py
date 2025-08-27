from sanic import Blueprint, Request
from sanic.response import json
from app.services import auth_service
from app.exceptions.auth_exceptions import (
    UsernameAlreadyTakenError, 
    EmailAlreadyRegisteredError, 
    InvalidCredentialsError
)

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/signup", methods=["POST"])
async def signup_route(request: Request):
    db = request.app.ctx.mongo_db
    data = request.json
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    try:
        await auth_service.register_user(db, request.app.config, username, email, password)
        response_body = {
            "message": "Registration successful! Please check your email to confirm your account."
        }
        return json(response_body, status=201)
    except (UsernameAlreadyTakenError, EmailAlreadyRegisteredError) as e:
        return json({"message": str(e)}, status=409)
    except ValueError as e:
        return json({"message": str(e)}, status=400)
    except Exception as e:
        return json({"message": "An internal server error occurred."}, status=500)


@auth_bp.route("/confirm/<token>", methods=["GET"])
async def confirm_email_route(request: Request, token: str):
    db = request.app.ctx.mongo_db

    try:
        auth_service.confirm_user_token(db, token)
        return json({"message": "Email confirmed successfully! You can now log in."}, status=200)
    except ValueError as e:
        return json({"message": str(e)}, status=400)
    except Exception as e:
        return json({"message": "An internal error occurred."}, status=500)


@auth_bp.route("/signin", methods=["POST"])
async def login(request: Request):
    db = request.app.ctx.mongo_db

    data = request.json
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    try:
        auth_service.login(db, username, email, password)
        return json({"message": "Login Successful!"}, status=200)
    except InvalidCredentialsError as e:
        return json({"message": str(e)}, status=401)
    except ValueError as e:
        return json({"message": str(e)}, status=500)


@auth_bp.route("/forgot-password", methods=["POST"])
async def forgot_password(request: Request):
    """Solicitar recuperação de senha"""
    db = request.app.ctx.mongo_db
    data = request.json
    email = data.get("email")
    
    try:        
        await auth_service.request_password_reset(db, email)
        return json({"message": f"Reset link sent to {email}."}, status=200)
    except ValueError as e:
        return json({"message": str(e)}, status=400)
    except Exception as e:
        return json({"message": "An internal server error occurred."}, status=500)


@auth_bp.route("/reset-password", methods=["POST"])
async def reset_password(request: Request):
    """Redefinir senha com token"""
    db = request.app.ctx.mongo_db
    data = request.json
    token = data.get("token")
    password = data.get("password")
    
    try:        
        await auth_service.reset_password(db, token, password)
        return json({"message": "Password reset successfully!"}, status=200)
    except ValueError as e:
        return json({"message": str(e)}, status=400)
    except Exception as e:
        return json({"message": "An internal server error occurred."}, status=500)
