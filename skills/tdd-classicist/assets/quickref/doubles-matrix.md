# Doubles Matrix — Quick Reference

Derived from [taxonomy-test-doubles.md](../../references/taxonomy-test-doubles.md).

## Meszaros Test Doubles

| Double | What It Does | Verification | When to Use |
|--------|-------------|-------------|-------------|
| **Dummy** | Fills parameter lists; never called | None | Required arg that test does not exercise |
| **Fake** | Working implementation with shortcut (e.g., in-memory DB) | State | Need real behavior without production cost |
| **Stub** | Returns canned answers | State | Control a dependency's return value |
| **Spy** | Stub + records how it was called | State (on recorded data) | Verify side-effect that *is* the contract |
| **Mock** | Pre-programmed with call expectations | **Behavior** | Interaction protocol *is* the contract |

## Allowed by Tier

| Tier | Dummy | Fake | Stub | Spy | Mock |
|------|:-----:|:----:|:----:|:---:|:----:|
| Unit | Yes | Yes | Yes (preferred) | Occasionally | Rare; must justify |
| Boundary integration | Yes | For non-boundary deps | For non-boundary deps | Occasionally | Rare |
| Functional | Yes | For external services | For external services | Occasionally | Rare |
| Contract | - | Being validated | Being validated | - | - |
| E2E/System | - | For third parties only | For third parties only | - | - |

## Tiered Preference Order

```
stub → fake → spy → mock
```

Use the simplest double that satisfies the test's needs. Escalate only when
the simpler option is insufficient.
