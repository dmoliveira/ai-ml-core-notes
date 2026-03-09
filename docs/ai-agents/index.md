# AI Agents

Understand how to design, evaluate, and harden agentic systems.

## Before you build agents

Ground agent work in production engineering basics from `ai-engineering/index.md`: evaluation, observability, rollback, and guardrails.

Recommended progression:

1. Start with a non-agent baseline workflow.
2. Add one agent capability (tool use, memory, or planning).
3. Measure whether autonomy improves outcomes.
4. Keep autonomy bounded when reliability or safety degrades.

## Core topics

- Agent loops: perceive, plan, act, reflect
- Tool calling and function interfaces
- Memory (short-term, long-term, retrieval-backed)
- Multi-agent orchestration patterns
- Agent evaluation and failure analysis

## Practical examples

- Python: `pydantic-ai`, `langgraph`, `autogen`
- JavaScript: `langchain-js`, `mastra`
- R/Julia: orchestration adapters and API bridge patterns

## Output you should produce

- Baseline-vs-agent comparison for quality, latency, and operator load.
- One failure taxonomy (tool errors, hallucinations, loop failures).
- One containment strategy (timeouts, policy checks, human-in-the-loop).

## Agent evaluation loop

1. Run one baseline workflow without autonomy.
2. Run one agent-enabled workflow on the same task set.
3. Compare quality, latency, and intervention rate.
4. Keep only autonomy settings that improve outcomes without raising risk.

## External references

- OpenAI cookbook: https://cookbook.openai.com/
- Anthropic prompt engineering: https://docs.anthropic.com/
