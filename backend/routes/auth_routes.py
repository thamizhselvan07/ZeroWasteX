from datetime import datetime, timezone

from flask import Blueprint, g, jsonify, request

from services.auth_middleware import require_auth
from services.auth_service import create_access_token, hash_password, verify_password
from services.user_service import create_user, get_user_by_email

auth_blueprint = Blueprint("auth", __name__)


@auth_blueprint.route("/signup", methods=["POST"])
def signup():
    payload = request.get_json(silent=True) or {}
    name = (payload.get("name") or "").strip()
    email = (payload.get("email") or "").strip().lower()
    password = payload.get("password") or ""
    role = (payload.get("role") or "volunteer").strip().lower()

    if not name or not email or not password:
        return jsonify({"success": False, "message": "Name, email, and password are required."}), 400

    if role not in {"donor", "volunteer"}:
        return jsonify({"success": False, "message": "Role must be donor or volunteer."}), 400

    try:
        existing_user = get_user_by_email(email)
        if existing_user:
            return jsonify({"success": False, "message": "An account with this email already exists."}), 409

        user = create_user(
            {
                "name": name,
                "email": email,
                "role": role,
                "password_hash": hash_password(password),
                "created_at": datetime.now(timezone.utc).isoformat(),
            }
        )
        token = create_access_token(user)

        return jsonify({"success": True, "message": "Account created successfully.", "token": token, "user": user}), 201
    except Exception as error:
        return jsonify({"success": False, "message": f"An error occurred: {str(error)}"}), 500


@auth_blueprint.route("/login", methods=["POST"])
def login():
    payload = request.get_json(silent=True) or {}
    email = (payload.get("email") or "").strip().lower()
    password = payload.get("password") or ""

    if not email or not password:
        return jsonify({"success": False, "message": "Email and password are required."}), 400

    try:
        user_record = get_user_by_email(email)
        if not user_record or not verify_password(user_record["password_hash"], password):
            return jsonify({"success": False, "message": "Invalid email or password."}), 401

        user = {
            "id": str(user_record["_id"]),
            "name": user_record["name"],
            "email": user_record["email"],
            "role": user_record.get("role", "volunteer"),
        }
        token = create_access_token(user)

        return jsonify({"success": True, "message": "Login successful.", "token": token, "user": user}), 200
    except Exception as error:
        return jsonify({"success": False, "message": f"An error occurred: {str(error)}"}), 500


@auth_blueprint.route("/me", methods=["GET"])
@require_auth
def get_current_user():
    return jsonify({"success": True, "user": g.current_user}), 200
