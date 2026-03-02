from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

import render_live_dashboard


def test_render_markdown_with_rows() -> None:
    payload = {
        "generatedAt": "2026-03-02T00:00:00Z",
        "checks": [
            {
                "url": "https://example.test/",
                "status": "ok",
                "elapsedSeconds": 0.456,
                "checkedAt": "2026-03-02T00:00:01Z",
            }
        ],
    }

    markdown = render_live_dashboard.render_markdown(payload)
    assert "# Live Pages Check Dashboard" in markdown
    assert "Generated at: `2026-03-02T00:00:00Z`" in markdown
    assert "| https://example.test/ | ok | 0.456 | 2026-03-02T00:00:01Z |" in markdown


def test_render_markdown_without_rows_uses_no_data_fallback() -> None:
    markdown = render_live_dashboard.render_markdown({"generatedAt": "-", "checks": []})
    assert "| - | no-data | - | - |" in markdown


def test_main_writes_output_file(monkeypatch, tmp_path: Path) -> None:
    input_path = tmp_path / "live.json"
    output_path = tmp_path / "dashboard.md"

    input_path.write_text(
        '{"generatedAt":"2026-03-02T00:00:00Z","checks":[]}',
        encoding="utf-8",
    )
    monkeypatch.setattr(
        sys,
        "argv",
        ["render_live_dashboard.py", str(input_path), str(output_path)],
    )

    assert render_live_dashboard.main() == 0
    assert output_path.exists()
    content = output_path.read_text(encoding="utf-8")
    assert "# Live Pages Check Dashboard" in content
