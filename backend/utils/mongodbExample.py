"""
Install:
python -m pip install "pymongo[srv]"

Run:
set MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/?appName=Cluster0
python mongodbExample.py
"""

import json
import os
from datetime import datetime, timedelta, timezone

from bson import ObjectId
from pymongo import MongoClient
from pymongo.errors import PyMongoError


def load_mongodb_uri():
    # Prefer an environment variable so secrets stay out of source code.
    env_uri = os.getenv("MONGODB_URI")
    if env_uri:
        print("Using MONGODB_URI from environment variables.")
        return env_uri

    # Optional fallback for beginners who want a local config file.
    config_path = "mongodb.config.json"
    if os.path.exists(config_path):
        print(f"Using MongoDB URI from {config_path}.")
        with open(config_path, "r", encoding="utf-8") as config_file:
            data = json.load(config_file)
        return data.get("MONGODB_URI")

    raise ValueError(
        "MONGODB_URI was not found. Set it in your environment before running this file."
    )


def build_sample_documents():
    now = datetime.now(timezone.utc)

    # These documents model a simple FoodBridge activity feed.
    return [
        {
            "food_name": "Vegetable Rice Packets",
            "quantity": "20 packs",
            "location": "Chennai",
            "status": "available",
            "posted_at": now - timedelta(minutes=95),
            "posted_by": "Anna Nagar Community Kitchen",
        },
        {
            "food_name": "Banana Crates",
            "quantity": "3 crates",
            "location": "Coimbatore",
            "status": "available",
            "posted_at": now - timedelta(minutes=80),
            "posted_by": "Fresh Market Donor",
        },
        {
            "food_name": "Bread Loaves",
            "quantity": "15 loaves",
            "location": "Madurai",
            "status": "requested",
            "posted_at": now - timedelta(minutes=72),
            "posted_by": "City Bakery Outlet",
        },
        {
            "food_name": "Milk Packets",
            "quantity": "25 packets",
            "location": "Trichy",
            "status": "available",
            "posted_at": now - timedelta(minutes=60),
            "posted_by": "Morning Supply Chain",
        },
        {
            "food_name": "Idli Batter Buckets",
            "quantity": "4 buckets",
            "location": "Salem",
            "status": "available",
            "posted_at": now - timedelta(minutes=54),
            "posted_by": "Local Hotel Group",
        },
        {
            "food_name": "Cooked Dal Meals",
            "quantity": "30 servings",
            "location": "Vellore",
            "status": "picked",
            "posted_at": now - timedelta(minutes=43),
            "posted_by": "Volunteer Kitchen",
        },
        {
            "food_name": "Apples",
            "quantity": "18 kg",
            "location": "Erode",
            "status": "available",
            "posted_at": now - timedelta(minutes=32),
            "posted_by": "Wholesale Fruit Hub",
        },
        {
            "food_name": "Sandwich Boxes",
            "quantity": "12 boxes",
            "location": "Tirunelveli",
            "status": "requested",
            "posted_at": now - timedelta(minutes=24),
            "posted_by": "Office Cafeteria",
        },
        {
            "food_name": "Tomato Bags",
            "quantity": "10 bags",
            "location": "Thanjavur",
            "status": "available",
            "posted_at": now - timedelta(minutes=14),
            "posted_by": "Farm Surplus Partner",
        },
        {
            "food_name": "Curd Cups",
            "quantity": "40 cups",
            "location": "Karur",
            "status": "available",
            "posted_at": now - timedelta(minutes=5),
            "posted_by": "Dairy Donation Drive",
        },
    ]


def main():
    client = None

    try:
        mongodb_uri = load_mongodb_uri()
        print("Connecting to MongoDB Atlas...")
        client = MongoClient(mongodb_uri)

        # ping forces a real connection early, which is easier to debug.
        client.admin.command("ping")
        print("Connected successfully.")

        database = client["foodbridge"]
        collection = database["foods"]
        print("Using database 'foodbridge' and collection 'foods'.")

        documents = build_sample_documents()
        print(f"Inserting {len(documents)} sample food documents...")
        insert_result = collection.insert_many(documents)
        print(f"Inserted {len(insert_result.inserted_ids)} documents.")

        print("\nFetching the 5 most recent documents by posted_at...")
        recent_documents = list(collection.find().sort("posted_at", -1).limit(5))
        for index, document in enumerate(recent_documents, start=1):
            print(f"\nRecent document {index}:")
            print(document)

        target_id = insert_result.inserted_ids[0]
        print(f"\nFetching one full document by _id: {target_id}")
        one_document = collection.find_one({"_id": ObjectId(target_id)})
        print(one_document)

    except (ValueError, PyMongoError) as error:
        print(f"Error: {error}")
    finally:
        if client is not None:
            client.close()
            print("\nMongoDB connection closed.")


if __name__ == "__main__":
    main()
