# Glossary — Canonical Testing Terms

This glossary defines terms as used within the `tdd-classicist` skill.
When a term has multiple common meanings, the canonical definition here takes
precedence within this skill's doctrine.

## Test Types / Tiers

| Term | Definition |
|------|-----------|
| **Unit test** | In-process, deterministic, IO-free test colocated with the unit under test. Verifies a single unit's contract. |
| **Boundary integration test** | Test that exercises exactly one meaningful real boundary (real boundary count = 1): DB, queue, filesystem, HTTP transport stack, serializer/parser, system clock, etc. Hermetic and reproducible. |
| **Integration test** | Alias for **boundary integration test** in this doctrine. |
| **Functional test** | In-process slice test that validates a user-story or feature behavior across multiple units (real boundary count = 0). Controlled environment; no real third parties. |
| **Contract test** | Validates that stubs/fakes match real provider/consumer behavior. Often scheduled (nightly/weekly). |
| **Regression test** | Test pinning a specific bug fix at the lowest tier that reproduces the bug's mechanism. A property of intent, not a separate tier. |
| **E2E / System / Harness test** | Full-stack test of critical user paths. Minimal count, high signal. Uses controlled fakes for third parties in CI. |

## Test Doubles (Meszaros)

| Term | Definition |
|------|-----------|
| **Test double** | Generic term for any pretend object used in place of a real object for testing. |
| **Dummy** | Passed around but never used. Fills parameter lists. |
| **Fake** | Working implementation that takes a shortcut unsuitable for production (e.g., in-memory database). |
| **Stub** | Provides canned answers to calls made during the test. |
| **Spy** | A stub that also records information about how it was called. |
| **Mock** | Pre-programmed with expectations about calls it should receive. Uses behavior verification. |

## Verification Styles

| Term | Definition |
|------|-----------|
| **State verification** | Checking the state of the SUT and collaborators after exercising the behavior. "Did the right thing happen?" |
| **Behavior verification** | Checking that the SUT made the correct calls to collaborators. "Did it talk correctly?" |

## TDD Concepts

| Term | Definition |
|------|-----------|
| **SUT** | System Under Test — the object/module being tested. |
| **SUT boundary** | What is considered “inside” the SUT for a given test (the unit/slice/contract/journey plus any intentionally included collaborators). |
| **Collaborator** | An object the SUT depends on to fulfill its behavior. |
| **Red-Green-Refactor** | The TDD cycle: write a failing test (red), write minimal code to pass (green), clean up (refactor). |
| **Iron Law** | No production code without a failing test first. |

## Schools of TDD

| Term | Definition |
|------|-----------|
| **Classical / Detroit style** | Use real objects when possible; verify by state; double only when awkward. |
| **Mockist / London style** | Always mock collaborators with interesting behavior; verify by behavior (expectations). |
| **Classicist by default** | This skill's stance: classical as the default; mockist techniques as justified tools. |

## Other Terms

| Term | Definition |
|------|-----------|
| **Contract** | An explicit statement of what a unit/service/API provides to its consumers. Tests should be traceable to a contract. |
| **Primary claim** | The single contract a test is proving. If a test has multiple primary claims, it is mis-scoped and should be split. |
| **Hermetic** | A test that is self-contained: creates its own state, does not depend on other tests or shared mutable state. |
| **Deterministic** | A test that produces the same result on every run, on any machine. |
| **Builder** | A test helper that constructs domain objects with sensible defaults and composable overrides. |
| **Seed** | A small, deterministic dataset used to set up test state. |
| **Object Mother** | A factory class providing pre-built test fixtures (similar to builders). |
| **Real boundary** | A boundary where the test relies on the real semantics of the boundary (not a stub/fake/in-memory stand-in): DB, network/HTTP stack, queue, filesystem, system clock, serializer/parser, process boundary. |
| **Boundary** | The point where failure modes change (e.g., serialization, SQL, HTTP transport). Boundary integration tests exercise **exactly one real boundary**. |
