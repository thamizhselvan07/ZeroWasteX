from copy import deepcopy
from datetime import datetime, timedelta, timezone


def _iso_after(hours):
    return (datetime.now(timezone.utc) + timedelta(hours=hours)).isoformat()


def _iso_ago(hours):
    return (datetime.now(timezone.utc) - timedelta(hours=hours)).isoformat()


_VOLUNTEER_NAMES = [
    "Ananya Sharma", "Karthik Rajan", "Priya Menon", "Deepak Nair",
    "Sruthi Krishnan", "Arjun Bhat", "Meera Iyer", "Vishal Reddy",
]

_NGO_NAMES = [
    "FeedIndia NGO", "NoWaste Foundation", "MealShare Trust",
]

_DONOR_NAMES = [
    "Hotel Saravana Bhavan", "Annapoorna Kitchen", "Chennai Spice Co",
    "Green Leaf Canteen", "Royal Biryani House", "Madras Meals",
    "Dosa Junction", "Curry Palace", "Fresh Bites Cafe",
    "South Kitchen Express",
]


def build_sample_foods():
    items = [
        # ---- 🔴 URGENT: < 1 hour left (5 items) ----
        {
            "name": "Veg Meals",
            "quantity": "20 boxes",
            "type": "veg",
            "status": "available",
            "latitude": 13.0827,
            "longitude": 80.2707,
            "expiry_hours": 0.3,
            "address": "Anna Nagar, Chennai",
            "donor_name": "Hotel Saravana Bhavan",
        },
        {
            "name": "Chicken Biryani",
            "quantity": "15 packs",
            "type": "non-veg",
            "status": "available",
            "latitude": 13.0870,
            "longitude": 80.2750,
            "expiry_hours": 0.5,
            "address": "T Nagar, Chennai",
            "donor_name": "Royal Biryani House",
        },
        {
            "name": "Idli Sambar",
            "quantity": "30 plates",
            "type": "veg",
            "status": "available",
            "latitude": 13.0800,
            "longitude": 80.2650,
            "expiry_hours": 0.7,
            "address": "Egmore, Chennai",
            "donor_name": "Annapoorna Kitchen",
        },
        {
            "name": "Veg Sandwich",
            "quantity": "40 pieces",
            "type": "veg",
            "status": "requested",
            "latitude": 13.0810,
            "longitude": 80.2670,
            "expiry_hours": 0.4,
            "address": "Royapettah, Chennai",
            "donor_name": "Fresh Bites Cafe",
            "volunteer_idx": 0,
        },
        {
            "name": "Egg Omelette",
            "quantity": "35 pieces",
            "type": "non-veg",
            "status": "requested",
            "latitude": 13.1250,
            "longitude": 80.3200,
            "expiry_hours": 0.8,
            "address": "Saidapet, Chennai",
            "donor_name": "South Kitchen Express",
            "volunteer_idx": 1,
        },
        # ---- 🟡 WARNING: 1–3 hours left (8 items) ----
        {
            "name": "Egg Rice",
            "quantity": "18 boxes",
            "type": "non-veg",
            "status": "available",
            "latitude": 13.0900,
            "longitude": 80.2800,
            "expiry_hours": 1.5,
            "address": "Nungambakkam, Chennai",
            "donor_name": "Chennai Spice Co",
        },
        {
            "name": "Curd Rice",
            "quantity": "25 boxes",
            "type": "veg",
            "status": "available",
            "latitude": 13.0780,
            "longitude": 80.2600,
            "expiry_hours": 2.0,
            "address": "Mylapore, Chennai",
            "donor_name": "Dosa Junction",
        },
        {
            "name": "Fish Curry Meal",
            "quantity": "12 packs",
            "type": "non-veg",
            "status": "available",
            "latitude": 13.0950,
            "longitude": 80.2900,
            "expiry_hours": 1.2,
            "address": "Alwarpet, Chennai",
            "donor_name": "Curry Palace",
        },
        {
            "name": "Lemon Rice",
            "quantity": "22 boxes",
            "type": "veg",
            "status": "available",
            "latitude": 13.0850,
            "longitude": 80.2680,
            "expiry_hours": 2.5,
            "address": "Kilpauk, Chennai",
            "donor_name": "Green Leaf Canteen",
        },
        {
            "name": "Tomato Rice",
            "quantity": "24 boxes",
            "type": "veg",
            "status": "requested",
            "latitude": 13.0760,
            "longitude": 80.2580,
            "expiry_hours": 1.8,
            "address": "Kandhanchavadi, Chennai",
            "donor_name": "Madras Meals",
            "volunteer_idx": 2,
        },
        {
            "name": "Veg Pulao",
            "quantity": "20 packs",
            "type": "veg",
            "status": "requested",
            "latitude": 13.0835,
            "longitude": 80.2725,
            "expiry_hours": 2.8,
            "address": "Adyar, Chennai",
            "donor_name": "Annapoorna Kitchen",
            "volunteer_idx": 3,
        },
        {
            "name": "Chicken Noodles",
            "quantity": "18 packs",
            "type": "non-veg",
            "status": "available",
            "latitude": 13.1050,
            "longitude": 80.3000,
            "expiry_hours": 1.3,
            "address": "Teynampet, Chennai",
            "donor_name": "Chennai Spice Co",
        },
        {
            "name": "Egg Curry Meal",
            "quantity": "16 boxes",
            "type": "non-veg",
            "status": "available",
            "latitude": 13.0920,
            "longitude": 80.2780,
            "expiry_hours": 2.2,
            "address": "Besant Nagar, Chennai",
            "donor_name": "Curry Palace",
        },
        # ---- 🟢 SAFE: > 3 hours left (7 items) ----
        {
            "name": "Chicken Fried Rice",
            "quantity": "14 boxes",
            "type": "non-veg",
            "status": "available",
            "latitude": 13.1000,
            "longitude": 80.2950,
            "expiry_hours": 5.0,
            "address": "Chetpet, Chennai",
            "donor_name": "Royal Biryani House",
        },
        {
            "name": "Grilled Chicken",
            "quantity": "10 plates",
            "type": "non-veg",
            "status": "available",
            "latitude": 13.1100,
            "longitude": 80.3050,
            "expiry_hours": 6.0,
            "address": "Velachery, Chennai",
            "donor_name": "South Kitchen Express",
        },
        {
            "name": "Chapati & Veg Curry",
            "quantity": "28 meals",
            "type": "veg",
            "status": "available",
            "latitude": 13.0790,
            "longitude": 80.2620,
            "expiry_hours": 4.5,
            "address": "Mandaveli, Chennai",
            "donor_name": "Green Leaf Canteen",
        },
        {
            "name": "Mutton Biryani",
            "quantity": "12 packs",
            "type": "non-veg",
            "status": "available",
            "latitude": 13.1150,
            "longitude": 80.3100,
            "expiry_hours": 8.0,
            "address": "Guindy, Chennai",
            "donor_name": "Royal Biryani House",
        },
        {
            "name": "Paneer Butter Masala",
            "quantity": "15 boxes",
            "type": "veg",
            "status": "available",
            "latitude": 13.0840,
            "longitude": 80.2690,
            "expiry_hours": 5.5,
            "address": "RA Puram, Chennai",
            "donor_name": "Hotel Saravana Bhavan",
        },
        {
            "name": "Chicken Shawarma",
            "quantity": "25 rolls",
            "type": "non-veg",
            "status": "available",
            "latitude": 13.1350,
            "longitude": 80.3300,
            "expiry_hours": 7.0,
            "address": "Ambattur, Chennai",
            "donor_name": "Chennai Spice Co",
        },
        {
            "name": "Mixed Veg Curry",
            "quantity": "30 servings",
            "type": "veg",
            "status": "available",
            "latitude": 13.0795,
            "longitude": 80.2635,
            "expiry_hours": 3.5,
            "address": "Tondiarpet, Chennai",
            "donor_name": "Madras Meals",
        },
        # ---- ✅ PICKED / COMPLETED items (for leaderboard data) ----
        {
            "name": "Chicken Curry",
            "quantity": "14 meals",
            "type": "non-veg",
            "status": "picked",
            "latitude": 13.1200,
            "longitude": 80.3150,
            "expiry_hours": -0.5,
            "address": "Tiruvanmiyur, Chennai",
            "donor_name": "Curry Palace",
            "volunteer_idx": 0,
            "was_urgent": True,
        },
        {
            "name": "Vegetable Upma",
            "quantity": "26 plates",
            "type": "veg",
            "status": "picked",
            "latitude": 13.0770,
            "longitude": 80.2590,
            "expiry_hours": 0.2,
            "address": "Kailash Colony, Chennai",
            "donor_name": "Dosa Junction",
            "volunteer_idx": 1,
            "was_urgent": True,
        },
        {
            "name": "Veg Noodles",
            "quantity": "22 boxes",
            "type": "veg",
            "status": "picked",
            "latitude": 13.0820,
            "longitude": 80.2710,
            "expiry_hours": 1.5,
            "address": "Perambur, Chennai",
            "donor_name": "Green Leaf Canteen",
            "volunteer_idx": 2,
        },
        {
            "name": "Vegetable Biryani",
            "quantity": "18 packs",
            "type": "veg",
            "status": "picked",
            "latitude": 13.0860,
            "longitude": 80.2730,
            "expiry_hours": 2.0,
            "address": "Mogappair, Chennai",
            "donor_name": "Madras Meals",
            "volunteer_idx": 3,
        },
        {
            "name": "Fish Fry",
            "quantity": "20 pieces",
            "type": "non-veg",
            "status": "picked",
            "latitude": 13.1300,
            "longitude": 80.3250,
            "expiry_hours": -0.2,
            "address": "Ashok Nagar, Chennai",
            "donor_name": "South Kitchen Express",
            "volunteer_idx": 4,
            "was_urgent": True,
        },
    ]

    foods = []
    now_iso = datetime.now(timezone.utc).isoformat()

    for index, item in enumerate(items, start=1):
        donor_name = item.get("donor_name", f"FoodBridge Donor {index}")
        donor_id = f"sample-donor-{index}"

        food_entry = {
            "name": item["name"],
            "quantity": item["quantity"],
            "type": item["type"],
            "status": item["status"],
            "donor_id": donor_id,
            "requester_id": None,
            "donor_user_id": donor_id,
            "requested_user_id": None,
            "latitude": item["latitude"],
            "longitude": item["longitude"],
            "location": {
                "address": item["address"],
                "lat": item["latitude"],
                "lng": item["longitude"],
            },
            "expiry_time": _iso_after(item["expiry_hours"]),
            "created_at": _iso_ago(2),
            "updated_at": now_iso,
            "pickup_notes": "Coordinate with the donor contact before arrival.",
            "donor": {
                "user_id": donor_id,
                "name": donor_name,
                "email": f"donor{index}@foodbridge.local",
                "role": "donor",
            },
            "requested_by": None,
            "image_url": "",
            "is_sample_data": True,
        }

        # Add volunteer data for requested/picked items
        vol_idx = item.get("volunteer_idx")
        if vol_idx is not None and vol_idx < len(_VOLUNTEER_NAMES):
            vol_name = _VOLUNTEER_NAMES[vol_idx]
            vol_id = f"sample-volunteer-{vol_idx + 1}"
            volunteer_data = {
                "user_id": vol_id,
                "name": vol_name,
                "email": f"volunteer{vol_idx + 1}@foodbridge.local",
                "role": "volunteer",
            }
            food_entry["requested_by"] = volunteer_data
            food_entry["user_id"] = vol_id
            food_entry["requester_id"] = vol_id
            food_entry["requested_user_id"] = vol_id
            food_entry["requested_at"] = _iso_ago(1)

            if item["status"] == "picked":
                food_entry["picked_by"] = volunteer_data
                food_entry["picked_at"] = _iso_ago(0.5)

        foods.append(food_entry)

    return foods

