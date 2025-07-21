import os
from flask import Flask
from dotenv import load_dotenv
from flask_mail import Mail


mail = Mail()

def create_app():
    app = Flask(__name__)

    load_dotenv()

    app.config['MAIL_SERVER'] = 'smtp.gmail.com'
    app.config['MAIL_PORT'] = 465
    app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
    app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
    app.config['MAIL_USE_TLS'] = False
    app.config['MAIL_USE_SSL'] = True

    mail.init_app(app)

    from app.routes.auth_routes import auth_bp
    from app.routes.general_routes import general_bp

    app.register_blueprint(general_bp)
    app.register_blueprint(auth_bp, url_prefix="/auth")

    from app.database.mongo_client import get_database, close_database_connection

    with app.app_context():
        try:
            app.mongo_db = get_database()
        except Exception as e:
            raise RuntimeError(f"Application failed to start due to MongoDB connection error: {e}")

    @app.teardown_appcontext
    def teardown_db_connection(exception=None):
        close_database_connection()

    return app