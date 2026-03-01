from __future__ import annotations

from dataclasses import dataclass


@dataclass
class Metrics:
    f1: float
    precision: float
    recall: float
    roc_auc: float


def demo_metrics() -> Metrics:
    """Return placeholder baseline metrics for study workflow demos."""
    return Metrics(f1=0.81, precision=0.83, recall=0.79, roc_auc=0.88)


if __name__ == "__main__":
    print(demo_metrics())
