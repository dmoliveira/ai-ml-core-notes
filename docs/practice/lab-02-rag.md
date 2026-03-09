# Lab 02 - Retrieval-Augmented QA

## Objective

Build a small retrieval-augmented question answering workflow and evaluate response quality.

## Steps

1. Curate a document set and chunk strategy.
2. Build embeddings and index documents.
3. Implement retrieval + answer generation chain.
4. Create 30+ evaluation questions and expected signals.
5. Compare at least two retrieval configurations.

## Suggested stack

- Python: `langchain`, `faiss`, `pydantic`
- JavaScript: `langchain-js`, `chromadb`
- Julia/R: API bridge clients to retrieval services

## Deliverables

- Working retrieval pipeline
- Evaluation report with pass/fail analysis
- Error taxonomy and next iteration plan

## RAG evaluation checklist

- Did retrieval return relevant context for failed answers?
- Did chunk size hurt precision or recall?
- Did answer quality degrade when context was noisy?
- Did you log one fix per major failure pattern?

## Failure-to-fix loop

1. Pick one failed question and inspect retrieved chunks.
2. Classify the failure as retrieval, context quality, or answer synthesis.
3. Apply one targeted fix and re-run the same question set.
4. Keep the change only if pass rate improves without new regressions.
