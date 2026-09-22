def calculate_risk(result):
    score = 0

    for issue in result["issues"]:
        desc = issue["description"].lower()

        if "http" in desc:
            score += 30
        elif "ssl" in desc:
            score += 25
        elif "sql" in desc:
            score += 30
        elif "xss" in desc:
            score += 25
        else:
            score += 10

    score = min(score, 100)

    if score > 70:
        level = "HIGH"
    elif score > 40:
        level = "MEDIUM"
    else:
        level = "LOW"

    return {"score": score, "level": level}