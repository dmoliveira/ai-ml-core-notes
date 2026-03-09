# Lab 03 - Agent Workflow with Tool Use

## Objective

Design a simple AI agent loop with tool calls, memory constraints, and measurable reliability.

## Steps

1. Define task boundaries and allowed tools.
2. Implement perceive-plan-act loop.
3. Add structured logging for each step.
4. Evaluate failure cases and guardrail behavior.
5. Improve prompts and tool routing strategy.

## Suggested stack

- Python: `pydantic-ai` or `langgraph`
- JavaScript: `mastra` or `langchain-js`
- Any language: typed function-calling adapters

## Deliverables

- Agent implementation with reproducible run path
- Failure case matrix and mitigations
- Short demo script with expected outputs

## Ops-focused extension

After baseline completion, add an operations pass:

1. Define 3 alerts tied to concrete agent failures.
2. Add a rollback trigger for unsafe or degraded behavior.
3. Simulate one failure and capture incident notes.
4. Update your failure matrix with prevention controls.
