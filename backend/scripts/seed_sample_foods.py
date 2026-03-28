from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from services.mongo_service import get_activity_collection, get_food_collection  # noqa: E402
from services.sample_data import seed_sample_data  # noqa: E402


def main():
    food_collection = get_food_collection()
    activity_collection = get_activity_collection()
    result = seed_sample_data(food_collection, activity_collection)

    if result["skipped"]:
        print("Sample data already exists. No duplicate records inserted.")
    else:
        print(
            f"Seeded {result['inserted_foods']} sample foods and {result['inserted_activities']} activity records."
        )


if __name__ == "__main__":
    main()
