# Test Tiers — Taxonomy and Roles

The test pyramid defines six tiers. Each tier has a distinct **purpose**,
**audience**, **scope**, and set of constraints. Choosing the wrong tier wastes
effort or leaves gaps.

This reference is language-agnostic. For file suffixes, directory layout, and
naming conventions in a specific language, see the corresponding language
organization skill (e.g., `typescript-testing-organization`).

## Tier classification rules (hard boundary)

A test’s tier is determined by two things only:

1. **Primary claim**: the contract the test proves (what the test is claiming)
2. **SUT boundary + real boundary count**: what is “inside” the test’s SUT
   boundary and how many *real* boundaries are exercised (\(0 / 1 / many\))

Everything else (AAA vs GWT, `test()` vs `it()`, naming aesthetics) is secondary
and MUST NOT be used to classify the tier.

### Definitions

#### Real boundary

A “real boundary” is any production implementation whose semantics meaningfully
differ from a fake/stub and whose failure modes you explicitly want coverage
for.

Examples:

- Database (driver + SQL semantics, constraints, transactions, migrations)
- HTTP transport stack (routing/middleware/validation/serialization)
- Message broker client
- Filesystem
- Clock/time
- Serialization codecs/parsers
- External service adapter

#### SUT boundary

The set of code you consider “inside” the test. Everything outside is a
collaborator and MUST be faked/stubbed unless it is explicitly part of the real
boundary under test.

#### Primary claim

The contract the test proves. If a test proves multiple primary claims, it is
mis-scoped and MUST be split.

### Non-negotiable constraints (MUST)

- A test MUST have exactly one primary claim.
- A test MUST be classifiable by the rules below without reading
  implementation details. The tier should be inferable from the test harness
  and which real boundary is exercised (if any).
- A test MUST NOT be classified by “how many units it touches.”
- A non-E2E test MUST NOT exercise more than one real boundary.
- Any test that exercises multiple real boundaries is a System/E2E/Harness test
  by definition.

### Never classify by “how many units it touches”

Classification is NOT based on “how many modules/classes/functions were involved.”

- A test can touch many in-process units and still be a **unit test** (if no
  real boundary is crossed and the SUT boundary is a single unit + chosen
  collaborators).
- A test can touch a single unit and still be a **boundary integration test**
  (if it crosses a real boundary, such as a real database).

### The mechanical classifier (4 questions)

1. **Did the test cross any real boundary?**
   - No → Unit or Functional or Contract
   - Yes → Boundary Integration or E2E/System
2. **If yes: how many real boundaries are exercised?**
   - Exactly one → Boundary Integration
   - More than one → E2E/System (multi-boundary integration is generally forbidden)
3. **If no: is the SUT a single unit or a use-case slice across units?**
   - Single unit → Unit
   - Slice/journey across units → Functional
4. **Is the primary thing being proven cross-service compatibility/schema/versioning?**
   - Yes → Contract
   - No → keep prior classification

### Decision table (quick summary)

| Real boundary count | SUT boundary | Primary claim | Tier |
|---:|-------------|--------------|------|
| 0 | single unit (+ chosen in-process collaborators) | invariants / outputs | Unit |
| 0 | service-level slice across multiple units (bounded context) | use-case acceptance criteria | Functional |
| 0 (usually) | contract between producer and consumer | compatibility / schema / versioning | Contract |
| 1 | adapter + exactly one real boundary | boundary semantics | Boundary Integration |
| many | multiple deployed components wired together | wiring/config + critical paths | System/E2E/Harness |

---

## 1. Unit Tests (many)

**Purpose:** Verify that a single unit (module, class, function) fulfills its
explicit responsibility and contract.

**SUT boundary:** One unit (module/class/function) plus any in-process
collaborators you intentionally include.

**Real boundary count:** 0.

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

## 2. Boundary Integration Tests (some)

**Purpose:** Exercise exactly one meaningful real boundary at a time to verify
that the system behaves correctly across that boundary.

**SUT boundary:** Your adapter layer + exactly one real boundary (chosen
deliberately).

**Real boundary count:** 1.

**Audience:** The team that owns the boundary adapter. Failures reveal
serialization bugs, SQL semantics issues, transaction problems, migration
drift, concurrency errors, or retry logic failures.

**Scope:**
- "Meaningful boundary" = where the failure modes change: database, message
  queue, filesystem, HTTP transport stack (router + middleware + serialization),
  serializer/parser, system clock, external service adapter.
- Typical targets: repositories, controllers/handlers/adapters, gateways.

**Boundaries:**
- MUST exercise exactly one real boundary per test (real boundary count = 1).
- Other boundaries MUST be faked/stubbed (do not “accidentally” cross two).
- MUST be hermetic: no shared mutable state across tests.
- MUST be reproducible and parallelizable.
- SHOULD use ephemeral infrastructure (e.g., container per suite/test) when
  feasible; rollback is acceptable if it preserves isolation guarantees.

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
- Crossing multiple real boundaries in one test (“multi-boundary integration”).
  This is System/E2E by definition and is generally forbidden.
- Using shared mutable state between tests (ordering dependencies).
- Giant fixture files that nobody maintains.

---

## 3. Functional Tests (few; "in-process slices")

**Purpose:** Validate a user-story slice or feature behavior, potentially
crossing multiple units and sometimes multiple modules/services, but still in
a controlled environment.

**SUT boundary:** A service-level use-case slice across multiple internal units
(controller/handler → service → domain → ports) within one bounded context.

**Real boundary count:** 0.

