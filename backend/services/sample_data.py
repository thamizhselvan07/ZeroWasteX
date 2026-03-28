from copy import deepcopy
from datetime import datetime, timedelta, timezone


def _iso_after(hours):
    return (datetime.now(timezone.utc) + timedelta(hours=hours)).isoformat()


_SAMPLE_ITEMS = [
    {
        "name": "Veg Meals",
        "quantity": "20 boxes",
        "type": "veg",
        "status": "available",
        "latitude": 13.0827,
        "longitude": 80.2707,
        "expiry_time": "2026-03-28T18:30:00",
        "created_at": "2026-03-28T12:00:00",
        "address": "Anna Nagar, Chennai"
    },
    {
        "name": "Chicken Biryani",
        "quantity": "15 packs",
        "type": "non-veg",
        "status": "available",
        "latitude": 13.0870,
        "longitude": 80.2750,
        "expiry_time": "2026-03-28T17:00:00",
        "created_at": "2026-03-28T12:05:00",
        "address": "T Nagar, Chennai"
    },
    {
        "name": "Idli Sambar",
        "quantity": "30 plates",
        "type": "veg",
        "status": "available",
        "latitude": 13.0800,
        "longitude": 80.2650,
        "expiry_time": "2026-03-28T16:30:00",
        "created_at": "2026-03-28T12:10:00",
        "address": "Egmore, Chennai"
    },
    {
        "name": "Egg Rice",
        "quantity": "18 boxes",
        "type": "non-veg",
        "status": "available",
        "latitude": 13.0900,
        "longitude": 80.2800,
        "expiry_time": "2026-03-28T19:00:00",
        "created_at": "2026-03-28T12:15:00",
        "address": "Nungambakkam, Chennai"
    },
    {
        "name": "Curd Rice",
        "quantity": "25 boxes",
        "type": "veg",
        "status": "available",
        "latitude": 13.0780,
        "longitude": 80.2600,
        "expiry_time": "2026-03-28T17:30:00",
        "created_at": "2026-03-28T12:20:00",
        "address": "Mylapore, Chennai"
    },
    {
        "name": "Fish Curry Meal",
        "quantity": "12 packs",
        "type": "non-veg",
        "status": "available",
        "latitude": 13.0950,
        "longitude": 80.2900,
        "expiry_time": "2026-03-28T18:45:00",
        "created_at": "2026-03-28T12:25:00",
        "address": "Alwarpet, Chennai"
    },
    {
        "name": "Lemon Rice",
        "quantity": "22 boxes",
        "type": "veg",
        "status": "available",
        "latitude": 13.0850,
        "longitude": 80.2680,
        "expiry_time": "2026-03-28T17:10:00",
        "created_at": "2026-03-28T12:30:00",
        "address": "Kilpauk, Chennai"
    },
    {
        "name": "Chicken Fried Rice",
        "quantity": "14 boxes",
        "type": "non-veg",
        "status": "available",
        "latitude": 13.1000,
        "longitude": 80.2950,
        "expiry_time": "2026-03-28T20:00:00",
        "created_at": "2026-03-28T12:35:00",
        "address": "Chetpet, Chennai"
    },
    {
        "name": "Veg Pulao",
        "quantity": "20 packs",
        "type": "veg",
        "status": "available",
        "latitude": 13.0835,
        "longitude": 80.2725,
        "expiry_time": "2026-03-28T18:00:00",
        "created_at": "2026-03-28T12:40:00",
        "address": "Adyar, Chennai"
    },
    {
        "name": "Egg Curry Meal",
        "quantity": "16 boxes",
        "type": "non-veg",
        "status": "available",
        "latitude": 13.0920,
        "longitude": 80.2780,
        "expiry_time": "2026-03-28T19:15:00",
        "created_at": "2026-03-28T12:45:00",
        "address": "Besant Nagar, Chennai"
    },
    {
        "name": "Tomato Rice",
        "quantity": "24 boxes",
        "type": "veg",
        "status": "available",
        "latitude": 13.0760,
        "longitude": 80.2580,
        "expiry_time": "2026-03-28T17:50:00",
        "created_at": "2026-03-28T12:50:00",
        "address": "Kandhanchavadi, Chennai"
    },
    {
        "name": "Chicken Noodles",
        "quantity": "18 packs",
        "type": "non-veg",
        "status": "available",
        "latitude": 13.1050,
        "longitude": 80.3000,
        "expiry_time": "2026-03-28T20:30:00",
        "created_at": "2026-03-28T12:55:00",
        "address": "Teynampet, Chennai"
    },
    {
        "name": "Veg Sandwich",
        "quantity": "40 pieces",
        "type": "veg",
        "status": "available",
        "latitude": 13.0810,
        "longitude": 80.2670,
        "expiry_time": "2026-03-28T16:00:00",
        "created_at": "2026-03-28T13:00:00",
        "address": "Royapettah, Chennai"
    },
    {
        "name": "Grilled Chicken",
        "quantity": "10 plates",
        "type": "non-veg",
        "status": "available",
        "latitude": 13.1100,
        "longitude": 80.3050,
        "expiry_time": "2026-03-28T21:00:00",
        "created_at": "2026-03-28T13:05:00",
        "address": "Velachery, Chennai"
    },
    {
        "name": "Chapati & Veg Curry",
        "quantity": "28 meals",
        "type": "veg",
        "status": "available",
        "latitude": 13.0790,
        "longitude": 80.2620,
        "expiry_time": "2026-03-28T18:20:00",
        "created_at": "2026-03-28T13:10:00",
        "address": "Mandaveli, Chennai"
    },
    {
        "name": "Mutton Biryani",
        "quantity": "12 packs",
        "type": "non-veg",
        "status": "available",
        "latitude": 13.1150,
        "longitude": 80.3100,
        "expiry_time": "2026-03-28T21:30:00",
        "created_at": "2026-03-28T13:15:00",
        "address": "Guindy, Chennai"
    },
    {
        "name": "Paneer Butter Masala",
        "quantity": "15 boxes",
        "type": "veg",
        "status": "available",
        "latitude": 13.0840,
        "longitude": 80.2690,
        "expiry_time": "2026-03-28T18:10:00",
        "created_at": "2026-03-28T13:20:00",
        "address": "RA Puram, Chennai"
    },
    {
        "name": "Chicken Curry",
        "quantity": "14 meals",
        "type": "non-veg",
        "status": "available",
        "latitude": 13.1200,
        "longitude": 80.3150,
        "expiry_time": "2026-03-28T22:00:00",
        "created_at": "2026-03-28T13:25:00",
        "address": "Tiruvanmiyur, Chennai"
    },
    {
        "name": "Vegetable Upma",
        "quantity": "26 plates",
        "type": "veg",
        "status": "available",
        "latitude": 13.0770,
        "longitude": 80.2590,
        "expiry_time": "2026-03-28T16:45:00",
        "created_at": "2026-03-28T13:30:00",
        "address": "Kailash Colony, Chennai"
    },
    {
        "name": "Egg Omelette",
        "quantity": "35 pieces",
        "type": "non-veg",
        "status": "available",
        "latitude": 13.1250,
        "longitude": 80.3200,
        "expiry_time": "2026-03-28T20:15:00",
        "created_at": "2026-03-28T13:35:00",
        "address": "Saidapet, Chennai"
    },
    {
        "name": "Vegetable Biryani",
        "quantity": "18 packs",
        "type": "veg",
        "status": "available",
        "latitude": 13.0860,
        "longitude": 80.2730,
        "expiry_time": "2026-03-28T18:40:00",
        "created_at": "2026-03-28T13:40:00",
        "address": "Mogappair, Chennai"
    },
    {
        "name": "Fish Fry",
        "quantity": "20 pieces",
        "type": "non-veg",
        "status": "available",
        "latitude": 13.1300,
        "longitude": 80.3250,
        "expiry_time": "2026-03-28T21:45:00",
        "created_at": "2026-03-28T13:45:00",
        "address": "Ashok Nagar, Chennai"
    },
    {
        "name": "Veg Noodles",
        "quantity": "22 boxes",
        "type": "veg",
        "status": "available",
        "latitude": 13.0820,
        "longitude": 80.2710,
        "expiry_time": "2026-03-28T17:55:00",
        "created_at": "2026-03-28T13:50:00",
        "address": "Perambur, Chennai"
    },
    {
        "name": "Chicken Shawarma",
        "quantity": "25 rolls",
        "type": "non-veg",
        "status": "available",
        "latitude": 13.1350,
        "longitude": 80.3300,
        "expiry_time": "2026-03-28T22:30:00",
        "created_at": "2026-03-28T13:55:00",
        "address": "Ambattur, Chennai"
    },
    {
        "name": "Mixed Veg Curry",
        "quantity": "30 servings",
        "type": "veg",
        "status": "available",
        "latitude": 13.0795,
        "longitude": 80.2635,
        "expiry_time": "2026-03-28T18:25:00",
        "created_at": "2026-03-28T14:00:00",
        "address": "Tondiarpet, Chennai"
    },
]


