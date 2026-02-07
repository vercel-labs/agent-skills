# Assets — Non-Normative Text Aids

This directory contains **text-only** quick-reference tables, decision trees,
and checklists derived from the normative doctrine in `references/`.

## Policy

- Assets are **non-normative**: they summarize and operationalize the rules in
  `references/` but MUST NOT introduce new rules.
- Assets MUST NOT contain language-specific code templates, framework imports,
  or file suffix conventions. Those belong in language organization skills
  (e.g., `typescript-testing-organization`).
- If an asset contradicts a reference, the reference wins.

## Contents

### Quick References

| File | Purpose |
|------|---------|
| [quickref/tier-matrix.md](quickref/tier-matrix.md) | Tier → purpose, scope, boundaries, doubles, assertions (one table) |
| [quickref/doubles-matrix.md](quickref/doubles-matrix.md) | Dummy/fake/stub/spy/mock + allowed-by-tier (one table) |
| [quickref/glossary.md](quickref/glossary.md) | Canonical definitions of testing terms |

### Decision Trees

| File | Purpose |
|------|---------|
| [decision-trees/choose-tier.md](decision-trees/choose-tier.md) | Deterministic procedure for selecting a test tier |
| [decision-trees/choose-double.md](decision-trees/choose-double.md) | Deterministic procedure for selecting a test double type |

### Checklists

| File | Purpose |
|------|---------|
| [checklists/test-review.md](checklists/test-review.md) | Contract-shaped assertions, brittleness checks |
| [checklists/regression-fix.md](checklists/regression-fix.md) | "Lowest tier that reproduces mechanism" workflow |
| [checklists/suite-health.md](checklists/suite-health.md) | Hermetic / deterministic / parallel rubric |
