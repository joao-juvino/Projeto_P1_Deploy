import uuid
from datetime import datetime
from pymongo.database import Database
from werkzeug.security import generate_password_hash
from app.utils.email_sender import send_confirmation_email
from app.repositories import user_repository
from app.exceptions.auth_exceptions import UsernameAlreadyTakenError, EmailAlreadyRegisteredError

def register_user(db_client: Database, username: str, email: str, password: str):
    
    if not username or not email or not password:
        raise ValueError("Missing required fields.")

    existing_user = user_repository.find_user_by_email(db_client, email)
    if existing_user:
        if existing_user.get("email_confirmed"):
            raise EmailAlreadyRegisteredError("Este e-mail já está em uso.")
        else:
            raise EmailAlreadyRegisteredError("Este e-mail já foi registrado, mas aguarda confirmação.")
    
    if user_repository.find_user_by_username(db_client, username):
        raise UsernameAlreadyTakenError()

    token = str(uuid.uuid4())
    hashed_password = generate_password_hash(password)
    
    user_data = {
        "username": username,
        "email": email,
        "password": hashed_password,
        "email_confirmed": False,
        "confirmation_token": token,
        "createdAt": datetime.utcnow()
    }
    
    user_repository.create_user(db_client, user_data)
    
    try:
        send_confirmation_email(email, token)
    except Exception as e:
        print(f"ERRO CRÍTICO: Usuário {username} criado, mas e-mail de confirmação falhou: {e}")
    return

def confirm_user_token(db_client: Database, token: str):
    user = user_repository.find_user_by_token(db_client, token)

    if not user:
        raise ValueError("Token de confirmação inválido ou expirado.")

    user_id = str(user['_id'])
    success = user_repository.set_user_as_confirmed(db_client, user_id)

    if not success:
        raise Exception("Ocorreu um erro ao tentar confirmar o usuário no banco de dados.")
    
    return