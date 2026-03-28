from datetime import datetime, timezone

from flask import Blueprint, g, jsonify, request

from models.food_model import FoodModel
from services.activity_service import fetch_recent_activity, fetch_user_activity, record_activity
from services.auth_middleware import require_auth
from services.food_service import (
    fetch_all_food,
    fetch_user_requests,
    get_food_by_identifier,
    save_food_data,
    update_food_status,
)

food_blueprint = Blueprint("foods", __name__)


def _current_timestamp():
    return datetime.now(timezone.utc).isoformat()


def _record_activity(action, message, food):
    record_activity(
        {
            "action": action,
            "message": message,
            "actor": {
                "user_id": g.current_user["id"],
                "name": g.current_user["name"],
                "role": g.current_user.get("role", "volunteer"),
            },
            "target": {
                "food_id": food["id"],
                "food_name": food["name"],
                "status": food["status"],
                "type": food.get("type"),
                "donor_id": food.get("donor_user_id"),
                "requester_id": food.get("user_id") or food.get("requested_user_id"),
            },
            "created_at": _current_timestamp(),
        }
    )


def _build_food_response(status):
    foods = fetch_all_food(status=status)
    return jsonify({"success": True, "foods": foods, "count": len(foods)}), 200


@food_blueprint.route("/foods", methods=["GET"])
@food_blueprint.route("/api/foods", methods=["GET"])
def get_available_food():
    status = request.args.get("status") or "available"

    try:
        return _build_food_response(status)
    except Exception:
        return jsonify({"success": False, "message": "Failed to fetch food items."}), 500


@food_blueprint.route("/foods/all", methods=["GET"])
@food_blueprint.route("/api/foods/all", methods=["GET"])
def get_all_food():
    status = request.args.get("status")

    try:
        return _build_food_response(status)
    except Exception:
        return jsonify({"success": False, "message": "Failed to fetch food items."}), 500


@food_blueprint.route("/activity-feed", methods=["GET"])
def get_activity_feed():
    try:
        activities = fetch_recent_activity(limit=20)
        return jsonify({"success": True, "activities": activities, "count": len(activities)}), 200
    except Exception:
        return jsonify({"success": False, "message": "Failed to fetch activity feed."}), 500


@food_blueprint.route("/my-requests", methods=["GET"])
@food_blueprint.route("/api/my-requests", methods=["GET"])
@require_auth
def get_my_requests():
    try:
        foods = fetch_user_requests(g.current_user["id"])
        return jsonify({"success": True, "foods": foods, "count": len(foods)}), 200
    except Exception:
        return jsonify({"success": False, "message": "Failed to fetch your requests."}), 500


@food_blueprint.route("/user-history", methods=["GET"])
@require_auth
def get_user_history():
    try:
        history = fetch_user_activity(g.current_user["id"])
        return jsonify({"success": True, "history": history, "count": len(history)}), 200
    except Exception:
        return jsonify({"success": False, "message": "Failed to fetch user history."}), 500


@food_blueprint.route("/add-food", methods=["POST"])
@require_auth
def add_food():
    payload = request.get_json(silent=True) or {}
    is_valid, error_message = FoodModel.validate_payload(payload)

    if not is_valid:
        return jsonify({"success": False, "message": error_message}), 400

    requested_status = payload.get("status", "available")
    if requested_status not in {"draft", "available"}:
        return jsonify({"success": False, "message": "New food can only be saved as draft or available."}), 400

    try:
        timestamp = _current_timestamp()
        food_item = FoodModel.from_payload(payload)
        saved_food = save_food_data(
            {
                **food_item,
                "status": requested_status,
                "user_id": None,
                "donor_id": g.current_user["id"],
                "requester_id": None,
                "donor_user_id": g.current_user["id"],
                "requested_user_id": None,
                "donor": {
                    "user_id": g.current_user["id"],
                    "name": g.current_user["name"],
                    "email": g.current_user["email"],
                    "role": g.current_user.get("role", "donor"),
                },
                "created_at": timestamp,
                "updated_at": timestamp,
            }
        )
        _record_activity(
            "food_added",
            f"{g.current_user['name']} added {saved_food['name']} as {saved_food['status']}",
            saved_food,
        )
    except Exception:
        return jsonify({"success": False, "message": "Failed to add food item."}), 500

    return jsonify({"success": True, "message": "Food item added successfully.", "food": saved_food}), 201


