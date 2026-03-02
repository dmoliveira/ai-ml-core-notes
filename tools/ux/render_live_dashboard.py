from __future__ import annotations

import json
import sys
from pathlib import Path


def render_markdown(payload: dict) -> str:
    rows = payload.get("checks", [])
    base_url = payload.get("baseUrl", "-")
    ok_count = payload.get("okCount", "-")
    error_count = payload.get("errorCount", "-")
    retries = payload.get("retries", "-")
    delay_seconds = payload.get("delaySeconds", "-")
    strict = payload.get("strict", "-")
    lines = [
        "# Live Pages Check Dashboard",
        "",
        f"Generated at: `{payload.get('generatedAt', '-')}`",
        f"Base URL: `{base_url}`",
        f"Summary: ok={ok_count}, error={error_count}, strict={strict}, retries={retries}, delaySeconds={delay_seconds}",
        "",
        "| URL | Status | Elapsed (s) | Checked At |",
        "| --- | --- | ---: | --- |",
    ]

    for row in rows:
        lines.append(
            f"| {row.get('url', '-')} | {row.get('status', '-')} | {row.get('elapsedSeconds', '-')} | {row.get('checkedAt', '-')} |"
        )

    if not rows:
        lines.append("| - | no-data | - | - |")

    return "\n".join(lines) + "\n"


def main() -> int:
    if len(sys.argv) != 3:
        raise SystemExit(
            "Usage: python tools/ux/render_live_dashboard.py <input-json> <output-md>"
        )

    input_path = Path(sys.argv[1]).expanduser().resolve()
    output_path = Path(sys.argv[2]).expanduser().resolve()

    payload = json.loads(input_path.read_text(encoding="utf-8"))
    markdown = render_markdown(payload)

    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(markdown, encoding="utf-8")
    print(f"Wrote dashboard: {output_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
