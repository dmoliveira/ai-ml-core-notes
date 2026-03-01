from __future__ import annotations

import argparse
import json
import random
import time
from dataclasses import dataclass
from pathlib import Path


@dataclass(frozen=True)
class Question:
    qid: str
    topic: str
    difficulty: str
    prompt: str
    options: list[str]
    answer_index: int
    explanation: str


@dataclass(frozen=True)
class QuestionResult:
    question: Question
    selected_index: int
    correct: bool
    elapsed_seconds: float


@dataclass(frozen=True)
class QuizStats:
    total_questions: int
    correct_answers: int
    score_percent: float
    total_time_seconds: float
    average_time_seconds: float
    timed_out: bool
    by_topic: dict[str, dict[str, int]]


def load_questions(path: Path) -> list[Question]:
    payload = json.loads(path.read_text(encoding="utf-8"))
    questions: list[Question] = []
    for item in payload:
        questions.append(
            Question(
                qid=item["id"],
                topic=item["topic"],
                difficulty=item["difficulty"],
                prompt=item["prompt"],
                options=item["options"],
                answer_index=int(item["answer_index"]),
                explanation=item["explanation"],
            )
        )
    return questions


def pick_questions(
    questions: list[Question],
    topics: list[str],
    count: int,
    seed: int,
) -> list[Question]:
    topic_set = {topic.strip() for topic in topics if topic.strip()}
    filtered = [q for q in questions if not topic_set or q.topic in topic_set]
    if not filtered:
        raise ValueError("No questions available for the selected topics.")
    if count <= 0:
        raise ValueError("Question count must be greater than zero.")

    rng = random.Random(seed)
    if count >= len(filtered):
        chosen = filtered[:]
        rng.shuffle(chosen)
        return chosen
    return rng.sample(filtered, count)


def compute_stats(results: list[QuestionResult], timed_out: bool) -> QuizStats:
    total = len(results)
    correct = sum(1 for result in results if result.correct)
    total_time = sum(result.elapsed_seconds for result in results)
    avg_time = total_time / total if total else 0.0
    score = (correct / total) * 100 if total else 0.0

    by_topic: dict[str, dict[str, int]] = {}
    for result in results:
        entry = by_topic.setdefault(result.question.topic, {"correct": 0, "total": 0})
        entry["total"] += 1
        if result.correct:
            entry["correct"] += 1

    return QuizStats(
        total_questions=total,
        correct_answers=correct,
        score_percent=score,
        total_time_seconds=total_time,
        average_time_seconds=avg_time,
        timed_out=timed_out,
        by_topic=by_topic,
    )


def parse_answer(raw_value: str, options_count: int) -> int:
    normalized = raw_value.strip().upper()
    if not normalized:
        return -1
    if normalized.isdigit():
        idx = int(normalized) - 1
        return idx if 0 <= idx < options_count else -1
    idx = ord(normalized[0]) - ord("A")
    return idx if 0 <= idx < options_count else -1


def run_quiz(
    selected_questions: list[Question],
    time_limit_seconds: int,
    simulated_answers: list[str],
) -> tuple[list[QuestionResult], QuizStats]:
    start = time.perf_counter()
    results: list[QuestionResult] = []
    timed_out = False

    for idx, question in enumerate(selected_questions, start=1):
        elapsed_total = time.perf_counter() - start
        if time_limit_seconds > 0 and elapsed_total >= time_limit_seconds:
            timed_out = True
            break

        print(f"\nQuestion {idx}/{len(selected_questions)}")
        print(f"Topic: {question.topic} | Difficulty: {question.difficulty}")
        print(question.prompt)
        for option_idx, option in enumerate(question.options):
            print(f"  {chr(ord('A') + option_idx)}. {option}")

        question_start = time.perf_counter()
        if simulated_answers:
            raw_answer = simulated_answers.pop(0)
            print(f"Simulated answer: {raw_answer}")
        else:
            raw_answer = input("Your answer (A/B/C/D or 1-4): ")

        selected_index = parse_answer(raw_answer, len(question.options))
        elapsed_question = time.perf_counter() - question_start
        is_correct = selected_index == question.answer_index
        results.append(
            QuestionResult(
                question=question,
                selected_index=selected_index,
                correct=is_correct,
                elapsed_seconds=elapsed_question,
            )
        )

        if is_correct:
            print("Correct.")
        else:
            correct_letter = chr(ord("A") + question.answer_index)
            print(
                f"Incorrect. Correct answer: {correct_letter}. {question.explanation}"
            )

    stats = compute_stats(results, timed_out)
    return results, stats


def print_stats(stats: QuizStats) -> None:
    print("\n=== Quiz Results ===")
    print(
        f"Score: {stats.correct_answers}/{stats.total_questions} ({stats.score_percent:.1f}%)"
    )
    print(f"Total time: {stats.total_time_seconds:.1f}s")
    print(f"Average/question: {stats.average_time_seconds:.1f}s")
    print(f"Timed out: {'yes' if stats.timed_out else 'no'}")
    print("By topic:")
    for topic, values in sorted(stats.by_topic.items()):
        correct = values["correct"]
        total = values["total"]
        pct = (correct / total) * 100 if total else 0
        print(f"  - {topic}: {correct}/{total} ({pct:.1f}%)")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Run an interview quiz with timer and score stats."
    )
    parser.add_argument(
        "--questions-file",
        default=str(Path(__file__).with_name("questions.json")),
        help="Path to quiz questions JSON file.",
    )
    parser.add_argument(
        "--topics",
        default="",
        help="Comma-separated topics (example: foundations,machine-learning).",
    )
    parser.add_argument(
        "--count", type=int, default=8, help="Total number of questions."
    )
    parser.add_argument(
        "--seed", type=int, default=42, help="Random seed for reproducible picks."
    )
    parser.add_argument(
        "--time-limit-seconds",
        type=int,
        default=300,
        help="Total quiz time limit in seconds. Use 0 for no limit.",
    )
    parser.add_argument(
        "--simulate",
        default="",
        help="Comma-separated simulated answers for non-interactive runs.",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    questions_path = Path(args.questions_file)
    questions = load_questions(questions_path)
    topics = [part.strip() for part in args.topics.split(",") if part.strip()]
    selected = pick_questions(
        questions=questions, topics=topics, count=args.count, seed=args.seed
    )
    simulated = [part.strip() for part in args.simulate.split(",") if part.strip()]
    _, stats = run_quiz(
        selected_questions=selected,
        time_limit_seconds=args.time_limit_seconds,
        simulated_answers=simulated,
    )
    print_stats(stats)


if __name__ == "__main__":
    main()
