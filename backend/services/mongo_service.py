import os
from pymongo import MongoClient
from pymongo.errors import ServerSelectionTimeoutError, ConnectionFailure

from services.sample_data import seed_sample_data

_client = None
_connection_error = None
_use_memory_storage = False
_memory_storage_preferred = False


def get_mongo_client():
    global _client
    global _connection_error
    global _use_memory_storage

    # If we've already determined to use memory storage, don't try MongoDB again
    if _use_memory_storage:
        return None

    if _client is None:
        # Prefer memory storage in development unless explicitly using MongoDB
        if os.getenv("USE_MEMORY_STORAGE", "true").lower() == "true":
            _use_memory_storage = True
            print("[INFO] Using in-memory storage (set USE_MEMORY_STORAGE=false to use MongoDB)")
            return None

        mongo_uri = os.getenv("MONGO_URI")
        if not mongo_uri:
            _connection_error = "MONGO_URI is not set in environment variables"
            _use_memory_storage = True
            print("[WARNING] MONGO_URI not configured. Using in-memory storage")
            return None
        
        try:
            _client = MongoClient(
                mongo_uri, 
                serverSelectionTimeoutMS=3000, 
                connectTimeoutMS=3000,
                retryWrites=False,
                authSource='admin'
            )
            # Test the connection with a short timeout
            _client.admin.command('ping', maxTimeMS=3000)
            print("[INFO] Connected to MongoDB successfully")
        except (ServerSelectionTimeoutError, ConnectionFailure, Exception) as e:
            _connection_error = f"Failed to connect to MongoDB: {str(e)}"
            _use_memory_storage = True
            _client = None
            print(f"[WARNING] {_connection_error}")
            print("[INFO] Falling back to in-memory storage")

    return _client


def is_using_memory_storage():
    """Check if we're using memory storage"""
    return _use_memory_storage


def get_food_collection():
    client = get_mongo_client()
    
    if client is None:
        # Use memory storage
        from services.memory_storage import get_food_collection_memory
        return get_food_collection_memory()
    
    database = client["foodbridge"]
    collection = database["foods"]
    activity_collection = database["activities"]
    seed_sample_data(collection, activity_collection)

    return collection


def get_user_collection():
    client = get_mongo_client()
    
    if client is None:
        # Use memory storage
        from services.memory_storage import get_user_collection_memory
        return get_user_collection_memory()
    
    database = client["foodbridge"]
    return database["users"]


def get_activity_collection():
    client = get_mongo_client()

    if client is None:
        from services.memory_storage import get_activity_collection_memory

        return get_activity_collection_memory()

    database = client["foodbridge"]
    collection = database["activities"]
    food_collection = database["foods"]
    seed_sample_data(food_collection, collection)

    return collection
