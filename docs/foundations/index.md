# Foundations

Build your baseline in the concepts every AI engineer uses daily.

## Start-to-depth path

Use this sequence to avoid gaps:

1. Learn core ideas here (`foundations`).
2. Review fast with `summaries/index.md`.
3. Go deeper with `deep-dives/index.md` on weak topics.

If a deep-dive section feels too heavy, return to foundations and re-run one practical example first.

## Core topics

- Linear algebra for vectors, matrices, and embeddings
- Probability and statistics for uncertainty and inference
- Calculus and optimization for training behavior
- Metrics and evaluation for model quality

## Practical examples

- Python: `numpy`, `scipy`, `pandas`, `scikit-learn`
- Julia: `LinearAlgebra`, `Statistics`, `Flux`
- R: `matrixStats`, `caret`, `tidymodels`

## Ready-to-progress signals

- You can explain precision vs recall trade-offs without notes.
- You can spot leakage or overfitting issues in a simple baseline.
- You can justify one metric choice for a real use case.

## Baseline quality loop

Use this loop before moving into harder sections:

1. Pick one baseline task from `practice/lab-01-tabular.md`.
2. Identify one likely failure mode (leakage, imbalance, unstable split).
3. Add one control (stratification, validation check, or threshold tuning).
4. Re-run and record whether quality or robustness improved.

## External references

- Kaggle micro-courses: https://www.kaggle.com/learn
- 3Blue1Brown linear algebra: https://www.3blue1brown.com/topics/linear-algebra
