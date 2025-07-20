import os
from flask import Flask
from dotenv import load_dotenv
from app.database.mongo_client import get_database, close_database_connection
from app.routes.auth_routes import auth_bp
from app.routes.general_routes import general_bp

load_dotenv()


def create_app():
    app = Flask(__name__)

    # Establish connection with MongoDB
    with app.app_context():
        try:
            app.mongo_db = get_database()
        except Exception as e:
            raise RuntimeError(f"Application failed to start due to MongoDB connection error: {e}")
    
    # Register application blueprints
    app.register_blueprint(general_bp)
    app.register_blueprint(auth_bp, url_prefix="/auth")


    @app.teardown_appcontext
    def teardown_db_connection(exception=None):
        close_database_connection()


    return app