**Audience:** Product and engineering. Failures reveal broken orchestration,
routing, or validation logic at the feature level.

**Scope:**
- BDD-like: proves "feature correctness" more than low-level edge semantics.
- May cross multiple units and internal boundaries.
- Still avoids "real world": no real third-party calls in PR runs.

**Boundaries:**
- Real boundary count MUST be 0.
- MUST keep the count small per feature (a handful, not dozens).
- MUST NOT call real third-party services in CI.
- SHOULD use controlled fakes for external dependencies.
- If a test includes a real boundary, it is NOT a functional test by tier
  classification. It is intentionally mixing concerns and MUST be explicitly
  justified, then treated (and named) as boundary integration or system/E2E by
  real boundary count.

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

**SUT boundary:** The contract between producer and consumer (schema +
compatibility rules).

**Real boundary count:** optional; usually 0.

**Audience:** Integration and platform teams. Failures reveal schema drift,
breaking API changes, or stale stubs.

**Scope:**
- Provider contract tests verify your service meets the contract consumers
  depend on.
- Consumer contract tests verify your stubs/fakes accurately represent the
  provider.

**Real boundaries:**
- Optional; usually none. Sometimes you run provider verification against a
  real provider build, but the point is contract fidelity, not “full
  integration.”

**Scheduling:**
- SHOULD run nightly/weekly, especially for third-party APIs.
- MAY run on every PR for internal contracts if fast enough.
- MUST NOT be the only test tier exercising a boundary (boundary integration
  tests cover the boundary itself; contracts verify assumptions).

**Practical notes:**
- Stub/fake HTTP handlers (e.g., MSW handlers) are stubs/fakes. Do NOT treat
  them as expectation-driven mocks unless explicitly needed.
- Contract tests SHOULD be traceable to an explicit schema (OpenAPI, AsyncAPI,
  Protobuf, CloudEvents envelope, etc.).

**Anti-patterns:**
- Treating contract tests as boundary integration tests (they serve different purposes).
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

**SUT boundary:** Multiple deployed components wired together (often including
real infrastructure).

**Real boundary count:** many (by definition).

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
- Testing edge cases at the E2E tier that belong in unit or boundary integration tests.

---

## Controller tests: strict classification rules

A “controller test” is NOT a tier. It becomes one of three tiers depending on
how you drive it.

### A) Unit (or small slice)

- You call the handler/controller function directly with stubs/fakes for
  dependencies.
- Real boundary count = 0 (no real HTTP transport, middleware, serialization).
- Claim: handler/business logic invariants (without asserting transport semantics).

### B) Boundary integration

- You drive the controller through the real HTTP stack (router + middleware +
  serialization), but you stub/fake service and DB ports.
- Real boundary count = 1 (HTTP transport/middleware/serialization boundary).
- Claim: “this endpoint behaves correctly as an HTTP endpoint” (status codes,
  headers, auth middleware, request validation, JSON shape).
- Business rules SHOULD be minimal or delegated; do not turn this into a use-case
  test.

### C) Functional

- You drive through the service public interface (often HTTP) and include
  multiple internal units (controller + service + domain), but all external
  boundaries are faked.
- Real boundary count = 0.
- Claim: “given this context/state, the use-case outcome is X”.

If a single test tries to prove both **(B)** transport/middleware semantics and
**(C)** use-case acceptance criteria, it is mis-scoped. Split it.

---

## Repository tests: strict classification rules

Repository tests are **boundary integration tests** when:

- They use a real DB (ephemeral DB / Testcontainers pattern) and assert DB
  semantics (constraints, transactions, migrations, SQL behavior).
- They are hermetic and parallel-safe.

Repository tests are NOT unit tests unless:

- The “repository” is an in-memory fake, or a pure mapper with no real DB
  boundary.

Repository tests MUST NOT silently become System/E2E:

- If a repository test also exercises HTTP transport, a message broker, the
  filesystem, or any other real boundary, it is out of tier. Split it so the
  boundary integration test exercises exactly one real boundary.

---

## Naming and structure (tier-aligned, non-classifying)

Naming/style is NOT how you classify tiers, but it SHOULD be tier-aligned.

### Given/When/Then vs factual invariants

- Unit + Boundary integration: prefer factual/invariant titles.
  - Examples: “throws when dt <= 0”, “enforces unique(email)”, “round-trips null mapping”.
- Functional + Contract + E2E: scenario framing is allowed and often helpful.
  - Examples: “given inactive user, when login, then returns 403”.

Scenario phrasing is allowed, but titles MUST still be outcome-shaped (observable
result), not vague intentions.

These are aesthetics guidelines; they MUST NOT be used as classification inputs.

---

## Cross-cutting: Gray-box / Black-box / White-box

| Tier | Default Perspective | Notes |
|------|-------------------|-------|
| Unit | Gray/white-box | You know internals, but assertions SHOULD still be contract-shaped |
| Boundary Integration | Gray-box | You know the boundary and failure modes; assert observable effects |
| Functional | Black-box leaning | User-observable outcomes; selective gray-box hooks allowed |
| Contract | Black-box | Schema/contract compliance |
| E2E/System | Black-box | User-observable outcomes; selective gray-box hooks allowed |

---

## See Also

- [taxonomy-test-doubles.md](taxonomy-test-doubles.md) — doubles policy per tier
- [assertions-and-contracts.md](assertions-and-contracts.md) — what to assert at each tier
- [suite-health.md](suite-health.md) — hermetic/deterministic/parallel rules
