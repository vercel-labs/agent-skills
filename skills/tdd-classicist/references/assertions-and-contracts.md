# Assertions and Contracts

Assertions are what give tests their value. A test with weak or misguided
assertions is worse than no test — it creates false confidence. This reference
codifies what to assert, how to assert it, and how contracts serve as the
spine of meaningful tests.

---

## Core Principle

**Assert behavior and invariants over incidental details.**

A good assertion answers: "What contract is being proven, and what would break
if this fails?"

---

## What to Assert (Preferred → Avoid)

### MUST prefer "meaningful" assertions

- Domain outputs (return values, computed results)
- Persistence effects (rows created/updated, documents stored)
- Emitted events or messages (event type, payload shape, key fields)
- HTTP semantics (status codes, content-type, error shapes)
- Error codes and structured error contracts
- Contract fields (the fields a consumer depends on)

### SHOULD avoid

- Deep object equality on large objects (brittle; breaks on unrelated changes)
- Overbroad snapshots (snapshot the contract fields, not the entire response)
- Internal call sequences (unless the call *is* the contract)
- Incidental implementation details (internal variable values, private state)

### Snapshot policy

- Snapshots are acceptable for **contract fields** (e.g., API response shape).
- Snapshots MUST NOT cover the entire object if only a subset of fields is
  contractual.
- When a snapshot breaks, the developer MUST understand *which contract* broke,
  not just "something changed."

---

## Contracts as the Spine of Meaningful Tests

Every test SHOULD be traceable to an explicit contract:

| Contract Source | Example |
|----------------|---------|
| Unit-level contract | "This function returns a sorted array of unique items" |
| API schema | OpenAPI spec, GraphQL schema, Protobuf definition |
| Event contract | CloudEvents envelope, AsyncAPI channel definition |
| User story / PRD | "As a user, I can reset my password via email" |
| Implicit contract made explicit | "The cache MUST return the same result as the source for the same key" |

### The failure mode to avoid

Lots of tests that pass but do not correspond to any stated guarantee —
**busywork coverage**. If you cannot name the contract a test is proving, the
test is suspect.

### Making contracts explicit

When a test verifies an *implicit* contract, the test name or a comment SHOULD
state the contract explicitly:

```
// Pseudocode
test("cache returns same result as source for identical key", ...)
test("retry policy invokes operation at most 3 times", ...)
test("[contract] POST /orders returns 201 with Location header", ...)
```

---

## Test Names MUST Explain Intent

A test name SHOULD read like a contract statement:

| Good | Bad |
|------|-----|
| "rejects empty email with VALIDATION_FAILED error" | "test email" |
| "retries failed operations exactly 3 times" | "retry works" |
| "returns 404 when order does not exist" | "test GET" |
| "[regression] ISSUE-42: handles null payload without crash" | "bug fix test" |

The structure of the name: **[context] behavior [expected outcome]**.

---

## Gray-box / Black-box / White-box Assertions

| Tier | Default Perspective | Assertion Guidance |
|------|-------------------|-------------------|
| Unit | Gray/white-box | You know internals, but assertions MUST be contract-shaped. Do not assert implementation details unless the detail *is* the contract. |
| Boundary integration | Gray-box | You know the boundary and its failure modes. Assert observable effects across the boundary (persisted rows, HTTP responses, emitted messages). |
| Functional | Black-box leaning | Assert user-observable outcomes. MAY use gray-box hooks if they reduce brittleness without undermining what is being proven. |
| Contract | Black-box | Assert schema/contract compliance only. |
| E2E/System | Black-box | Assert user-observable outcomes. MAY use gray-box hooks selectively. |

---

## Assertion Anti-Patterns

| Anti-pattern | Why harmful | Fix |
|-------------|-------------|-----|
| Deep equality on large objects | Breaks on any unrelated change | Assert only contractual fields |
| Snapshot everything | "Something changed" is not actionable | Snapshot only contract-shaped subsets |
| Assert call order | Couples test to implementation | Assert state/output instead; use spy only for side-effect contracts |
| No assertion at all | Test always passes; proves nothing | Every test MUST have at least one meaningful assertion |
| Assertion on mock setup | Tests the test, not the SUT | Assert SUT state/output |
| Over-precise numeric assertions | Breaks on acceptable rounding changes | Use approximate matchers for floating-point |

---

## See Also

- [taxonomy-test-doubles.md](taxonomy-test-doubles.md) — state vs behavior verification
- [taxonomy-test-tiers.md](taxonomy-test-tiers.md) — what to assert at each tier
- [suite-health.md](suite-health.md) — determinism requirements for assertions
