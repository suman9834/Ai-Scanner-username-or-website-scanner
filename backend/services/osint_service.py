import requests

SITES = {
    "GitHub": "https://github.com/{}",
    "Instagram": "https://www.instagram.com/{}",
    "Twitter": "https://twitter.com/{}",
    "Reddit": "https://www.reddit.com/user/{}",
    "Facebook": "https://www.facebook.com/{}",
    "LinkedIn": "https://www.linkedin.com/in/{}",
    "TikTok": "https://www.tiktok.com/@{}",
    "YouTube": "https://www.youtube.com/@{}",
    "Medium": "https://medium.com/@{}",
    "Pinterest": "https://www.pinterest.com/{}"
}

def check_username(username):
    results = []

    for name, url in SITES.items():
        full_url = url.format(username)
        try:
            res = requests.get(full_url, timeout=5)
            found = res.status_code == 200

            results.append({
                "platform": name,
                "url": full_url,
                "found": found
            })
        except:
            results.append({
                "platform": name,
                "url": full_url,
                "found": False
            })

    return results