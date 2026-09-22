from pathlib import Path

from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
from routes.scan import scan_bp
from routes.dashboard import dashboard_bp
from routes.osint import osint_bp
from routes.auth import auth_bp
from models.db import init_db

FRONTEND_BUILD = Path(__file__).resolve().parent.parent / "frontend" / "build"

app = Flask(
    __name__,
    static_folder=str(FRONTEND_BUILD / "static"),
    static_url_path="/static",
)
CORS(app)

init_db()

app.register_blueprint(dashboard_bp, url_prefix="/api/dashboard")
app.register_blueprint(scan_bp, url_prefix="/api/scan")
app.register_blueprint(osint_bp, url_prefix="/api/osint")
app.register_blueprint(auth_bp, url_prefix="/api/auth")


@app.route("/")
def home():
    index_file = FRONTEND_BUILD / "index.html"
    if index_file.exists():
        return send_from_directory(FRONTEND_BUILD, "index.html")
    return jsonify({"message": "AI vulnerability scanner backend is running", "status": "ok"})


@app.route("/health")
def health():
    return jsonify({"status": "ok"})


@app.route("/<path:path>")
def frontend_routes(path):
    requested_file = FRONTEND_BUILD / path
    if requested_file.is_file():
        return send_from_directory(FRONTEND_BUILD, path)

    index_file = FRONTEND_BUILD / "index.html"
    if index_file.exists():
        return send_from_directory(FRONTEND_BUILD, "index.html")
    return jsonify({"error": "Not found"}), 404


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)