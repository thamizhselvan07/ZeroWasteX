import os

from flask import Flask
from dotenv import load_dotenv
from flask_cors import CORS

from routes.auth_routes import auth_blueprint
from routes.food_routes import food_blueprint
from routes.health_routes import health_blueprint
from routes.metrics_routes import metrics_blueprint


def create_app():
    load_dotenv()
    app = Flask(__name__)
    cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173,http://localhost:5174,http://127.0.0.1:5174")
    CORS(
        app,
        resources={r"/*": {
            "origins": [origin.strip() for origin in cors_origins.split(",") if origin.strip()],
            "methods": ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"],
            "expose_headers": ["Content-Type"]
        }},
        supports_credentials=True,
    )

    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "zerowastex-dev-secret")

    app.register_blueprint(health_blueprint, url_prefix="/health")
    app.register_blueprint(auth_blueprint)
    app.register_blueprint(food_blueprint)
    app.register_blueprint(metrics_blueprint)

    @app.route("/")
    def index():
        return {
            "app": "ZeroWasteX",
            "message": "Backend is running",
        }

    return app


app = create_app()


if __name__ == "__main__":
    app.run(debug=True)
