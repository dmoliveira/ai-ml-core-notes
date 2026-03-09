# Lab 01 - Tabular Baseline and Feature Engineering

## Objective

Train a reliable baseline classifier on tabular data, then improve it with targeted feature work.

## Steps

1. Load data and inspect class balance.
2. Build a baseline model with train/validation split.
3. Measure F1, precision, recall, and ROC-AUC.
4. Add feature transformations and compare results.
5. Write a short post-lab retrospective.

## Suggested stack

- Python: `pandas`, `scikit-learn`, `xgboost`
- Julia: `DataFrames.jl`, `MLJ.jl`, `XGBoost.jl`
- R: `tidymodels`, `recipes`, `xgboost`

## Deliverables

- Reproducible script or notebook
- Metrics table baseline vs improved
- One-page lessons learned

## Baseline robustness checklist

- Did you check class imbalance before picking metrics?
- Did you guard against leakage in features or split strategy?
- Did you compare at least one calibration or threshold variant?
- Did you document one failure mode and one mitigation?
