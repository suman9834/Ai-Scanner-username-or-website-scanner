from flask import Blueprint, request, jsonify
from routes.auth import auth_required
from services.scanner import scan_website
from services.risk_engine import calculate_risk
from services.ai_explainer import explain_vulnerabilities
from models.report_model import save_report

scan_bp = Blueprint("scan", __name__)


@scan_bp.route("/", methods=["POST"])
@auth_required
def scan():
    data = request.get_json() or {}
    url = data.get("url", "").strip()

    result = scan_website(url)
    result["risk"] = calculate_risk(result)
    result["explanations"] = explain_vulnerabilities(result)

    try:
        save_report(url, result)
    except Exception:
        pass

    return jsonify(result)