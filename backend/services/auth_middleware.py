from functools import wraps

import jwt
from flask import g, jsonify, request

from services.auth_service import decode_access_token


def require_auth(view_func):
    @wraps(view_func)
    def wrapped_view(*args, **kwargs):
        auth_header = request.headers.get("Authorization", "")
        if not auth_header.startswith("Bearer "):
            return jsonify({"success": False, "message": "Authorization token is required."}), 401

        token = auth_header.split(" ", 1)[1]

        try:
            payload = decode_access_token(token)
        except jwt.ExpiredSignatureError:
            return jsonify({"success": False, "message": "Token has expired."}), 401
        except jwt.InvalidTokenError:
            return jsonify({"success": False, "message": "Invalid token."}), 401

        g.current_user = {
            "id": payload["sub"],
            "email": payload["email"],
            "name": payload["name"],
            "role": payload.get("role", "volunteer"),
        }
        return view_func(*args, **kwargs)

    return wrapped_view
