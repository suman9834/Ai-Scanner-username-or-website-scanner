import unittest
from unittest.mock import patch

from services.scanner import scan_website


class FakeResponse:
    def __init__(self, status_code=200, headers=None, text="<html></html>"):
        self.status_code = status_code
        self.headers = headers or {}
        self.text = text


class ScannerTests(unittest.TestCase):
    @patch("services.scanner.requests.get")
    def test_scan_website_returns_summary(self, mock_get):
        mock_get.return_value = FakeResponse(
            status_code=200,
            headers={"Content-Security-Policy": "default-src 'self'"},
            text="<html><body>Safe page</body></html>",
        )

        result = scan_website("https://example.com")

        self.assertIn("summary", result)
        self.assertEqual(result["summary"]["status"], "ok")
        self.assertEqual(result["summary"]["issues_count"], 0)


if __name__ == "__main__":
    unittest.main()
