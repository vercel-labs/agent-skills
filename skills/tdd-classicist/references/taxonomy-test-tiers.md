# Test Tiers — Taxonomy and Roles

The test pyramid defines six tiers. Each tier has a distinct **purpose**,
**audience**, **scope**, and set of constraints. Choosing the wrong tier wastes
effort or leaves gaps.

This reference is language-agnostic. For file suffixes, directory layout, and
naming conventions in a specific language, see the corresponding language
organization skill (e.g., `typescript-testing-organization`).

---

## 1. Unit Tests (many)

**Purpose:** Verify that a single unit (module, class, function) fulfills its
explicit responsibility and contract.

**Audience:** The developer who owns the unit. Failures pinpoint the exact
module that broke.

**Scope:**
- In-process, deterministic, IO-free or IO-abstracted.
- The unit has an explicit responsibility and contract.
- Tests are colocated with the unit as a sibling artifact.

**Boundaries:**
- MUST NOT start infrastructure (databases, HTTP servers, queues, containers).
- MUST NOT make live network calls.
- MUST NOT depend on system time, filesystem state, or unseeded randomness.

**Doubles policy:**
- SHOULD prefer real collaborators when cheap and deterministic.
- SHOULD use stubs or fakes for IO or nondeterministic dependencies.
- MAY use spies occasionally to verify that a side-effect was triggered (when
  the side-effect *is* the contract).
- Mocks (expectation-driven) are rare and MUST be justified. If you need more
  than 2-3 mocks in a unit test, the design is likely too coupled.

**Assertions:**
- MUST assert state, output, or invariants first.
- MUST NOT assert internal call sequences unless the call itself *is* the
  contract (e.g., "must emit an event").
- SHOULD read like "what contract is being proven."

**Anti-patterns:**
- Testing mock behavior instead of real behavior.
- Vague test names (`test('works')`, `test('test1')`).
- "and" in the test name — split into separate tests.
- Giant setup that obscures intent.

---

## 2. Integration Tests (some)

**Purpose:** Exercise exactly one meaningful real boundary at a time to verify
that the system behaves correctly across that boundary.

**Audience:** The team that owns the boundary adapter. Failures reveal
serialization bugs, SQL semantics issues, transaction problems, migration
drift, concurrency errors, or retry logic failures.

**Scope:**
- "Meaningful boundary" = where the failure modes change: database, message
  queue, filesystem, HTTP transport, external service adapter.
- Typical targets: repositories, controllers/handlers/adapters, gateways.

**Boundaries:**
- MUST exercise exactly one real boundary per test.
- MUST be hermetic: no shared mutable state across tests.
- MUST be reproducible and parallelizable.
- SHOULD use ephemeral infrastructure (e.g., container per suite/test) when
  feasible; rollback is acceptable if it preserves isolation guarantees.

**Open question (decide per project):**
- "Controller integration" — does it mean real HTTP transport (start a server)
  or in-process handler invocation? Both are valid; the choice MUST be explicit
  and consistent within a project.

**Data setup:**
- MUST prefer builders/factories and small composable seeds over giant fixtures.
- MUST NOT couple tests to large static snapshots of the world.
- MAY use a shared seed for read-only reference data if it never mutates.

**Doubles policy:**
- The boundary under test MUST be real (that is the point).
- Other collaborators SHOULD use stubs/fakes to keep the test focused.

**Assertions:**
- MUST assert externally observable effects across the boundary (persisted
  rows, HTTP responses, emitted messages, filesystem output).
- Gray-box by default: you know the boundary and failure modes, but assertions
  target observable effects, not implementation internals.

**Anti-patterns:**
- Testing multiple boundaries in one test (that is a functional test).
- Using shared mutable state between tests (ordering dependencies).
- Giant fixture files that nobody maintains.

---

## 3. Functional Tests (few; "in-process slices")

**Purpose:** Validate a user-story slice or feature behavior, potentially
crossing multiple units and sometimes multiple modules/services, but still in
a controlled environment.

**Audience:** Product and engineering. Failures reveal broken orchestration,
routing, or validation logic at the feature level.

**Scope:**
- BDD-like: proves "feature correctness" more than low-level edge semantics.
- May cross multiple units and internal boundaries.
- Still avoids "real world": no real third-party calls in PR runs.

**Boundaries:**
- MUST keep the count small per feature (a handful, not dozens).
- MUST NOT call real third-party services in CI.
- SHOULD use controlled fakes for external dependencies.

