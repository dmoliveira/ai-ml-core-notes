# Interview Quiz Simulator

This tool lets learners simulate interview rounds with random questions, topic filters, a timer, and score analytics.

## Features

- Choose specific topics (for example: `ai-agents,machine-learning`)
- Set total number of questions
- Randomized question selection with reproducible seed
- Global quiz timer in seconds
- Final stats: score, time spent, average response time, topic-level accuracy

## Recommended usage loop

1. Start with one focused topic and 4-6 questions.
2. Review timing and topic-level accuracy after each run.
3. Repeat with a mixed-topic set only after focused scores improve.
4. Track one improvement note per session.

## Browser version

Prefer a visual experience? Use [Interview Quiz Web UI](quiz-web.md) on GitHub Pages.

The web UI includes per-question timing stats, configurable difficulty mix (junior/mid/senior), adaptive difficulty routing, optional per-topic section timer, scoring modes, review-before-submit flow, result export (JSON/CSV) with integrity metadata, shareable signed result links with topic breakdown, optional leaderboard submission endpoint, signature verification helper page, read-only leaderboard viewer support, and browser-saved progress tracking.

## Run it

```bash
python tools/quiz/quiz_simulator.py --topics ai-agents,machine-learning --count 6 --time-limit-seconds 240
```

## Difficulty ladder examples

```bash
# baseline (single topic)
python tools/quiz/quiz_simulator.py --topics machine-learning --count 4 --time-limit-seconds 180

# mixed interview round
python tools/quiz/quiz_simulator.py --topics foundations,machine-learning,ai-engineering --count 8 --time-limit-seconds 360
```

## Non-interactive simulation mode

```bash
python tools/quiz/quiz_simulator.py --topics foundations --count 4 --simulate A,B,C,D
```

Use simulation mode for demos, CI smoke checks, or scripted walkthroughs.

## After-action checklist

- Which topic had the weakest accuracy?
- Did time pressure reduce answer quality?
- What concept should be reviewed before the next run?

## Topic escalation loop

1. Run one focused-topic quiz and capture weak areas.
2. Re-run the same topic after one targeted review pass.
3. Escalate to mixed topics only when focused accuracy improves.
4. Keep one carry-forward note to guide the next timed session.
