import os
from sanic import Sanic
from dotenv import load_dotenv
from app.database.mongo_client import get_database, close_database_connection
from app.routes.auth_routes import auth_bp
from app.routes.general_routes import general_bp

"""
TODO:
        1. Register Blueprints - ok
        2. Configure Email - progress - ok
        3. Test
        4. Research AI - how to implement the voice agent (use )
"""

def create_app() -> Sanic:
    load_dotenv()
    app = Sanic("MyApp")

    # Store mail settings
    app.config.MAIL_SERVER = "smtp.gmail.com"
    app.config.MAIL_PORT = 465
    app.config.MAIL_USERNAME = os.getenv("MAIL_USERNAME")
    app.config.MAIL_PASSWORD = os.getenv("MAIL_PASSWORD")
    app.config.MAIL_USE_TLS = False
    app.config.MAIL_USE_SSL = True

    # Initialize database connection
    @app.before_server_start
    async def setup_db(app, _):
        try:
            app.ctx.mongo_db = get_database()
        except Exception as e:
            raise RuntimeError(f"Failed to connect to Database: {e}")

    # Close database connection
    @app.after_server_stop
    async def teardown_db(app, _):
        close_database_connection()

    # Register blueprints
    app.blueprint(general_bp)
    app.blueprint(auth_bp, url_prefix="/auth")

    print("Registered blueprints:", list(app.blueprints.keys()))
    return app
