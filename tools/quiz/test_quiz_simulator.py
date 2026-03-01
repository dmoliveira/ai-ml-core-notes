from __future__ import annotations

import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

from quiz_simulator import (
    Question,
    QuestionResult,
    compute_stats,
    parse_answer,
    pick_questions,
)


class QuizSimulatorTests(unittest.TestCase):
    def test_parse_answer_supports_letters_and_numbers(self) -> None:
        self.assertEqual(parse_answer("A", 4), 0)
        self.assertEqual(parse_answer("2", 4), 1)
        self.assertEqual(parse_answer("z", 4), -1)

    def test_pick_questions_respects_topics(self) -> None:
        questions = [
            Question("q1", "foundations", "junior", "p", ["a"], 0, "e"),
            Question("q2", "ai-agents", "mid", "p", ["a"], 0, "e"),
        ]
        picked = pick_questions(questions, ["ai-agents"], count=1, seed=7)
        self.assertEqual(len(picked), 1)
        self.assertEqual(picked[0].topic, "ai-agents")

    def test_compute_stats_topic_breakdown(self) -> None:
        question_a = Question("q1", "foundations", "junior", "p", ["a"], 0, "e")
        question_b = Question("q2", "foundations", "junior", "p", ["a"], 0, "e")
        question_c = Question("q3", "ai-agents", "mid", "p", ["a"], 0, "e")
        results = [
            QuestionResult(question_a, 0, True, 2.0),
            QuestionResult(question_b, 0, False, 4.0),
            QuestionResult(question_c, 0, True, 3.0),
        ]
        stats = compute_stats(results, timed_out=False)
        self.assertEqual(stats.total_questions, 3)
        self.assertEqual(stats.correct_answers, 2)
        self.assertAlmostEqual(stats.score_percent, 66.6666, places=2)
        self.assertAlmostEqual(stats.average_time_seconds, 3.0, places=2)
        self.assertEqual(stats.by_topic["foundations"]["total"], 2)
        self.assertEqual(stats.by_topic["foundations"]["correct"], 1)


if __name__ == "__main__":
    unittest.main()
