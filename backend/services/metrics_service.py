from datetime import datetime, timezone
import re


def _parse_datetime(value):
    if not value:
        return None

    if isinstance(value, datetime):
        return value if value.tzinfo else value.replace(tzinfo=timezone.utc)

    try:
        parsed = datetime.fromisoformat(value)
        if parsed.tzinfo is None:
            parsed = parsed.replace(tzinfo=timezone.utc)
        return parsed
    except (ValueError, TypeError):
        return None


def parse_quantity(quantity):
    if quantity is None:
        return 1

    match = re.search(r"(\d+(?:\.\d+)?)", str(quantity))
    if not match:
        return 1

    try:
        return float(match.group(1))
    except ValueError:
        return 1


def get_urgency(expiry_time):
    expiry = _parse_datetime(expiry_time)
    if not expiry:
        return "safe"

    now = datetime.now(timezone.utc)
    diff = (expiry - now).total_seconds()

    if diff <= 0:
        return "urgent"
    if diff <= 3600:
        return "urgent"
    if diff <= 3 * 3600:
        return "medium"
    return "safe"


def build_heatmap_points(foods):
    points = []

    for food in foods:
        lat = food.get("latitude")
        lng = food.get("longitude")

        if lat is None or lng is None:
            location = food.get("location") or {}
            lat = lat or location.get("lat")
            lng = lng or location.get("lng")

        if lat is None or lng is None:
            continue

        weight = float(food.get("quantity_value", 1) or 1)
        points.append({"lat": lat, "lng": lng, "weight": weight})

    return points


def compute_impact_metrics(foods):
    total_quantity = sum(parse_quantity(food.get("quantity")) for food in foods)
    completed = sum(1 for food in foods if food.get("status") in {"picked", "completed"})

    return {
        "meals_saved": int(total_quantity),
        "waste_reduced_kg": round(total_quantity * 0.5, 1),
        "people_fed": int(total_quantity / 2),
        "completed_pickups": completed,
    }
