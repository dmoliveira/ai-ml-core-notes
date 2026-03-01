# Project Plan - AI/ML Core Notes

## Executive summary

This project is a public, MIT-licensed, docs-first repository designed to teach AI and AI engineering quickly and deeply.
It serves two core needs: practical learning for building real AI systems and interview preparation for all levels.

## Context

- Learners need a structured path instead of scattered tutorials.
- Teams need practical AI engineering guidance, not only model theory.
- Interview candidates need concise summaries plus deep reference material.

## Goals

- Build the fastest practical AI learning path from fundamentals to agent systems.
- Publish high-quality, searchable documentation on GitHub Pages.
- Maintain a Wiki-friendly content model for quick references.
- Provide language-aware examples (Python, Julia, R) and ecosystem links.
- Offer interview-oriented checklists, scenarios, and FAQs.

## Non-goals (initial phase)

- Building a full interactive learning platform.
- Hosting private datasets or proprietary course material.
- Covering every paper in depth before a practical baseline exists.

## Delivery model

- Iterative releases with small scoped commits.
- Content-first architecture in Markdown.
- Automation-first publishing via GitHub Actions.
- Clear definition of done and validation checks.

## Activity tracking

| Item | Owner | Status |
| --- | --- | --- |
| Repo bootstrap and license | Core maintainers | done |
| Docs architecture and navigation | Core maintainers | doing |
| Foundations module | Core maintainers | doing |
| ML/DL modules | Core maintainers | doing |
| AI engineering and agents modules | Core maintainers | doing |
| Interview prep and FAQ | Core maintainers | doing |
| Pages and Wiki automation | Core maintainers | doing |

Status values: `doing`, `done`.

## Assumptions

- Repo is public and aimed at global learners.
- Content must be accessible to beginners but useful for practitioners.
- Most users prefer short summaries first, details second.
- GitHub Pages and Wiki are primary publishing surfaces.

## Technology choices

- Docs: Markdown + MkDocs Material
- CI/CD: GitHub Actions
- Example languages: Python, Julia, R (plus JS when relevant)
- Optional notebooks and datasets links for practical work

## Definition of done

Each topic is complete when all criteria pass:

1. Core concept explanation in plain language
2. At least one practical example
3. Common mistakes and debugging hints
4. Interview-oriented questions
5. References to packages/tools across Python/Julia/R when relevant
6. Linked from indexes and searchable in docs site

## Validation checklist

- Docs build succeeds
- Internal links resolve
- Navigation entries are updated
- Content follows summary -> deep dive pattern
- Licensing and attribution remain compliant

## Epics, tasks, and subtasks

### Epic 1 - Platform and documentation architecture

- Task 1.1: Bootstrap repository structure
  - Subtask 1.1.1: Add MIT license and baseline docs
  - Subtask 1.1.2: Add README with badges, hero banner, and support section
- Task 1.2: Configure docs engine
  - Subtask 1.2.1: Add MkDocs config and section navigation
  - Subtask 1.2.2: Add starter pages for each learning track
- Task 1.3: Set automation
  - Subtask 1.3.1: Add CI workflow for docs validation
  - Subtask 1.3.2: Add GitHub Pages deployment workflow
  - Subtask 1.3.3: Add Wiki sync workflow

### Epic 2 - Curriculum and learning experience

- Task 2.1: Foundations module
  - Subtask 2.1.1: Math and statistics essentials
  - Subtask 2.1.2: Optimization and evaluation basics
- Task 2.2: ML and DL modules
  - Subtask 2.2.1: Core algorithms and trade-offs
  - Subtask 2.2.2: End-to-end model lifecycle
- Task 2.3: AI engineering and agents modules
  - Subtask 2.3.1: Tooling, reliability, and observability
  - Subtask 2.3.2: Memory, planning, and evaluation loops

### Epic 3 - Interview and practice system

- Task 3.1: Interview prep by level
  - Subtask 3.1.1: Junior baseline topics
  - Subtask 3.1.2: Mid-level scenario questions
  - Subtask 3.1.3: Senior system design and leadership topics
- Task 3.2: FAQ and learning support
  - Subtask 3.2.1: Frequently blocked concepts
  - Subtask 3.2.2: Study plans and revision cadence

### Epic 4 - Community and sustainability

- Task 4.1: Contribution workflows and templates
  - Subtask 4.1.1: Add issue and PR templates
  - Subtask 4.1.2: Add contribution guide updates per module
- Task 4.2: Sponsorship and maintenance signals
  - Subtask 4.2.1: Configure funding channels
  - Subtask 4.2.2: Add release notes and changelog cadence
