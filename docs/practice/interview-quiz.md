# Interview Quiz Simulator

This tool lets learners simulate interview rounds with random questions, topic filters, a timer, and score analytics.

## Features

- Choose specific topics (for example: `ai-agents,machine-learning`)
- Set total number of questions
- Randomized question selection with reproducible seed
- Global quiz timer in seconds
- Final stats: score, time spent, average response time, topic-level accuracy

## Run it

```bash
python tools/quiz/quiz_simulator.py --topics ai-agents,machine-learning --count 6 --time-limit-seconds 240
```

## Non-interactive simulation mode

```bash
python tools/quiz/quiz_simulator.py --topics foundations --count 4 --simulate A,B,C,D
```

Use simulation mode for demos, CI smoke checks, or scripted walkthroughs.
