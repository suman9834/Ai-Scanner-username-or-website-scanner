def explain_vulnerabilities(result):
    explanations = []

    for issue in result["issues"]:
        desc = issue["description"]

        explanations.append({
            "type": "Security Issue",
            "explanation": f"{desc} can expose the system to attackers.",
            "impact": "Attackers may exploit this vulnerability.",
            "fix": "Apply proper security configurations and validation."
        })

    if not explanations:
        explanations.append({
            "type": "Safe",
            "explanation": "No major issues found.",
            "impact": "System looks secure.",
            "fix": "Keep monitoring regularly."
        })

    return explanations