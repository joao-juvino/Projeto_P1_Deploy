import os
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure

_mongo_client = None


def get_mongo_client():
    global _mongo_client

    if _mongo_client is None:
        try:
            MONGO_URI = os.getenv("MONGO_URI")
            if not MONGO_URI:
                raise ValueError("MONGO_URI not set in .env file")
            # Establish connection with MongoDB
            _mongo_client = MongoClient(MONGO_URI)
        except ConnectionFailure as e:
            raise ConnectionFailure(f"Failed to connect to MongoDB: {e}")

    return _mongo_client


def get_database():
    client = get_mongo_client()
    
    database_name = os.getenv("MONGO_DB_NAME")
    if not database_name:
        raise ValueError("MONGO_DB_NAME not set in .env file")
    
    return client[database_name]


def close_database_connection():
    global _mongo_client

    if _mongo_client:
        _mongo_client.close()
        _mongo_client = None
