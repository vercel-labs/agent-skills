---
name: tdd-classicist
description:
  Classicist TDD methodology — test-first Red-Green-Refactor cycle, Meszaros
  test-double taxonomy (dummy/fake/stub/spy/mock), tiered test pyramid
  (unit → boundary integration → functional → contract → regression → E2E), assertion
  policies, and contracts-as-spine doctrine. Use when writing tests, choosing
  test doubles, deciding test tier, reviewing test quality, or fixing bugs.
  Do NOT use for test file naming/suffixes/layout (see
  typescript-testing-organization), test-runner configuration (see
  vitest-monorepo), CI pipeline setup, or framework-specific testing APIs.
---

# TDD — Classicist

Classicist by default, pragmatic about doubles, strict about test purpose and
boundaries. This skill encodes a complete, **language-agnostic** testing
methodology: the TDD cycle, a precise test-double taxonomy, a tiered test
pyramid, and assertion policies grounded in contracts.

## Applicability Gate

Apply this skill when ANY of the following are true:

- You need to decide which **test tier** a test belongs to (unit / boundary integration /
  functional / contract / regression / E2E)
- You need to choose a **test double type** (dummy / fake / stub / spy / mock)
- You need guidance on **what to assert** (state vs behavior, contract-shaped
  assertions)
- You are following the **TDD cycle** (Red-Green-Refactor) and need its rules
- You are reviewing tests for **quality, brittleness, or mock overuse**
- You need to understand the **classical vs mockist** testing distinction

Do NOT apply when:

- Deciding **file suffixes, directory layout, or naming conventions** for a
  specific language → route to the language organization skill:
  - TypeScript/JavaScript → `typescript-testing-organization`
  - Go → (future) `go-testing-organization`
- Configuring **test runners** (`vitest.config.ts`, `jest.config.ts`,
  `playwright.config.ts`) → `vitest-monorepo` or framework-specific skill
- Setting up **CI pipelines or coverage thresholds**
- Working in this skills repository itself

## Routing Table

| Question | Route to |
|----------|----------|
| "What tier should this test be?" | [assets/decision-trees/choose-tier.md](assets/decision-trees/choose-tier.md) |
| Tier definitions + constraints (canonical) | [taxonomy-test-tiers](references/taxonomy-test-tiers.md) |
| "Should I mock/stub/fake this?" | [taxonomy-test-doubles](references/taxonomy-test-doubles.md) |
| "What should I assert?" | [assertions-and-contracts](references/assertions-and-contracts.md) |
| "Is my test suite healthy?" | [suite-health](references/suite-health.md) |
| "How does Red-Green-Refactor work?" | [methodology-red-green-refactor](references/methodology-red-green-refactor.md) |
| "Classical vs mockist — which am I?" | [classical-vs-mockist](references/classical-vs-mockist.md) |
| Quick tier lookup table | [assets/quickref/tier-matrix.md](assets/quickref/tier-matrix.md) |
| Quick doubles lookup table | [assets/quickref/doubles-matrix.md](assets/quickref/doubles-matrix.md) |
| Glossary of testing terms | [assets/quickref/glossary.md](assets/quickref/glossary.md) |
| Choosing a tier (procedure) | [assets/decision-trees/choose-tier.md](assets/decision-trees/choose-tier.md) |
| Choosing a double (procedure) | [assets/decision-trees/choose-double.md](assets/decision-trees/choose-double.md) |
| Test review checklist | [assets/checklists/test-review.md](assets/checklists/test-review.md) |
| Regression fix checklist | [assets/checklists/regression-fix.md](assets/checklists/regression-fix.md) |
| Suite health checklist | [assets/checklists/suite-health.md](assets/checklists/suite-health.md) |
| "How do I name/place TS test files?" | → **typescript-testing-organization** skill |
| "Audit doubles usage in TS codebase" | → **typescript-testing-organization** `scripts/` |

## Procedure

1. **Identify the task type.** Is the user choosing a tier, choosing a double,
   writing assertions, following the TDD cycle, or reviewing test quality?
2. **Route to the right reference.** Use the routing table above. Read only
   the reference file(s) needed — do not load all six.
3. **Apply the methodology.** Follow the normative rules (MUST/SHOULD/MAY)
   from the loaded reference.
4. **When writing tests,** always follow the Red-Green-Refactor cycle from
   `methodology-red-green-refactor.md`. No production code without a failing
   test first.
5. **When choosing doubles,** follow the tiered preference in
   `taxonomy-test-doubles.md`: stub → fake → spy → mock. Justify any mock.
6. **When placing tests in a specific tier,** consult `taxonomy-test-tiers.md`
   for purpose/scope/audience, then route to the language organization skill
   for file naming and directory conventions.

## Confirmation Policy

Do NOT apply changes derived from these rules without explicit user
confirmation. Present proposed test code and placement as diffs and wait for
approval.

## Related Skills

- **typescript-testing-organization** — TS file suffixes, directory layout,
  templates, and audit scripts
- **vitest-monorepo** — Vitest runner configuration and workspace setup
- **typescript-quality** — Typed clients, Zod validation, structured errors
- **esm-typescript** — ESM module patterns for `import.meta.url` in tests
