class FoodModel:
    @staticmethod
    def validate_payload(payload):
        required_fields = ["name", "quantity", "type", "location", "expiry_time"]
        missing_fields = [field for field in required_fields if field not in payload]

        if missing_fields:
            return False, f"Missing required fields: {', '.join(missing_fields)}"

        if payload.get("type") not in {"veg", "non-veg"}:
            return False, "type must be one of: veg, non-veg."

        location = payload.get("location")
        if not isinstance(location, dict):
            return False, "location must be an object with address, lat and lng."

        lat = location.get("lat")
        lng = location.get("lng")
        if lat is None or lng is None:
            return False, "location must include lat and lng."

        status = payload.get("status", "draft")
        allowed_statuses = {"draft", "available", "requested", "picked", "completed"}
        if status not in allowed_statuses:
            return False, "status must be one of: draft, available, requested, picked, completed."

        return True, None

    @staticmethod
    def from_payload(payload):
        location = {
            "address": payload["location"].get("address", ""),
            "lat": payload["location"]["lat"],
            "lng": payload["location"]["lng"],
        }

        food_item = {
            "name": payload["name"],
            "quantity": payload["quantity"],
            "type": payload["type"],
            "location": location,
            "latitude": location["lat"],
            "longitude": location["lng"],
            "expiry_time": payload["expiry_time"],
            "status": payload.get("status", "draft"),
            "user_id": payload.get("user_id"),
        }

        if payload.get("image_url"):
            food_item["image_url"] = payload["image_url"]

        if payload.get("pickup_notes"):
            food_item["pickup_notes"] = payload["pickup_notes"]

        return food_item
