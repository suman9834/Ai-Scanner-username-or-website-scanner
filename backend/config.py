import os

class Config:
    DEBUG = True
    SECRET_KEY = os.getenv("SECRET_KEY", "supersecretkey")

    # Future use (AI integration)
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

    # Database
    DB_NAME = "scanner.db"