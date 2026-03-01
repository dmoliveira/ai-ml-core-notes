from __future__ import annotations

import json
from pathlib import Path


def test_web_question_bank_matches_cli_source() -> None:
    repo_root = Path(__file__).resolve().parents[2]
    cli_path = repo_root / "tools" / "quiz" / "questions.json"
    web_path = repo_root / "docs" / "assets" / "quiz-questions.json"

    cli_payload = json.loads(cli_path.read_text(encoding="utf-8"))
    web_payload = json.loads(web_path.read_text(encoding="utf-8"))

    assert cli_payload == web_payload
