from flask import Blueprint, jsonify
from routes.auth import auth_required
from models.report_model import get_reports

dashboard_bp = Blueprint("dashboard", __name__)


@dashboard_bp.route("/")
@auth_required
def dashboard():
    reports = get_reports()

    total = len(reports)
    high = medium = low = 0
    recent_scans = []

    for r in reports:
        level = r["result"].get("risk", {}).get("level")
        if level == "HIGH":
            high += 1
        elif level == "MEDIUM":
            medium += 1
        else:
            low += 1

    for r in reports[-5:]:
        recent_scans.append({
            "url": r["url"],
            "risk": r["result"].get("risk", {}).get("level", "LOW"),
        })

    return jsonify({
        "total_scans": total,
        "high_risk": high,
        "medium_risk": medium,
        "low_risk": low,
        "recent_scans": recent_scans,
    })