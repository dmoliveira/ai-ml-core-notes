from __future__ import annotations

import json
import sys
from pathlib import Path

import pytest

sys.path.insert(0, str(Path(__file__).parent))

import live_pages_check


def test_parse_json_out_path_none() -> None:
    assert live_pages_check.parse_json_out_path(["script.py"]) is None


def test_parse_json_out_path_value(tmp_path: Path) -> None:
    out_path = tmp_path / "live.json"
    parsed = live_pages_check.parse_json_out_path(
        ["script.py", "--json-out", str(out_path)]
    )
    assert parsed == out_path.resolve()


def test_parse_json_out_path_requires_value() -> None:
    with pytest.raises(RuntimeError, match="--json-out requires a path value"):
        live_pages_check.parse_json_out_path(["script.py", "--json-out"])


def test_parse_int_flag_rejects_zero() -> None:
    with pytest.raises(RuntimeError, match="--retries must be >= 1"):
        live_pages_check.parse_int_flag(
            ["script.py", "--retries", "0"], "--retries", 12
        )


def test_parse_float_flag_rejects_negative() -> None:
    with pytest.raises(RuntimeError, match="--delay-seconds must be >= 0"):
        live_pages_check.parse_float_flag(
            ["script.py", "--delay-seconds", "-1"],
            "--delay-seconds",
            10.0,
        )


def test_main_writes_json_payload(
    monkeypatch: pytest.MonkeyPatch, tmp_path: Path
) -> None:
    output_path = tmp_path / "live-pages.json"

    monkeypatch.setattr(live_pages_check, "PAGES", ["/", "/practice/"])
    monkeypatch.setattr(
        live_pages_check,
        "fetch_with_retry",
        lambda *_args, **_kwargs: "<html><title>ok</title></html>",
    )
    monkeypatch.setattr(
        sys,
        "argv",
        [
            "live_pages_check.py",
            "--json-out",
            str(output_path),
            "--retries",
            "1",
            "--delay-seconds",
            "0",
        ],
    )

    assert live_pages_check.main() == 0

    payload = json.loads(output_path.read_text(encoding="utf-8"))
    assert payload["count"] == 2
    assert payload["okCount"] == 2
    assert payload["errorCount"] == 0
    assert payload["strict"] is False
    assert payload["retries"] == 1
    assert payload["delaySeconds"] == 0.0
    assert len(payload["checks"]) == 2
    assert all(row["status"] == "ok" for row in payload["checks"])


def test_main_non_strict_failure_returns_zero(
    monkeypatch: pytest.MonkeyPatch, tmp_path: Path
) -> None:
    output_path = tmp_path / "live-pages.json"

    monkeypatch.setattr(live_pages_check, "PAGES", ["/"])

    def fail_fetch(*_args, **_kwargs) -> str:
        raise RuntimeError("boom")

    monkeypatch.setattr(live_pages_check, "fetch_with_retry", fail_fetch)
    monkeypatch.setattr(
        sys,
        "argv",
        ["live_pages_check.py", "--json-out", str(output_path), "--retries", "1"],
    )

    assert live_pages_check.main() == 0
    payload = json.loads(output_path.read_text(encoding="utf-8"))
    assert payload["okCount"] == 0
    assert payload["errorCount"] == 1
    assert payload["checks"][0]["status"] == "error"
    assert payload["checks"][0]["errorType"] == "RuntimeError"


def test_main_strict_failure_returns_one(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(live_pages_check, "PAGES", ["/"])

    def fail_fetch(*_args, **_kwargs) -> str:
        raise RuntimeError("boom")

    monkeypatch.setattr(live_pages_check, "fetch_with_retry", fail_fetch)
    monkeypatch.setattr(
        sys, "argv", ["live_pages_check.py", "--strict", "--retries", "1"]
    )

    assert live_pages_check.main() == 1
