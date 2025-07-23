from flask import Blueprint, request, jsonify, current_app
from app.services import auth_service
from app.exceptions.auth_exceptions import (
    UsernameAlreadyTakenError, 
    EmailAlreadyRegisteredError, 
    InvalidCredentialsError
)

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/signup", methods=["POST"])
def signup_route():
    data = request.get_json()

    try:
        auth_service.register_user(
            db_client=current_app.mongo_db,
            username=data.get("username"),
            email=data.get("email"),
            password=data.get("password")
        )
        return jsonify({
            "message": "Registration request successful! Please check your email to confirm your account."
        }), 201

    except (UsernameAlreadyTakenError, EmailAlreadyRegisteredError) as e:
        return jsonify({"message": e.message}), 409
    except ValueError as e:
        return jsonify({"message": str(e)}), 400
    except Exception as e:
        return jsonify({"message": "An internal server error occurred."}), 500
    
@auth_bp.route("/confirm/<token>", methods=["GET"])
def confirm_email_route(token: str):
    db_client = current_app.mongo_db

    try:
        auth_service.confirm_user_token(db_client, token)
        return jsonify({"message": "Email confirmed successfully! You can now log in."}), 200

    except ValueError as e:
        return jsonify({"message": str(e)}), 400

    except Exception as e:
        return jsonify({"message": "An internal error occurred while processing the confirmation."}), 500

@auth_bp.route("/signin", methods=["POST"])
def login():
    database = current_app.mongo_db
    
    data = request.json
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    try:
        auth_service.login(database, username, email, password)
        return jsonify({"message": "Login Successful!"}), 200
    except InvalidCredentialsError as e:
        return jsonify({"message": e.message()}), 401
    except Exception as e:
        return jsonify({"message": "An internal error occurred while processing the confirmation."}), 500