@food_blueprint.route("/request-food", methods=["POST"])
@food_blueprint.route("/api/foods/<food_id>/request", methods=["PATCH"])
@require_auth
def request_food(food_id=None):
    payload = request.get_json(silent=True) or {}
    food_identifier = food_id or payload.get("id") or payload.get("name")

    if not food_identifier:
        return jsonify({"success": False, "message": "Food id or name is required."}), 400

    food_item = get_food_by_identifier(food_identifier)
    if not food_item:
        return jsonify({"success": False, "message": "Food item not found."}), 404

    if food_item.get("status") != "available":
        return jsonify({"success": False, "message": "Food item is not available for pickup."}), 409

    request_timestamp = _current_timestamp()

    try:
        updated_food = update_food_status(
            food_identifier,
            "requested",
            {
                "updated_at": request_timestamp,
                "requested_at": request_timestamp,
                "user_id": g.current_user["id"],
                "requester_id": g.current_user["id"],
                "requested_user_id": g.current_user["id"],
                "requested_by": {
                    "user_id": g.current_user["id"],
                    "name": g.current_user["name"],
                    "email": g.current_user["email"],
                    "role": g.current_user.get("role", "volunteer"),
                },
            },
            required_current_status="available",
        )
    except Exception:
        return jsonify({"success": False, "message": "Failed to request food item."}), 500

    if not updated_food:
        return jsonify({"success": False, "message": "Food item is no longer available."}), 409

    _record_activity(
        "pickup_requested",
        f"{g.current_user['name']} requested pickup for {updated_food['name']}",
        updated_food,
    )
    return jsonify({"success": True, "message": "Food request submitted successfully.", "food": updated_food}), 200


@food_blueprint.route("/mark-picked", methods=["POST"])
@food_blueprint.route("/pickup-food", methods=["POST"])
@require_auth
def pickup_food():
    payload = request.get_json(silent=True) or {}
    food_identifier = payload.get("id") or payload.get("name")

    if not food_identifier:
        return jsonify({"success": False, "message": "Food id or name is required."}), 400

    food_item = get_food_by_identifier(food_identifier)
    if not food_item:
        return jsonify({"success": False, "message": "Food item not found."}), 404

    if food_item.get("status") != "requested":
        return jsonify({"success": False, "message": "Only requested food can be marked as picked."}), 409

    request_owner = food_item.get("user_id") or food_item.get("requested_by", {}).get("user_id")
    if request_owner != g.current_user["id"]:
        return jsonify({"success": False, "message": "Only the requesting user can mark this item as picked."}), 403

    pickup_timestamp = _current_timestamp()

    try:
        updated_food = update_food_status(
            food_identifier,
            "picked",
            {
                "updated_at": pickup_timestamp,
                "picked_at": pickup_timestamp,
                "picked_by": {
                    "user_id": g.current_user["id"],
                    "name": g.current_user["name"],
                    "email": g.current_user["email"],
                    "role": g.current_user.get("role", "volunteer"),
                },
            },
            required_current_status="requested",
        )
    except Exception:
        return jsonify({"success": False, "message": "Failed to complete pickup."}), 500

    if not updated_food:
        return jsonify({"success": False, "message": "Food item is no longer in requested state."}), 409

    _record_activity(
        "pickup_completed",
        f"{g.current_user['name']} completed pickup for {updated_food['name']}",
        updated_food,
    )
    return jsonify({"success": True, "message": "Pickup completed successfully.", "food": updated_food}), 200
