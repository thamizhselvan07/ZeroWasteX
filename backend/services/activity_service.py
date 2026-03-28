from services.mongo_service import get_activity_collection


def serialize_activity(activity_document):
    if not activity_document:
        return None

    serialized = dict(activity_document)
    serialized["id"] = str(serialized.pop("_id"))
    return serialized


def record_activity(activity_payload):
    collection = get_activity_collection()
    inserted = collection.insert_one(activity_payload)
    saved = collection.find_one({"_id": inserted.inserted_id})
    return serialize_activity(saved)


def fetch_recent_activity(limit=20):
    collection = get_activity_collection()
    activities = [serialize_activity(activity) for activity in collection.find()]
    activities.sort(key=lambda item: item.get("created_at") or "", reverse=True)
    return activities[:limit]


def fetch_user_activity(user_id):
    activities = fetch_recent_activity(limit=500)
    return [
        activity
        for activity in activities
        if activity.get("actor", {}).get("user_id") == user_id
        or activity.get("target", {}).get("donor_id") == user_id
        or activity.get("target", {}).get("requester_id") == user_id
    ]
