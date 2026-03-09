# Interview Question Bank

Use this bank for mock interviews and self-evaluation.

## How to practice with this bank

- Timebox each answer to 3-5 minutes.
- Use the structure: `context -> approach -> metric -> risk -> fallback`.
- After each answer, write one sentence for what you would improve.

## Junior

- Explain the difference between precision and recall. When does each matter more?
- Why do we split data into train/validation/test sets?
- A model has 99 percent accuracy but fails on minority class samples. What is wrong?
- Write pseudocode for training a simple classifier and evaluating F1 score.

## Mid-level

- You shipped a model and quality dropped after two weeks. How do you investigate?
- Compare XGBoost and a small transformer for customer support triage.
- How would you design an evaluation pipeline for a retrieval-augmented assistant?
- What leading and lagging metrics would you track in production?

## Senior

- Design an AI platform for multiple teams with shared guardrails and observability.
- How do you govern prompt, model, and dataset changes in regulated environments?
- Define rollback criteria and incident severity levels for AI-powered features.
- What trade-offs would you make between latency, quality, and cost at scale?

## Coding prompts

- Python: implement evaluation metrics and threshold tuning for classification.
- R: build a reproducible training pipeline with feature preprocessing.
- Julia: benchmark two models and compare runtime and predictive quality.

## Fast debrief template

- What did I answer well?
- What assumption did I forget to state?
- Which metric should I have prioritized?
- What would be my rollback or mitigation plan?

## Feedback escalation loop

1. Pick your lowest-confidence question.
2. Rewrite the answer using `context -> approach -> metric -> risk -> fallback`.
3. Re-run a related prompt in the quiz UI (`practice/quiz-web.md`).
4. Record one sentence about what improved.
