import os
from sanic import Sanic
from dotenv import load_dotenv
from sanic_cors import CORS

from app.database.mongo_client import get_database, close_database_connection
from app.routes.auth_routes import auth_bp
from app.routes.general_routes import general_bp
from app.routes.interview_routes import livekit_bp

def create_app() -> Sanic:
    load_dotenv()
    app = Sanic("MyApp")

    # ===== C O R S  =====
    # Defina no Koyeb (Settings → Environment Variables), por exemplo:
    # ALLOWED_ORIGINS=https://seu-front.vercel.app, http://localhost:3000
    origins_env = os.getenv("ALLOWED_ORIGINS", "")
    origins = [o.strip().rstrip("/") for o in origins_env.split(",") if o.strip()]
    if not origins:
        # fallback seguro durante dev; em produção prefira setar ALLOWED_ORIGINS
        origins = ["http://localhost:3000"]

    CORS(
        app,
        origins=origins,
        allow_headers=["Content-Type", "Authorization"],
        methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        supports_credentials=False,   # mude para True se usar cookies/sessão no navegador
    )
    # =====================

    # Mail
    app.config.MAIL_SERVER = "smtp.gmail.com"
    app.config.MAIL_PORT = 465
    app.config.MAIL_USERNAME = os.getenv("MAIL_USERNAME")
    app.config.MAIL_PASSWORD = os.getenv("MAIL_PASSWORD")
    app.config.MAIL_USE_TLS = False
    app.config.MAIL_USE_SSL = True

    # DB lifecycle
    @app.before_server_start
    async def setup_db(app, _):
        try:
            app.ctx.mongo_db = get_database()
        except Exception as e:
            raise RuntimeError(f"Failed to connect to Database: {e}")

    @app.after_server_stop
    async def teardown_db(app, _):
        close_database_connection()

    # Rotas
    app.blueprint(general_bp)
    app.blueprint(auth_bp, url_prefix="/auth")
    app.blueprint(livekit_bp, url_prefix="/livekit")

    print("Registered blueprints:", list(app.blueprints.keys()))
    print("CORS allowed origins:", origins)
    return app