def build_sample_activities(foods):
    activities = []

    for index, food in enumerate(foods, start=1):
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

        # Add pickup activities for picked items
        if food["status"] == "picked" and food.get("picked_by"):
            activities.append(
                {
                    "action": "pickup_completed",
                    "message": f"{food['picked_by']['name']} completed pickup for {food['name']}",
                    "actor": food["picked_by"],
                    "target": {
                        "food_id": str(index),
                        "food_name": food["name"],
                        "status": "picked",
                        "type": food["type"],
                        "donor_id": food["donor_id"],
                        "requester_id": food.get("requester_id"),
                    },
                    "created_at": food.get("picked_at", food["created_at"]),
                    "is_sample_data": True,
                }
            )

        # Add request activities for requested items
        if food["status"] in {"requested", "picked"} and food.get("requested_by"):
            activities.append(
                {
                    "action": "pickup_requested",
                    "message": f"{food['requested_by']['name']} requested pickup for {food['name']}",
                    "actor": food["requested_by"],
                    "target": {
                        "food_id": str(index),
                        "food_name": food["name"],
                        "status": "requested",
                        "type": food["type"],
                        "donor_id": food["donor_id"],
                        "requester_id": food.get("requester_id"),
                    },
                    "created_at": food.get("requested_at", food["created_at"]),
                    "is_sample_data": True,
                }
            )

    activities.sort(key=lambda item: item["created_at"], reverse=True)
    return activities


def seed_sample_data(food_collection, activity_collection=None):
    # Always drop and recreate sample data so they have fresh expiry dates
    food_collection.delete_many({"is_sample_data": True})
    if activity_collection is not None:
        activity_collection.delete_many({"is_sample_data": True})

    fresh_foods = build_sample_foods()

    for food in fresh_foods:
        food_collection.insert_one(food)

    inserted_activities = 0
    if activity_collection is not None:
        sample_activities = build_sample_activities(fresh_foods)
        for activity in sample_activities:
            activity_collection.insert_one(activity)
        inserted_activities = len(sample_activities)

    return {
        "inserted_foods": len(fresh_foods),
        "inserted_activities": inserted_activities,
        "skipped": False,
    }
