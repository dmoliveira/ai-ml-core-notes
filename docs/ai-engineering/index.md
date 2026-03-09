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

## Agent operations playbook

Use this mini playbook before production rollout:

1. Define failure classes (tool timeout, wrong tool choice, unsafe response).
2. Map each failure class to an alert and owner.
3. Add one containment control per failure class.
4. Run one game-day scenario and document corrective actions.

## Live verification loop

Pair operational controls with hosted checks:

1. Run `tools/ux/live_pages_check.py` against the deployment URL.
2. Review `practice/live-check-dashboard.md` for failures and freshness.
3. Link one failing route to an owner and mitigation action.
4. Re-run checks after the fix and capture evidence in release notes.

## External references

- MLOps landscape: https://landscape.lfai.foundation/
- OpenTelemetry docs: https://opentelemetry.io/docs/

## Deployment readiness loop

1. Validate one critical path with real request payloads.
2. Confirm monitoring, alert routing, and rollback trigger coverage.
3. Rehearse one incident response path end-to-end.
4. Release only after evidence is captured for all three checks.
