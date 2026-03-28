from services.mongo_service import get_user_collection


def serialize_user(user_document):
    return {
        "id": str(user_document["_id"]),
        "name": user_document["name"],
        "email": user_document["email"],
        "role": user_document.get("role", "volunteer"),
    }


def get_user_by_email(email):
    collection = get_user_collection()
    return collection.find_one({"email": email})


def create_user(user_payload):
    collection = get_user_collection()
    inserted = collection.insert_one(user_payload)
    saved_user = collection.find_one({"_id": inserted.inserted_id})
    return serialize_user(saved_user)
