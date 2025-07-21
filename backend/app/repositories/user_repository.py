from pymongo.database import Database
from pymongo.collection import Collection 
from typing import Dict, Any
from bson.objectid import ObjectId

def get_users_collection(db_client: Database) -> Collection:
    return db_client.users

def create_user(db_client: Database, user_data: Dict[str, Any]) -> str:
    users_collection = get_users_collection(db_client)
    result = users_collection.insert_one(user_data)
    return str(result.inserted_id)

def find_user_by_email(db_client: Database, email: str) -> Dict[str, Any] | None:
    users_collection = get_users_collection(db_client)
    return users_collection.find_one({"email": email})

def find_user_by_username(db_client: Database, username: str) -> Dict[str, Any] | None:
    users_collection = get_users_collection(db_client)
    return users_collection.find_one({"username": username})

def find_user_by_token(db_client: Database, token: str) -> Dict[str, Any] | None:
    users_collection = get_users_collection(db_client)
    return users_collection.find_one({"confirmation_token": token})

def set_user_as_confirmed(db_client: Database, user_id: str) -> bool:
    users_collection = get_users_collection(db_client)
    result = users_collection.update_one(
        {"_id": ObjectId(user_id)},
        {
            "$set": {"email_confirmed": True},
            "$unset": {"confirmation_token": ""}
        }
    )
    return result.modified_count == 1