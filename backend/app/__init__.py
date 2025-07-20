import os
from flask import Flask
from dotenv import load_dotenv
from app.database.mongo_client import get_database, close_database_connection

load_dotenv()

# TODO: USE LOGGER TO PROVIDE INFORMATION ABOUT APP EXECUTION

def create_app():
    app = Flask(__name__)

    with app.app_context():
        try:
            app.mongo_db = get_database()
        except Exception as e:
            raise RuntimeError(f"Application failed to start due to MongoDB connection error: {e}")
    
    @app.teardown_appcontext
    def teardown_db_connection(exception=None):
        close_database_connection()

    return app
