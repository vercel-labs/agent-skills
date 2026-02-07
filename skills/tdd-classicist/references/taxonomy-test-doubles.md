# Test Doubles — Meszaros Taxonomy and Tiered Policy

This reference defines the five kinds of test double (per Gerard Meszaros) and
codifies when each is appropriate. The goal: stubs and fakes by default, mocks
only when justified, so "mock explosion" is mechanically discouraged.

Source: Martin Fowler, "Mocks Aren't Stubs"
(https://martinfowler.com/articles/mocksArentStubs.html)

---

## The Five Test Doubles

| Double | Definition | Verification Style | Typical Use |
|--------|-----------|-------------------|-------------|
| **Dummy** | Passed around but never used. Fills parameter lists. | None | Satisfying a required argument that the test does not exercise |
| **Fake** | Working implementation that takes a shortcut unsuitable for production (e.g., in-memory database). | State verification | Replacing expensive infrastructure with a fast, deterministic alternative |
| **Stub** | Provides canned answers to calls made during the test. Does not respond to anything outside what is programmed. | State verification | Controlling the return value of a dependency to test a specific code path |
| **Spy** | A stub that also records information about how it was called (e.g., an email service that records message count). | State verification (on recorded data) | Verifying that a side-effect was triggered, when the side-effect *is* the contract |
| **Mock** | Pre-programmed with expectations about which calls it will receive. Verification happens against those expectations. | **Behavior verification** | Verifying the exact interaction protocol between the SUT and a collaborator |

### Key distinction

Only mocks insist on **behavior verification** (checking *how* the SUT
interacts with the double). All other doubles use **state verification**
(checking the outcome/result after the exercise phase).

---

## Tiered Preference (MUST follow this order)

When you need a test double, prefer them in this order:

```
stub → fake → spy → mock
```

1. **Stub** first — simplest; returns canned data; no recording.
2. **Fake** when you need working behavior (e.g., in-memory repo that supports
   queries) but cannot use the real thing.
3. **Spy** when you need to verify a side-effect was triggered (e.g., "an email
   was sent") and the side-effect is part of the contract.
4. **Mock** (expectation-driven) only when the interaction protocol itself *is*
   the contract and no state-based alternative exists.

### Justification rule

- Using a **mock** MUST be justified in the test (a comment or the test name
  SHOULD explain why behavior verification is needed).
- If you find yourself needing 3+ mocks in a single test, STOP. The design is
  likely too coupled. Consider redesigning the SUT before adding more mocks.

---

## Doubles Policy by Test Tier

| Tier | Preferred Doubles | Notes |
|------|------------------|-------|
| Unit | Stubs, fakes | Real collaborators when cheap. Spies for side-effect contracts. Mocks rare. |
| Boundary integration | Stubs/fakes for non-boundary deps | The boundary under test MUST be real. |
| Functional | Fakes for external services | Internal collaborators SHOULD be real. |
| Contract | Stubs/fakes being validated | The point is to verify the double matches reality. |
| E2E/System | Fakes for third parties only | Everything else SHOULD be real. |

---

## State Verification vs Behavior Verification

**State verification:** After exercising the SUT, examine the state of the SUT
and its collaborators. "Did the right thing happen?"

```
// Pseudocode — state verification
warehouse.add("Talisker", 50)
order.fill(warehouse)
assert order.isFilled() == true
assert warehouse.inventory("Talisker") == 0
```

**Behavior verification:** Pre-program expectations on a mock, exercise the
SUT, then verify the mock received the expected calls. "Did it talk to the
right collaborators in the right way?"

```
// Pseudocode — behavior verification
mock_warehouse.expect("hasInventory").with("Talisker", 50).returns(true)
mock_warehouse.expect("remove").with("Talisker", 50)
order.fill(mock_warehouse)
mock_warehouse.verify()
```

### When behavior verification is appropriate

- The interaction itself *is* the contract (e.g., "must call audit logger
  with these fields").
- There is no observable state change to verify (e.g., cache hit vs miss —
  you cannot tell from state whether the cache was used).
- The collaborator is a pure side-effect channel (event bus, metrics emitter).

### When behavior verification is NOT appropriate

- You are testing "what happened" not "how it happened."
- The same outcome could be achieved through different call sequences (and
  that is fine).
- You are coupling the test to implementation details that may change during
  refactoring.

---

## Common Anti-Patterns

| Anti-pattern | Why it is harmful | Fix |
|-------------|-------------------|-----|
| Mock everything | Tests verify call graphs, not behavior. Refactoring breaks all tests. | Use real objects; stub only IO/nondeterminism. |
| Mocking what you own (unnecessarily) | You control the collaborator; just use the real thing. | Use the real collaborator or a fake. |
| Expectation-driven mocks for simple returns | Over-specifies interaction; a stub would suffice. | Replace mock with a stub. |
| "Test the mock" | Assertions verify mock setup, not SUT behavior. | Assert SUT state/output instead. |
| Spy on everything | Recording every call makes tests brittle. | Spy only on side-effects that are part of the contract. |
| Mock explosion (3+ mocks per test) | Signals excessive coupling in the SUT. | Redesign the SUT to reduce dependencies. |

---

## MSW / HTTP Interceptors — Classification

HTTP interceptor handlers (such as MSW handlers) are **stubs or fakes**, not
mocks, unless you explicitly add expectation-driven assertions on them.

- Using MSW to return canned responses = **stub**.
- Using MSW with a stateful in-memory backend = **fake**.
- Using MSW and asserting it received specific calls in a specific order =
  **mock** (avoid unless the call sequence is the contract).

---

## See Also

- [taxonomy-test-tiers.md](taxonomy-test-tiers.md) — which doubles are allowed at each tier
- [classical-vs-mockist.md](classical-vs-mockist.md) — the philosophical divide
- [assertions-and-contracts.md](assertions-and-contracts.md) — state vs behavior assertions
