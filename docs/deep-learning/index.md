# Deep Learning

Move from classic ML to representation learning and modern neural architectures.

## Before you start

You should already be comfortable with model evaluation, cross-validation, and baseline comparisons from `machine-learning/index.md`.

Deep learning is most useful when feature learning matters (images, text, audio, large-scale pattern complexity) and classic feature engineering becomes limiting.

Recommended progression:

1. Reproduce one simple baseline in classic ML.
2. Train a small neural model on the same task.
3. Compare quality, latency, and cost.
4. Keep the DL approach only if the trade-off is clearly better.

## Core topics

- Neural network fundamentals and backpropagation
- CNNs, RNNs, and transformers
- Regularization, optimization tricks, and training stability
- Inference performance and model compression basics

## Practical examples

- Python: `pytorch`, `tensorflow`, `jax`
- Julia: `Flux`, `Knet`
- R: `keras`, `torch`

## Output you should produce

- Baseline-vs-DL comparison table (quality, latency, cost).
- One-paragraph architecture rationale.
- One reliability risk and mitigation plan.

## Rollback-and-replay loop

Use this loop when model quality improves but operational risk rises:

1. Capture one failing scenario with inputs, outputs, and latency.
2. Replay the same scenario on baseline and new model versions.
3. Compare quality gain against reliability and cost regressions.
4. Roll back by default unless the new model wins on the chosen objective.

## External references

- PyTorch tutorials: https://pytorch.org/tutorials/
- Papers With Code: https://paperswithcode.com/
