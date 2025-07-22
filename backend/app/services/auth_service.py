import uuid
from pymongo.database import Database
from werkzeug.security import generate_password_hash
from app.utils.email_sender import send_confirmation_email
from app.repositories import user_repository
from app.exceptions.auth_exceptions import UsernameAlreadyTakenError, EmailAlreadyRegisteredError

def register_user(db_client: Database, username: str, email: str, password: str):
    
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
        send_confirmation_email(email, token)
    except Exception as e:
        print(f"CRITICAL ERROR: User {username} created, but confirmation email failed: {e}")
    return 

def confirm_user_token(db_client: Database, token: str):
    user = user_repository.find_user_by_token(db_client, token)

    if not user:
        raise ValueError("Invalid or expired confirmation token.")

    user_id = str(user['_id'])
    success = user_repository.set_user_as_confirmed(db_client, user_id)

    if not success:
        raise Exception("An error occurred while trying to confirm the user in the database.")
    
    return