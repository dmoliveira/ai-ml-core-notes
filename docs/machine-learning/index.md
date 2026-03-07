# Machine Learning

Learn the classic algorithms, when to use them, and what can go wrong.

## ML-to-DL transition path

Use this bridge before jumping into deep learning:

1. Build a strong tabular baseline (linear model + tree ensemble).
2. Validate features, leakage checks, and calibration.
3. Write down where classic ML fails (non-linearity, scale, modality).
4. Move to `deep-learning/index.md` only after you can explain those limits.

## Core topics

- Supervised learning: regression and classification
- Unsupervised learning: clustering and dimensionality reduction
- Model selection, cross-validation, and feature engineering
- Bias-variance trade-off and calibration

## Practical examples

- Python: `scikit-learn`, `xgboost`, `lightgbm`
- Julia: `MLJ`, `DecisionTree.jl`, `XGBoost.jl`
- R: `tidymodels`, `randomForest`, `xgboost`

## Ready-to-transition signals

- You can justify model choice with metrics and data constraints.
- You can diagnose overfitting, leakage, and class imbalance issues.
- You can describe one problem where deep representation learning is likely better.

## External references

- Scikit-learn user guide: https://scikit-learn.org/stable/user_guide.html
- Kaggle competitions: https://www.kaggle.com/competitions
