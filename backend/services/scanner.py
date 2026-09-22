import requests
from urllib.parse import urlparse


def scan_website(url):
    issues = []

    if not url:
        return {
            "url": "",
            "status_code": "Error",
            "issues": [{"description": "No URL provided"}],
            "summary": {"status": "error", "issues_count": 1, "message": "Please provide a target URL"},
        }

    normalized_url = url.strip()
    if not normalized_url.startswith(("http://", "https://")):
        normalized_url = f"https://{normalized_url}"

    parsed = urlparse(normalized_url)

    try:
        response = requests.get(normalized_url, timeout=8, verify=False)
        status = response.status_code
        headers = response.headers or {}
        body = response.text.lower()

        if status >= 400:
            issues.append({"description": f"HTTP Error {status}"})

        if parsed.scheme != "https":
            issues.append({"description": "Site uses insecure HTTP instead of HTTPS"})

        if "content-security-policy" not in {key.lower(): value for key, value in headers.items()}:
            issues.append({"description": "Missing CSP header"})

        if "strict-transport-security" not in {key.lower(): value for key, value in headers.items()} and parsed.scheme == "https":
            issues.append({"description": "Missing HSTS header"})

        if "x-frame-options" not in {key.lower(): value for key, value in headers.items()}:
            issues.append({"description": "Missing X-Frame-Options header"})

        if "<script>" in body:
            issues.append({"description": "Possible XSS vulnerability"})

        try:
            probe_response = requests.get(f"{normalized_url}?id=1'", timeout=4, verify=False)
            if "sql" in probe_response.text.lower():
                issues.append({"description": "Possible SQL Injection"})
        except Exception:
            pass

        return {
            "url": normalized_url,
            "status_code": status,
            "issues": issues,
            "summary": {
                "status": "ok" if not issues else "warning",
                "issues_count": len(issues),
            },
        }

    except Exception as e:
        return {
            "url": normalized_url,
            "status_code": "Error",
            "issues": [{"description": str(e)}],
            "summary": {"status": "error", "issues_count": 1, "message": str(e)},
        }