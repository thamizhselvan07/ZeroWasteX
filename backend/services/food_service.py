from bson import ObjectId
from bson.errors import InvalidId

from services.mongo_service import get_food_collection


def serialize_food(food_document):
    if not food_document:
        return None

    serialized_food = dict(food_document)
    serialized_food["id"] = str(serialized_food.pop("_id"))
    location = serialized_food.get("location") or {}
    latitude = serialized_food.get("latitude", location.get("lat"))
    longitude = serialized_food.get("longitude", location.get("lng"))
    address = location.get("address") or serialized_food.get("address", "")

    serialized_food["latitude"] = latitude
    serialized_food["longitude"] = longitude
    serialized_food["location"] = {
        "address": address,
        "lat": latitude,
        "lng": longitude,
    }

    if serialized_food.get("user_id") is None:
        serialized_food["user_id"] = (
            serialized_food.get("requested_user_id")
            or serialized_food.get("requester_id")
            or (serialized_food.get("requested_by") or {}).get("user_id")
        )
    return serialized_food


def _resolve_queries(food_identifier):
    queries = []

    try:
        queries.append({"_id": ObjectId(food_identifier)})
    except (InvalidId, TypeError):
        pass

    queries.append({"_id": str(food_identifier)})
    queries.append({"name": food_identifier})
    return queries


def _load_documents():
    collection = get_food_collection()
    documents = list(collection.find())
    documents.sort(
        key=lambda item: item.get("updated_at") or item.get("created_at") or "",
        reverse=True,
    )
    return collection, documents


def save_food_data(food_item):
    collection = get_food_collection()
    inserted = collection.insert_one(food_item)
    return get_food_by_identifier(str(inserted.inserted_id))


def fetch_all_food(status=None):
    _, documents = _load_documents()
    foods = [serialize_food(food) for food in documents]

    if status:
        foods = [food for food in foods if food.get("status") == status]

    return foods


def fetch_user_requests(user_id):
    _, documents = _load_documents()
    foods = [serialize_food(food) for food in documents]
    return [
        food
        for food in foods
        if food.get("user_id") == user_id and food.get("status") == "requested"
    ]


def update_food_status(food_identifier, status, extra_fields=None, required_current_status=None):
    collection = get_food_collection()
    query = None
    food_item = None

    for candidate in _resolve_queries(food_identifier):
        food_item = collection.find_one(candidate)
        if food_item:
            query = candidate
            break

    if not food_item:
        return None

    if required_current_status and food_item.get("status") != required_current_status:
        return None

    update_payload = {"status": status}
    if extra_fields:
        update_payload.update(extra_fields)

    collection.update_one(query, {"$set": update_payload})
    return get_food_by_identifier(food_identifier)


def get_food_by_identifier(food_identifier):
    collection, documents = _load_documents()
    document = None

    for query in _resolve_queries(food_identifier):
        document = collection.find_one(query)
        if document:
            break

    if document:
        return serialize_food(document)

    food_identifier = str(food_identifier)
    for item in documents:
        if str(item.get("_id")) == food_identifier:
            return serialize_food(item)

    return None
