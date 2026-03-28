from flask import Blueprint, jsonify

from services.food_service import fetch_all_food
from services.metrics_service import (
    build_heatmap_points,
    compute_impact_metrics,
    get_urgency,
    parse_quantity,
)

metrics_blueprint = Blueprint("metrics", __name__)


@metrics_blueprint.route("/api/metrics", methods=["GET"])
def get_metrics():
    try:
        foods = fetch_all_food()
        metrics = compute_impact_metrics(foods)
        heatmap = build_heatmap_points(foods)

        return jsonify({
            "success": True,
            "metrics": metrics,
            "heatmap": heatmap,
        }), 200
    except Exception:
        return jsonify({"success": False, "message": "Failed to compute metrics."}), 500


@metrics_blueprint.route("/api/leaderboard", methods=["GET"])
def get_leaderboard():
    try:
        foods = fetch_all_food()

        volunteer_scores = {}

        for food in foods:
            if food.get("status") not in {"picked", "completed", "requested"}:
                continue

            requester = (
                food.get("requested_by")
                or food.get("picked_by")
                or {}
            )
            user_id = (
                requester.get("user_id")
                or food.get("user_id")
                or food.get("requested_user_id")
                or food.get("requester_id")
            )
            user_name = requester.get("name", "Unknown Volunteer")
            user_role = requester.get("role", "volunteer")

            if not user_id:
                continue

            if user_id not in volunteer_scores:
                volunteer_scores[user_id] = {
                    "user_id": user_id,
                    "name": user_name,
                    "role": user_role,
                    "points": 0,
                    "pickups": 0,
                    "urgent_rescues": 0,
                }

            urgency = get_urgency(food.get("expiry_time"))
            is_urgent = food.get("was_urgent") or (urgency in {"urgent", "medium"})
            is_completed = food.get("status") in {"picked", "completed"}

            if is_completed:
                volunteer_scores[user_id]["pickups"] += 1
                volunteer_scores[user_id]["points"] += 10

                if is_urgent:
                    volunteer_scores[user_id]["urgent_rescues"] += 1
                    volunteer_scores[user_id]["points"] += 50

                qty = parse_quantity(food.get("quantity"))
                volunteer_scores[user_id]["points"] += int(qty)

        leaderboard = sorted(
            volunteer_scores.values(),
            key=lambda v: v["points"],
            reverse=True,
        )

        for rank, entry in enumerate(leaderboard, start=1):
            entry["rank"] = rank

        return jsonify({
            "success": True,
            "leaderboard": leaderboard[:25],
            "total_volunteers": len(leaderboard),
        }), 200
    except Exception:
        return jsonify({"success": False, "message": "Failed to compute leaderboard."}), 500