**Doubles policy:**
- Internal collaborators SHOULD be real.
- External services MUST be faked (e.g., in-memory implementations, stub
  servers, intercepted HTTP).

**Assertions:**
- Black-box leaning: assert user-observable outcomes (API responses, UI state,
  emitted events, side-effects visible to the user).
- MAY use selective gray-box hooks if they reduce brittleness without
  invalidating what is being proven.

**Anti-patterns:**
- Duplicating unit-level edge-case testing at the functional tier.
- So many functional tests that the suite is slow and fragile.

---

## 4. Contract Tests (targeted, scheduled)

**Purpose:** Validate that your stubs/fakes match real provider/consumer
behavior and that cross-service assumptions hold.

**Audience:** Integration and platform teams. Failures reveal schema drift,
breaking API changes, or stale stubs.

**Scope:**
- Provider contract tests verify your service meets the contract consumers
  depend on.
- Consumer contract tests verify your stubs/fakes accurately represent the
  provider.

**Scheduling:**
- SHOULD run nightly/weekly, especially for third-party APIs.
- MAY run on every PR for internal contracts if fast enough.
- MUST NOT be the only test tier exercising a boundary (integration tests
  cover the boundary itself; contracts verify assumptions).

**Practical notes:**
- Stub/fake HTTP handlers (e.g., MSW handlers) are stubs/fakes. Do NOT treat
  them as expectation-driven mocks unless explicitly needed.
- Contract tests SHOULD be traceable to an explicit schema (OpenAPI, AsyncAPI,
  Protobuf, CloudEvents envelope, etc.).

**Anti-patterns:**
- Treating contract tests as integration tests (they serve different purposes).
- Running expensive third-party contract checks on every PR.

---

## 5. Regression Tests (whenever a bug is fixed)

**Purpose:** Pin a specific bug so it cannot recur.

**Audience:** The developer who fixed the bug and future maintainers.

**Scope:**
- Regression is a **property of intent**, not a separate tier.
- A regression test lives at whatever tier reproduces the bug's mechanism.

**Rules:**
- Every bug fix MUST earn a regression test that would have failed before the
  fix.
- The regression test MUST be placed at the **lowest tier** that still
  reproduces the bug's mechanism.
- Regression tests SHOULD be tagged or named to indicate their regression
  intent (e.g., `[regression] ISSUE-123: ...` in the test description).

**Anti-patterns:**
- "We fixed it but only added a giant E2E test" when a smaller boundary test
  would have pinned it faster and cheaper.
- Creating a dedicated "regression" directory — regression is a tag, not a
  location.

---

## 6. System / E2E / Harness Tests (very few)

**Purpose:** Verify full-stack critical paths from the user's perspective.

**Audience:** Product, QA, and on-call engineers. Failures indicate a
user-facing regression in a critical flow.

**Scope:**
- Full-stack: exercises the deployed system (or a close replica).
- Minimal count, high signal. Only critical user journeys.

**Boundaries:**
- MUST NOT call real third-party services in PR runs; use controlled fakes.
- SHOULD seed data via public APIs rather than direct DB writes, to keep tests
  aligned with the system's true entry points.
- MAY call real third parties in scheduled/nightly runs if needed for
  confidence.

**Terminology note:**
- "E2E", "system test", and "harness test" are used interchangeably in this
  doctrine. Pick one term per project and use it consistently.

**Assertions:**
- Black-box: assert user-observable outcomes only.
- MAY use selective gray-box hooks (e.g., checking a DB row after a UI action)
  if they reduce flakiness without undermining what is being proven.

**Anti-patterns:**
- Too many E2E tests (slow, flaky, expensive).
- Using E2E tests as the primary safety net instead of investing in lower tiers.
- Testing edge cases at the E2E tier that belong in unit or integration tests.

---

## Cross-cutting: Gray-box / Black-box / White-box

| Tier | Default Perspective | Notes |
|------|-------------------|-------|
| Unit | Gray/white-box | You know internals, but assertions SHOULD still be contract-shaped |
| Integration | Gray-box | You know the boundary and failure modes; assert observable effects |
| Functional | Black-box leaning | User-observable outcomes; selective gray-box hooks allowed |
| Contract | Black-box | Schema/contract compliance |
| E2E/System | Black-box | User-observable outcomes; selective gray-box hooks allowed |

---

## See Also

- [taxonomy-test-doubles.md](taxonomy-test-doubles.md) — doubles policy per tier
- [assertions-and-contracts.md](assertions-and-contracts.md) — what to assert at each tier
- [suite-health.md](suite-health.md) — hermetic/deterministic/parallel rules
