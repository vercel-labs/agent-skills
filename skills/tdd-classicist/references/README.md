# References — Source of Truth

This directory contains the normative doctrine for the `tdd-classicist` skill.
Each file is self-contained, language-agnostic, and covers one topic area.

## Policy

- Reference files are the **single source of truth** for their topic.
- Each file uses normative language: **MUST**, **SHOULD**, **MAY**.
- Each file includes language-agnostic examples or pseudocode for clarity.
- Cross-links between references are encouraged but each file MUST stand alone.
- References MUST NOT contain language-specific code templates, file suffixes,
  or framework APIs. Those belong in language organization skills.

## Index

| File | Topic |
|------|-------|
| [taxonomy-test-tiers.md](taxonomy-test-tiers.md) | Unit / Boundary integration / Functional / Contract / Regression / E2E — purpose, audience, scope, boundaries |
| [taxonomy-test-doubles.md](taxonomy-test-doubles.md) | Meszaros taxonomy (dummy/fake/stub/spy/mock), tiered doubles policy, decision guidance |
| [assertions-and-contracts.md](assertions-and-contracts.md) | Assertion strategy, contracts as spine, gray/black/white-box guidance |
| [suite-health.md](suite-health.md) | Hermetic, deterministic, parallel-by-default; fixture strategy; anti-patterns |
| [methodology-red-green-refactor.md](methodology-red-green-refactor.md) | TDD cycle, Iron Law, verification gates, rationalizations |
| [classical-vs-mockist.md](classical-vs-mockist.md) | Fowler/Meszaros classical vs mockist distinction, decision guidance |
