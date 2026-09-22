import json
from models.db import get_db_connection

# 💾 Save report
def save_report(url, result):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        "INSERT INTO reports (url, result) VALUES (?, ?)",
        (url, json.dumps(result))
    )

    conn.commit()
    conn.close()

# 📊 Get all reports
def get_reports():
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM reports")
    rows = cursor.fetchall()

    reports = []
    for row in rows:
        reports.append({
            "id": row["id"],
            "url": row["url"],
            "result": json.loads(row["result"])
        })

    conn.close()
    return reports