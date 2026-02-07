# Checklist — Test Review

Use this checklist when reviewing tests (your own or in code review).
Derived from [assertions-and-contracts.md](../../references/assertions-and-contracts.md)
and [taxonomy-test-doubles.md](../../references/taxonomy-test-doubles.md).

---

## Contract and Intent

- [ ] Can you name the contract this test is proving?
- [ ] Does the test name read like a contract statement
      (`[context] behavior [expected outcome]`)?
- [ ] Is the test traceable to an explicit contract (unit contract, API schema,
      user story, or stated implicit contract)?
- [ ] If it is a regression test, does the name include a reference to the
      issue/bug being pinned?

## Assertions

- [ ] Assertions target **state/output/invariants**, not internal call
      sequences (unless the call *is* the contract).
- [ ] Assertions are "meaningful": domain outputs, persistence effects, emitted
      events, HTTP semantics, error codes, or contract fields.
- [ ] No deep object equality on large objects (assert only contractual fields).
- [ ] No overbroad snapshots (snapshot only contract-shaped subsets).
- [ ] At least one meaningful assertion per test (no assertion-free tests).

## Doubles

- [ ] Real collaborators are used wherever cheap and deterministic.
- [ ] If doubles are used, they follow the tiered preference:
      stub → fake → spy → mock.
- [ ] Any mock (expectation-driven) has a justification (comment or test name
      explains why behavior verification is needed).
- [ ] No more than 2-3 doubles per test. If more, consider redesigning the SUT.
- [ ] MSW/HTTP interceptor handlers are treated as stubs/fakes, not mocks
      (unless the call sequence is the contract).

## Brittleness

- [ ] Would a refactoring that preserves behavior leave this test passing?
- [ ] Does the test avoid asserting on internal implementation details?
- [ ] Does the test avoid depending on execution order?
- [ ] Does the test avoid shared mutable state?

## Clarity

- [ ] Test is focused: one behavior per test.
- [ ] No "and" in the test name (split if needed).
- [ ] Setup (Arrange) is minimal and explicit about what it creates.
- [ ] The test reads top-to-bottom: Arrange → Act → Assert.
