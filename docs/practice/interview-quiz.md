# Interview Quiz Simulator

This tool lets learners simulate interview rounds with random questions, topic filters, a timer, and score analytics.

## Features

- Choose specific topics (for example: `ai-agents,machine-learning`)
- Set total number of questions
- Randomized question selection with reproducible seed
- Global quiz timer in seconds
- Final stats: score, time spent, average response time, topic-level accuracy

## Browser version

Prefer a visual experience? Use [Interview Quiz Web UI](quiz-web.md) on GitHub Pages.

The web UI includes per-question timing stats, configurable difficulty mix (junior/mid/senior), scoring modes, review-before-submit flow, result export (JSON/CSV), and browser-saved progress tracking.

## Run it

```bash
python tools/quiz/quiz_simulator.py --topics ai-agents,machine-learning --count 6 --time-limit-seconds 240
```

## Non-interactive simulation mode

```bash
python tools/quiz/quiz_simulator.py --topics foundations --count 4 --simulate A,B,C,D
```

Use simulation mode for demos, CI smoke checks, or scripted walkthroughs.
