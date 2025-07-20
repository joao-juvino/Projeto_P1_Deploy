from pymongo.database import Database
from typing import Dict, Any


class UserRepository:
    
    def __init__(self, database: Database):
        self.user_collection = database["users"]
    
    def create_user(self, user_data: Dict[str, Any]) -> str:
        result = self.user_collection.insert_one(user_data)
        return str(result.inserted_id)
