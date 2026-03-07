# AI Engineering

Learn to ship AI systems that are reliable, observable, and maintainable.

## Engineering-to-agent progression

Treat agents as an extension of production AI engineering, not a separate universe.

1. Establish baseline reliability (monitoring, rollback, evaluation).
2. Add retrieval and tool interfaces with explicit contracts.
3. Introduce agent loops only after guardrails and observability are in place.
4. Validate behavior under failure scenarios before broad rollout.

## Core topics

- Data and model lifecycle in production
- Retrieval and context management patterns
- Prompting strategy and guardrails
- Evaluation pipelines and offline/online checks
- Monitoring, incidents, and rollback design

## Practical examples

- Python: `fastapi`, `pydantic`, `mlflow`, `langchain`
- Julia: service APIs with `HTTP.jl` and model wrappers
- R: `plumber`, `vetiver` for model deployment

## Ready-for-agents signals

- You can trace request -> context -> model -> output for incidents.
- You have measurable quality/latency/cost baselines.
- You have rollback and policy controls defined for unsafe output paths.

## External references

- MLOps landscape: https://landscape.lfai.foundation/
- OpenTelemetry docs: https://opentelemetry.io/docs/
