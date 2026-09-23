from flask import Blueprint, request, jsonify
import phonenumbers
from phonenumbers import geocoder, carrier, number_type, PhoneNumberType

from services.osint_service import check_username
from services.osint_intelligence import analyze_presence


osint_bp = Blueprint("osint", __name__)


@osint_bp.route("/username", methods=["POST"])
def username_osint():

    username = request.json.get("username")

    if not username:
        return jsonify({
            "error": "Username is required"
        }), 400

    results = check_username(username)
    intelligence = analyze_presence(results)

    return jsonify({
        "accounts": results,
        "intelligence": intelligence
    })


@osint_bp.route("/phone", methods=["POST"])
def phone_osint():

    data = request.get_json(silent=True) or {}
    phone = str(data.get("phone", "")).strip()

    if not phone:
        return jsonify({
            "error": "Phone number is required"
        }), 400

    try:
        # Parse international number
        parsed = phonenumbers.parse(phone, None)

        # Validate
        is_valid = phonenumbers.is_valid_number(parsed)

        if not is_valid:
            return jsonify({
                "error": "Invalid phone number"
            }), 400

        # Country / region
        region_code = phonenumbers.region_code_for_number(parsed)
        country = geocoder.country_name_for_number(
            parsed,
            "en"
        )

        # Number type
        phone_type = number_type(parsed)

        type_map = {
            PhoneNumberType.MOBILE: "Mobile",
            PhoneNumberType.FIXED_LINE: "Fixed line",
            PhoneNumberType.FIXED_LINE_OR_MOBILE: "Fixed line / Mobile",
            PhoneNumberType.TOLL_FREE: "Toll free",
            PhoneNumberType.PREMIUM_RATE: "Premium rate",
            PhoneNumberType.VOIP: "VoIP",
            PhoneNumberType.PERSONAL_NUMBER: "Personal number",
            PhoneNumberType.PAGER: "Pager",
            PhoneNumberType.UAN: "UAN",
            PhoneNumberType.VOICEMAIL: "Voicemail",
        }

        phone_type_name = type_map.get(
            phone_type,
            "Unknown"
        )

        # Original carrier-range information
        carrier_name = carrier.name_for_number(
            parsed,
            "en"
        )

        # Formats
        international = phonenumbers.format_number(
            parsed,
            phonenumbers.PhoneNumberFormat.INTERNATIONAL
        )

        national = phonenumbers.format_number(
            parsed,
            phonenumbers.PhoneNumberFormat.NATIONAL
        )

        return jsonify({
            "number": international,

            "identity": {
                "name": None,
                "source": None,
                "confidence": None,
                "note": (
                    "Subscriber name is only shown when obtained "
                    "from a public or authorized source."
                )
            },

            "number_analysis": {
                "valid": True,
                "country": country or region_code or "Unknown",
                "country_code": f"+{parsed.country_code}",
                "region": region_code or "Unknown",
                "type": phone_type_name,
                "carrier": carrier_name or "Not available",
                "international": international,
                "national": national
            },

            "public_sources": {
                "public_web": {
                    "status": "Not checked",
                    "matches": []
                },
                "authorized_source": {
                    "status": "Not connected",
                    "matches": []
                }
            },

            "breach_exposure": {
                "status": "Not checked",
                "email_linked": False,
                "reason": (
                    "No authorized email association is available."
                )
            },

            "source": {
                "name": "Google libphonenumber",
                "confidence": "High",
                "checked": "current request"
            }
        })

    except phonenumbers.NumberParseException:
        return jsonify({
            "error": (
                "Could not parse phone number. "
                "Use international format such as +919876543210."
            )
        }), 400

    except Exception as error:
        return jsonify({
            "error": "Phone intelligence lookup failed.",
            "details": str(error)
        }), 500