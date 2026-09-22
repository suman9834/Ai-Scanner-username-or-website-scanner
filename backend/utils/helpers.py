from urllib.parse import urlparse

def is_valid_url(url):
    try:
        parsed = urlparse(url)
        return all([parsed.scheme, parsed.netloc])
    except:
        return False


def format_response(success=True, data=None, error=None):
    return {
        "success": success,
        "data": data,
        "error": error
    }