from flask import Blueprint, jsonify

general_bp = Blueprint("general", __name__)

@general_bp.route("/", methods=["GET"])
def index():
    return jsonify({"message:": "Server is running!"}), 200
