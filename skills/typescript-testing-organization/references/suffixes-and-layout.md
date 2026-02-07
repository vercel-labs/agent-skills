# TypeScript Test Suffixes and Directory Layout

This reference defines a single, mechanically enforceable convention for where
tests live and how they are named, so test intent is obvious from path + suffix
and CI can target tiers predictably.

For tier definitions and purpose/audience/scope, see
`tdd-classicist/references/taxonomy-test-tiers.md`.

---

## Principles

- Unit tests are **siblings** of the unit they test (colocated under `src/`).
- Anything that crosses a boundary (DB, HTTP, queue, filesystem, process) is
  **not** a unit test.
- Higher tiers live **outside `src/`** to avoid accidental coupling and to keep
  unit tests cheap-by-default.
- Suffix encodes tier; directory encodes tier; either alone SHOULD be
  sufficient, both together is preferred for robustness.

---

## File Suffix Conventions

All test files end with `.spec.ts` (or `.spec.tsx` for React). The tier is
encoded immediately before `.spec`.

| Tier | Suffix | Example |
|------|--------|---------|
| Unit | `*.spec.ts` / `*.spec.tsx` | `calcRiskScore.spec.ts` |
| Integration | `*.int.spec.ts` | `raw-events.repository.int.spec.ts` |
| Functional | `*.func.spec.ts` | `order-checkout.func.spec.ts` |
| Contract | `*.contract.spec.ts` | `payment-api.contract.spec.ts` |
| E2E / System | `*.e2e.spec.ts` | `critical-checkout-flow.e2e.spec.ts` |

### Optional (only if you run them)

- Performance / benchmarks: `*.bench.ts` (excluded from normal CI by default)

### Regression tests

Regression is a property of **intent**, not a tier. Do NOT create a special
suffix or directory.

Mark regression tests via naming inside the test:

```typescript
describe('[regression] ISSUE-42: handles null payload without crash', () => {
  it('returns 400 instead of crashing', () => {
    // ...
  });
});
```

Or at the `it` level:

```typescript
it('[regression] ISSUE-42: returns 400 for null payload', () => {
  // ...
});
```

Keep the regression test at the **lowest tier** that reproduces the bug's
mechanism.

---

## Directory Organization

### Colocated unit tests (default)

```
src/
  domain/risk-score/
    calcRiskScore.ts
    calcRiskScore.spec.ts          # Unit test (sibling)
  components/
    UserCard.tsx
    UserCard.spec.tsx              # Unit test (sibling)
```

**Rules:**
- Unit tests MAY import from `src/**` freely.
- Unit tests MUST NOT import from `test/**`.
- Unit tests MUST NOT start infrastructure (DB containers, HTTP servers, real
  queues).

### Higher-tier tests (outside src)

Use a single `test/` root per project/package/app:

```
test/
  _support/                        # Shared helpers (see support-code.md)
  integration/                     # *.int.spec.ts
    raw-events.repository.int.spec.ts
  functional/                      # *.func.spec.ts
    order-checkout.func.spec.ts
  contract/                        # *.contract.spec.ts
    payment-api.contract.spec.ts
  e2e/                             # *.e2e.spec.ts
    critical-checkout-flow.e2e.spec.ts
```

---

## Nx / Monorepo Guidance

Per app/lib, keep the same layout (`src/` + `test/`). Do NOT centralize all
tests in the repo root unless you have a strong reason.

### Recommended targets

| Target | Tiers Included | When |
|--------|---------------|------|
| `test` (PR default) | Unit + Integration | Every PR |
| `test:functional` | Functional | Every PR or gated |
| `test:contract` | Contract | Scheduled (nightly/weekly) |
| `test:e2e` | E2E / System | Scheduled or gated |

### Glob examples

| Tier | Glob |
|------|------|
| Unit | `src/**/*.spec.ts?(x)` |
| Integration | `test/integration/**/*.int.spec.ts` |
| Functional | `test/functional/**/*.func.spec.ts` |
| Contract | `test/contract/**/*.contract.spec.ts` |
| E2E | `test/e2e/**/*.e2e.spec.ts` |

---

## Hard Constraints (mechanical enforcement)

These invariants MUST be enforced by audit scripts or linters:

- No `*.int.spec.*` files under `src/`.
- No DB/HTTP/server/container bootstrap in files matching `src/**/*.spec.*`.
- No imports from `test/**` inside `src/**`.

## Soft Constraints (lintable)

- Prefer builders over static fixtures for domain objects.
- Prefer state/output assertions over call-order expectations; mocks MUST be
  justified.

---

## See Also

- [support-code.md](support-code.md) — `test/_support/` conventions
- [spec-vs-test.md](spec-vs-test.md) — why `.spec` and not `.test`
