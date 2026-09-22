def analyze_presence(results):
    found_count = sum(1 for r in results if r["found"])

    if found_count >= 6:
        level = "HIGH"
    elif found_count >= 3:
        level = "MEDIUM"
    else:
        level = "LOW"

    return {
        "total_accounts": found_count,
        "presence_level": level,
        "insight": generate_insight(results)
    }


def generate_insight(results):
    platforms = [r["platform"] for r in results if r["found"]]

    if "GitHub" in platforms:
        return "User likely has technical/developer background"
    elif "Instagram" in platforms:
        return "User likely active on social media"
    else:
        return "Limited digital footprint"