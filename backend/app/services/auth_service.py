import uuid
from werkzeug.security import generate_password_hash, check_password_hash
from app.repositories import user_repository
from app.exceptions.auth_exceptions import UsernameAlreadyTakenError, EmailAlreadyRegisteredError

def register_user(db_client, username, email, password):

    if not username or not email or not password:
        raise ValueError("Missing required fields.")
    
    if user_repository.find_user_by_username(db_client, username):
        raise UserAlreadyExistsError()
    if user_repository.find_user_by_email(db_client, email):
        raise EmailAlreadyRegisteredError()
    
    token = str(uuid.uuid4())       # generate token for email authentication
    hashed_password = generate_password_hash(password)
    user_data = {
        "username": username,
        "email": email,
        "password": hashed_password,
        "email_confirmed": False,
        "confirmation_token": token
    }

    user_id = user_repository.create_user(db_client, user_data)
    return user_id
