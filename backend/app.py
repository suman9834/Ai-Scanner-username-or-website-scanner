from flask import Flask, jsonify
from flask_cors import CORS
from routes.scan import scan_bp
from routes.dashboard import dashboard_bp
from routes.osint import osint_bp
from routes.auth import auth_bp
from models.db import init_db

app = Flask(__name__)
CORS(app)

init_db()

app.register_blueprint(dashboard_bp, url_prefix="/api/dashboard")
app.register_blueprint(scan_bp, url_prefix="/api/scan")
app.register_blueprint(osint_bp, url_prefix="/api/osint")
app.register_blueprint(auth_bp, url_prefix="/api/auth")


@app.route("/")
def home():
    return jsonify({"message": "AI vulnerability scanner backend is running", "status": "ok"})


@app.route("/health")
def health():
    return jsonify({"status": "ok"})


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)