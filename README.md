# AI Vulnerability Scanner

An AI-powered web security scanner that checks websites for common security issues and explains the findings in a clear, actionable way.

## Features

- Scan websites for security issues
- Detect missing security headers such as CSP and HSTS
- Generate AI-assisted vulnerability explanations
- View scan history in a dashboard
- Username and password authentication
- OSINT intelligence lookups

## Tech Stack

- Frontend: React.js
- Backend: Flask and Python
- Database: SQLite
- AI: Gemini API (optional)

## Project Structure

```text
backend/     Flask API, services, models, and tests
database/    SQLite schema
frontend/    React application
```

## Run Locally

### Backend

From the project root:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r backend\requirements.txt
python backend\app.py
```

The API runs at `http://127.0.0.1:5000`.

### Frontend

Open a second terminal:

```powershell
cd frontend
npm install
npm start
```

The web app runs at `http://localhost:3000`.

## API Health Check

Open the following URL after starting the backend:

```text
http://127.0.0.1:5000/health
```

Expected response:

```json
{"status":"ok"}
```

## Testing

Run backend tests with:

```powershell
python -m pytest backend\tests
```

## Author

Suman Kumar