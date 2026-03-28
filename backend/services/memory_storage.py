# In-memory storage for development (no MongoDB required)
import os
from copy import deepcopy

from services.sample_data import SAMPLE_FOODS, build_sample_activities

_users = {}
_foods = {}
_activities = {}

USE_MEMORY_STORAGE = os.getenv("USE_MEMORY_STORAGE", "true").lower() == "true"


class MemoryCollection:
    """Simple in-memory collection for development"""
    
    def __init__(self, data_dict):
        self.data = data_dict
        self.counter = max([int(k) for k in data_dict.keys()]) + 1 if data_dict else 1
    
    def find_one(self, query):
        for doc in self.data.values():
            match = True
            for key, value in query.items():
                if doc.get(key) != value:
                    match = False
                    break
            if match:
                return doc
        return None
    
    def insert_one(self, document):
        doc_id = str(self.counter)
        self.counter += 1
        document["_id"] = doc_id
        self.data[doc_id] = document
        
        class InsertResult:
            def __init__(self, inserted_id):
                self.inserted_id = inserted_id
        
        return InsertResult(doc_id)
    
    def find(self, query=None):
        return list(self.data.values())
    
    def update_one(self, query, update_doc):
        doc = self.find_one(query)
        if doc:
            if "$set" in update_doc:
                doc.update(update_doc["$set"])
        return doc
    
    def count_documents(self, query):
        """Count documents matching the query"""
        count = 0
        for doc in self.data.values():
            match = True
            for key, value in query.items():
                if doc.get(key) != value:
                    match = False
                    break
            if match:
                count += 1
        return count


def _initialize_sample_data():
    """Initialize sample data once"""
    global _foods, _activities
    
    if not _foods:
        for index, food in enumerate(deepcopy(SAMPLE_FOODS), start=1):
            _foods[str(index)] = {"_id": str(index), **food}
        print(f"[INFO] Seeded {len(_foods)} sample food items in memory")
    
    if not _activities:
        for index, activity in enumerate(deepcopy(build_sample_activities()), start=1):
            _activities[str(index)] = {"_id": str(index), **activity}
        print(f"[INFO] Seeded {len(_activities)} sample activities in memory")


def get_user_collection_memory():
    """Get in-memory user collection"""
    return MemoryCollection(_users)


def get_food_collection_memory():
    """Get in-memory food collection"""
    _initialize_sample_data()
    return MemoryCollection(_foods)


def get_activity_collection_memory():
    """Get in-memory activity collection"""
    _initialize_sample_data()
    return MemoryCollection(_activities)
