from __future__ import annotations

import sys
import time
import urllib.error
import urllib.request
from datetime import datetime, timezone
from pathlib import Path
import json


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


def parse_json_out_path(argv: list[str]) -> Path | None:
    if "--json-out" not in argv:
        return None
    idx = argv.index("--json-out")
    if idx + 1 >= len(argv):
        raise RuntimeError("--json-out requires a path value")
    return Path(argv[idx + 1]).expanduser().resolve()


def strict_mode(argv: list[str]) -> bool:
    return "--strict" in argv


def parse_base_url(argv: list[str], default: str) -> str:
    if "--base-url" not in argv:
        return default
    idx = argv.index("--base-url")
    if idx + 1 >= len(argv):
        raise RuntimeError("--base-url requires a value")
    value = argv[idx + 1].strip()
    if not value:
        raise RuntimeError("--base-url requires a non-empty value")
    return value.rstrip("/")


def parse_int_flag(argv: list[str], flag: str, default: int) -> int:
    if flag not in argv:
        return default
    idx = argv.index(flag)
    if idx + 1 >= len(argv):
        raise RuntimeError(f"{flag} requires a value")
    value = int(argv[idx + 1])
    if value < 1:
        raise RuntimeError(f"{flag} must be >= 1")
    return value


def parse_float_flag(argv: list[str], flag: str, default: float) -> float:
    if flag not in argv:
        return default
    idx = argv.index(flag)
    if idx + 1 >= len(argv):
        raise RuntimeError(f"{flag} requires a value")
    value = float(argv[idx + 1])
    if value < 0:
        raise RuntimeError(f"{flag} must be >= 0")
    return value


def main() -> int:
    json_out = parse_json_out_path(sys.argv)
    strict = strict_mode(sys.argv)
    base_url = parse_base_url(sys.argv, BASE_URL)
    retries = parse_int_flag(sys.argv, "--retries", 12)
    delay_seconds = parse_float_flag(sys.argv, "--delay-seconds", 10.0)
    rows: list[dict[str, object]] = []
    had_failure = False
    ok_count = 0
    error_count = 0
    print(f"Live smoke base URL: {base_url}")
    for path in PAGES:
        url = f"{base_url}{path}"
        started = time.time()
        try:
            fetch_with_retry(url, retries=retries, delay_seconds=delay_seconds)
            elapsed = time.time() - started
            print(f"ok {url}")
            ok_count += 1
            rows.append(
                {
                    "url": url,
                    "status": "ok",
                    "elapsedSeconds": round(elapsed, 3),
                    "checkedAt": datetime.now(timezone.utc).isoformat(),
                }
            )
        except Exception as exc:  # noqa: BLE001
            had_failure = True
            error_count += 1
            elapsed = time.time() - started
            print(f"warn {url} :: {exc}")
            rows.append(
                {
                    "url": url,
                    "status": "error",
                    "error": str(exc),
                    "errorType": type(exc).__name__,
                    "elapsedSeconds": round(elapsed, 3),
                    "checkedAt": datetime.now(timezone.utc).isoformat(),
                }
            )

    if json_out is not None:
        payload = {
            "generatedAt": datetime.now(timezone.utc).isoformat(),
            "count": len(rows),
            "okCount": ok_count,
            "errorCount": error_count,
            "baseUrl": base_url,
            "strict": strict,
            "retries": retries,
            "delaySeconds": delay_seconds,
            "checks": rows,
        }
        json_out.parent.mkdir(parents=True, exist_ok=True)
        json_out.write_text(f"{json.dumps(payload, indent=2)}\n", encoding="utf-8")

    if had_failure:
        print(f"Live smoke completed with warnings: ok={ok_count} error={error_count}")
        return 1 if strict else 0

    print(
        f"Live smoke passed for {len(PAGES)} pages (ok={ok_count} error={error_count})."
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