def build_sample_foods():
    foods = []

    for index, item in enumerate(_SAMPLE_ITEMS, start=1):
        foods.append(
            {
                "name": item["name"],
                "quantity": item["quantity"],
                "type": item["type"],
                "status": item["status"],
                "donor_id": f"sample-donor-{index}",
                "requester_id": None,
                "donor_user_id": f"sample-donor-{index}",
                "requested_user_id": None,
                "latitude": item["latitude"],
                "longitude": item["longitude"],
                "location": {
                    "address": item["address"],
                    "lat": item["latitude"],
                    "lng": item["longitude"]
                },
                "expiry_time": item["expiry_time"],
                "created_at": item["created_at"],
                "updated_at": item["created_at"],
                "pickup_notes": "Coordinate with the donor contact before arrival.",
                "donor": {
                    "user_id": f"sample-donor-{index}",
                    "name": f"FoodBridge Donor {index}",
                    "email": f"donor{index}@foodbridge.local",
                    "role": "donor",
                },
                "requested_by": None,
                "image_url": "",
                "is_sample_data": True,
            }
        )

    return foods


SAMPLE_FOODS = build_sample_foods()


def build_sample_activities():
    activities = []

    for index, food in enumerate(SAMPLE_FOODS, start=1):
        activities.append(
            {
                "action": "food_added",
                "message": f"{food['donor']['name']} added {food['name']}",
                "actor": {
                    "user_id": food["donor"]["user_id"],
                    "name": food["donor"]["name"],
                    "role": "donor",
                },
                "target": {
                    "food_id": str(index),
                    "food_name": food["name"],
                    "status": food["status"],
                    "type": food["type"],
                    "donor_id": food["donor_id"],
                    "requester_id": food["requester_id"],
                },
                "created_at": food["created_at"],
                "is_sample_data": True,
            }
        )

    activities.sort(key=lambda item: item["created_at"], reverse=True)
    return activities


def seed_sample_data(food_collection, activity_collection=None):
    existing_sample_foods = food_collection.count_documents({"is_sample_data": True})
    if existing_sample_foods > 0:
        return {"inserted_foods": 0, "inserted_activities": 0, "skipped": True}

    for food in deepcopy(SAMPLE_FOODS):
        food_collection.insert_one(food)

    inserted_activities = 0
    if activity_collection is not None:
        existing_sample_activities = activity_collection.count_documents({"is_sample_data": True})
        if existing_sample_activities == 0:
            sample_activities = build_sample_activities()
            for activity in deepcopy(sample_activities):
                activity_collection.insert_one(activity)
            inserted_activities = len(sample_activities)

    return {
        "inserted_foods": len(SAMPLE_FOODS),
        "inserted_activities": inserted_activities,
        "skipped": False,
    }
