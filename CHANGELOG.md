# Changelog

All notable changes to this project are documented in this file.

## [0.23.0] - 2026-03-02

- Improved docs home with a 15-minute quick path and clearer goal-based entry navigation.
- Improved onboarding clarity by adding explicit choose-by-goal links on the docs landing page.
- Improved wiki start-page utility with fast links to roadmap, start path, practice, and interview prep.

## [0.22.0] - 2026-03-02

- Improved contribution guidance with a quick-start flow, release cadence expectations, and stronger validation/evidence notes.
- Improved PR template quality gates by adding explicit scope tagging and learner-impact/release-scope checks.
- Improved issue triage quality with new smallest-scope and learner-impact fields in content and bug templates.

## [0.21.0] - 2026-03-02

- Improved practice docs with a clearer weekly usage loop, lab selection guidance, and fast debrief prompts.
- Improved summaries docs with explicit usage timing, a 15-minute revision loop, and measurable progress signals.
- Added direct practice-to-summaries navigation in README goal-based paths.

## [0.20.0] - 2026-03-02

- Expanded FAQ with practical study loop, weekly cadence guidance, and clearer progress signals.
- Linked FAQ guidance more explicitly to interview-prep and planning pages for faster learner navigation.
- Improved project plan clarity with a concise usage guide and current execution focus section.

## [0.19.0] - 2026-03-02

- Improved AI engineering docs with an explicit progression into agent systems and readiness checks for safe adoption.
- Improved AI agents docs with entry criteria, baseline-vs-agent progression, and required output artifacts.
- Added direct AI engineering-to-agents sequence navigation in README goal paths.

## [0.18.0] - 2026-03-02

- Improved machine-learning docs with explicit transition guidance and readiness checks before moving into deep learning.
- Improved deep-learning docs with entry criteria, baseline-vs-DL comparison loop, and expected output artifacts.
- Added direct ML-to-DL progression navigation in README goal-based paths.

## [0.17.0] - 2026-03-02

- Improved foundations docs with a start-to-depth sequence and clear readiness signals before moving to advanced material.
- Improved deep-dives docs with entry criteria, a focused study loop, and expected output artifacts.
- Added a direct foundation-to-depth learning path in README goal navigation.

## [0.16.0] - 2026-03-02

- Refined interview prep entry docs with a measurable 30-minute prep loop and a compact answer-quality rubric.
- Added a practical practice/debrief method to the question bank for faster mock interview iteration.
- Added role-specific common mistake checklists across junior, mid, and senior tracks.

## [0.15.0] - 2026-03-02

- Refined live-check dashboard docs with copy/paste command examples for production, preview, and markdown artifact workflows.
- Added a quick interpretation guide for totals, freshness, base URL, monitored path count, and error triage signals.
- Improved discoverability of reliability checks from both practice navigation and README goal-based entry points.

## [0.14.0] - 2026-03-02

- Added `--paths` support to live smoke checks so route subsets can be targeted per environment.
- Added monitored path metadata to live smoke JSON/markdown outputs and dashboard status context.
- Expanded UX smoke script tests to cover custom path parsing and path-aware reporting behavior.

## [0.13.0] - 2026-03-02

- Added `--base-url` support to live smoke checks so CI and local runs can target production or preview deployments.
- Extended live smoke JSON/markdown artifacts with source `baseUrl` metadata for clearer dashboard/report traceability.
- Updated live-check dashboard docs and seeded snapshot data to display and preserve base URL context.

## [0.12.0] - 2026-03-02

- Added live-check dashboard drill-down controls with row filtering (`all`, `errors`, `ok`) and optional auto-refresh.
- Added a per-row error detail column in the dashboard UI to speed up hosted-pages failure triage.
- Extended shared dashboard/viewer styling for new controls while preserving the existing minimalist docs look.

## [0.11.0] - 2026-03-02

- Fixed live-check dashboard loading to use the correct snapshot path, auto-load data on open, and show freshness and status totals.
- Added automated unit tests for UX smoke/dashboard scripts and wired them into the `ux-checks` workflow.
- Improved live smoke diagnostics with stronger flag validation and richer JSON/markdown reporting metadata.

## [0.10.0] - 2026-03-02

- Improved the shared-result verifier UX with diagnostics, payload helper actions, and faster recovery flows.
- Added leaderboard viewer sort modes (`score_desc`, `time_asc`, `newest`) and CSV export for offline analysis.
- Added live-check dashboard generation from CI smoke artifacts with JSON output, markdown rendering, and docs integration.

## [0.9.0] - 2026-03-01

- Added a public read-only leaderboard viewer page with endpoint loading, filters, and pagination.
- Added full quiz interaction E2E automation (answer -> review -> finalize -> export) using Playwright for regression coverage.
- Added live hosted pages smoke checks and integrated UX checks workflow for route smoke, interaction E2E, and live verification.
- Hardened anti-replay and idempotency guidance and endpoint handling docs for leaderboard submissions.

## [0.8.0] - 2026-03-01

- Fixed quiz page loading reliability by adding multi-path question bank resolution for different deployment base paths.
- Added signed-result verification helper page and wired it into practice navigation.
- Added anti-replay nonce/token metadata and idempotency key support for optional leaderboard submissions.
- Improved mobile quiz actions layout and made Playwright smoke runner dependency-light.

## [0.7.0] - 2026-03-01

- Simplified quiz UX with a minimalist default flow and collapsible advanced settings.
- Added attempt integrity metadata and optional leaderboard endpoint submission support.
- Added share snapshot enrichment with topic breakdown and timing percentile context.
- Refreshed README style to a more emoji-rich, learner-first format inspired by master-philosophers.
- Added Playwright smoke script and executed full page-route screenshot checks on built docs.

## [0.6.0] - 2026-03-01

- Added adaptive next-question routing to adjust upcoming difficulty from live performance.
- Added optional per-topic section timer with visible section countdown in the quiz UI.
- Added signed shareable result links plus shared-result viewer and copy-link action.

## [0.5.0] - 2026-03-01

- Added advanced web quiz scoring modes: standard, negative marking, and confidence-based points.
- Added review-before-submit flow with question jumping, plus JSON/CSV export for completed quiz attempts.
- Improved donation visibility across README, docs home, and quiz page with a direct Stripe support link.

## [0.4.0] - 2026-03-01

- Added quiz difficulty balancing controls with configurable junior/mid/senior mix percentages.
- Added richer timer analytics including per-question timing plus fastest/slowest question stats.
- Added browser-saved progress tracking with attempts, best score, average score, and recent run history.

## [0.3.0] - 2026-03-01

- Added a GitHub Pages interview quiz web UI with topic selection, question count control, randomization seed, and countdown timer.
- Added end-of-quiz analytics with score, timing, and topic-level accuracy breakdown.
- Added a sync test to ensure web quiz questions stay aligned with the CLI quiz source.

## [0.2.0] - 2026-03-01

- Added interview prep tracks for junior, mid, and senior roles, plus a reusable question bank.
- Added practical labs and starter examples in Python, Julia, and R.
- Added a timed interview quiz simulator with random topic selection and score analytics.
- Added issue/PR templates to standardize community contributions.

## [0.1.1] - 2026-03-01

- Replaced placeholder repo, docs, wiki, and sponsor URLs with live project links.

## [0.1.0] - 2026-03-01

- Bootstrapped repository with MIT license and contribution guide.
- Added docs structure and initial learning-path content.
- Added GitHub Actions for CI, Pages deploy, Wiki sync, and tagged releases.
