from flask import Flask, jsonify
from flask_cors import CORS

from config import Config
from models import db
from routes.books import books_bp


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app)
    db.init_app(app)

    app.register_blueprint(books_bp)

    @app.route("/api/health")
    def health_check():
        return jsonify({"status": "healthy", "message": "Library API is running"})

    with app.app_context():
        db.create_all()

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True, port=5000)
