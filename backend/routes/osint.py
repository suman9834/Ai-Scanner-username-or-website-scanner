from flask import Blueprint, request, jsonify
from services.osint_service import check_username
from services.osint_intelligence import analyze_presence


osint_bp = Blueprint("osint", __name__)
@osint_bp.route("/username", methods=["POST"])
def username_osint():
    username = request.json.get("username")

    results = check_username(username)
    intelligence = analyze_presence(results)

    return jsonify({
        "accounts": results,
        "intelligence": intelligence
    })