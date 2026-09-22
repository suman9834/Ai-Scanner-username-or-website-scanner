import uuid
import bcrypt
from functools import wraps
from flask import Blueprint, request, jsonify
from models.db import get_db_connection

auth_bp = Blueprint("auth", __name__)


def generate_token():
    return uuid.uuid4().hex


def hash_password(password):
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(password, password_hash):
    return bcrypt.checkpw(password.encode("utf-8"), password_hash.encode("utf-8"))


def auth_required(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        auth_header = request.headers.get("Authorization", "")
        if not auth_header.startswith("Bearer "):
            return jsonify({"error": "Missing authorization token"}), 401

        token = auth_header.split(" ", 1)[1].strip()
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE api_token = ?", (token,))
        user = cursor.fetchone()
        conn.close()

        if not user:
            return jsonify({"error": "Unauthorized"}), 401

        return f(*args, **kwargs)

    return wrapper


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json() or {}
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE email = ?", (email,))
    user = cursor.fetchone()

    if not user or not verify_password(password, user["password_hash"]):
        conn.close()
        return jsonify({"error": "Invalid credentials"}), 401

    token = generate_token()
    cursor.execute(
        "UPDATE users SET api_token = ? WHERE id = ?",
        (token, user["id"])
    )
    conn.commit()
    conn.close()

    return jsonify({
        "message": "Login successful",
        "token": token,
        "email": email
    })


@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json() or {}
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "All fields required"}), 400

    password_hash = hash_password(password)
    token = generate_token()

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute(
            "INSERT INTO users (email, password_hash, api_token) VALUES (?, ?, ?)",
            (email, password_hash, token)
        )
        conn.commit()
    except Exception:
        conn.close()
        return jsonify({"error": "User already exists or invalid data"}), 400

    conn.close()

    return jsonify({
        "message": "User registered successfully",
        "token": token,
        "email": email
    })