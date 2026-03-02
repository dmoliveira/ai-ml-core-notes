from __future__ import annotations

import sys
import time
import urllib.error
import urllib.request


BASE_URL = "https://dmoliveira.github.io/ai-ml-core-notes"
PAGES = [
    "/",
    "/practice/",
    "/practice/quiz-web/",
    "/practice/leaderboard-viewer/",
    "/interview-prep/",
]


def fetch_with_retry(url: str, retries: int = 12, delay_seconds: float = 10.0) -> str:
    last_error: Exception | None = None
    for attempt in range(1, retries + 1):
        try:
            with urllib.request.urlopen(url, timeout=20) as response:  # noqa: S310
                status = getattr(response, "status", 200)
                if status >= 400:
                    raise RuntimeError(f"{url} returned status {status}")
                body = response.read().decode("utf-8", errors="ignore")
                if "<title" not in body.lower():
                    raise RuntimeError(f"{url} missing title tag")
                return body
        except (urllib.error.URLError, TimeoutError, RuntimeError) as exc:
            last_error = exc
            if attempt < retries:
                time.sleep(delay_seconds)
    raise RuntimeError(f"Failed after {retries} attempts: {url} :: {last_error}")


def main() -> int:
    for path in PAGES:
        url = f"{BASE_URL}{path}"
        fetch_with_retry(url)
        print(f"ok {url}")
    print(f"Live smoke passed for {len(PAGES)} pages.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
