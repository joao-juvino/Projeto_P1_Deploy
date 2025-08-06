import uuid
from pymongo.database import Database
from werkzeug.security import generate_password_hash, check_password_hash
from app.utils.email_sender import send_confirmation_email, send_password_reset_email
from app.repositories import user_repository
from app.exceptions.auth_exceptions import UsernameAlreadyTakenError, EmailAlreadyRegisteredError


async def register_user(db_client: Database, config, username: str, email: str, password: str):
    
    if not username or not email or not password:
        raise ValueError("Missing required fields.")

    if user_repository.find_user_by_email(db_client, email):
        raise EmailAlreadyRegisteredError()
    if user_repository.find_user_by_username(db_client, username):
        raise UsernameAlreadyTakenError()

    token = str(uuid.uuid4())
    hashed_password = generate_password_hash(password)
    
    user_data = {
        "username": username,
        "email": email,
        "password": hashed_password,
        "email_confirmed": False,
        "confirmation_token": token
    }
    
    user_id = user_repository.create_user(db_client, user_data)
    
    try:
        await send_confirmation_email(config, email, token)
    except Exception as e:
        print(f"CRITICAL ERROR: User {username} created, but confirmation email failed: {e}")


def confirm_user_token(db_client: Database, token: str):
    user = user_repository.find_user_by_token(db_client, token)

    if not user:
        raise ValueError("Invalid or expired confirmation token.")

    user_id = user['_id']
    success = user_repository.set_user_as_confirmed(db_client, user_id)

    if not success:
        raise Exception("An error occurred while trying to confirm the user in the database.")
    
    return user_id


def login(db_client: Database, username: str, email: str, password: str):

    user = None
    if username is not None:
        user = user_repository.find_user_by_username(db_client, username)
    if email is not None:
        user = user_repository.find_user_by_email(db_client, email)
    
    if user is None:
        raise InvalidCredentialsError()
    if not user.get("email_confirmed"):
        raise ValueError("Email needs to be confirmed")
    
    hashed_password = user["password"]
    if not check_password_hash(hashed_password, password):
        raise InvalidCredentialsError()
    
    return user["id"]


async def request_password_reset(db_client: Database, email: str):
    """Solicita recuperação de senha"""
    
    if not email:
        raise ValueError("Email is required.")
    
    user = user_repository.find_user_by_email(db_client, email.lower().strip())
    
    # Sempre retorna sucesso por segurança
    if not user:
        return True
    
    # Gera token que expira em 1 hora
    reset_token = str(uuid.uuid4())
    expires_at = datetime.utcnow() + timedelta(hours=1)
    
    # Salva token no usuário
    user_repository.save_reset_token(db_client, user['_id'], reset_token, expires_at)
    
    # Envia email
    try:
        await send_password_reset_email(email, reset_token)
    except Exception as e:
        print(f"CRITICAL ERROR: Reset token created for {email}, but email failed: {e}")
    
    return True


async def reset_password(db_client: Database, token: str, new_password: str):
    """Redefine senha com token"""
    if not token or not new_password:
        raise ValueError("Token and password are required.")
    
    if len(new_password) < 6:
        raise ValueError("Password must be at least 6 characters long.")
    
    # Busca usuário pelo token válido
    user = user_repository.find_user_by_reset_token(db_client, token)
    
    if not user:
        raise ValueError("Invalid or expired reset token.")
    
    # Atualiza senha
    hashed_password = generate_password_hash(new_password)
    success = user_repository.update_password(db_client, user['_id'], hashed_password)
    
    if not success:
        raise Exception("Failed to update password.")
    
    return True
