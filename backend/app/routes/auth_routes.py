from flask import Blueprint, request, jsonify, current_app
from app.services import auth_service
from app.exceptions.auth_exceptions import UserAlreadyExistsError

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/signup", methods=["POST"])
def signup_route():
    data = request.get_json()
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    database = current_app.mongo_db

    try:
        user_id = auth_service.register_user(database, username, email, password)
        return jsonify({"message": "Successfully registered user!", "user_id": user_id}), 201
    except UserAlreadyExistsError as e:
        return jsonify({"message": e.message}), 409
    except ValueError as e:
        return jsonify({"message": e.message}), 400
    except Exception as e:
        return jsonify({"message": "Interal error occurred while registering user."}), 500
