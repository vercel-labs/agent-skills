# Decision Tree — Choose a Test Tier

Use this procedure to determine which tier a test belongs to. Start at step 1
and follow the branches.

Derived from [taxonomy-test-tiers.md](../../references/taxonomy-test-tiers.md).

---

## Procedure

### 1. Is this test pinning a specific bug fix?

- **Yes** → This is a **regression test**. Determine the bug's mechanism, then
  continue to step 2 to find the **lowest tier** that reproduces it. Tag the
  test as `[regression]`.
- **No** → Continue to step 2.

### 2. Does this test need to exercise a real infrastructure boundary?

"Real boundary" = database, message queue, filesystem, HTTP transport, external
service adapter — anywhere the failure modes change (serialization, SQL
semantics, transactions, concurrency, retries).

- **No** → Go to step 3.
- **Yes, exactly one boundary** → **Integration test**.
- **Yes, multiple boundaries** → Go to step 4.

### 3. Is the code under test a single unit with an explicit contract?

"Unit" = module, class, function with a clear responsibility. The test is
in-process, deterministic, and IO-free (or IO-abstracted).

- **Yes** → **Unit test** (colocated with the unit).
- **No, it spans multiple units / a feature slice** → Go to step 4.

### 4. Does this test validate a user-story slice or feature behavior?

It crosses multiple units, possibly multiple modules, but stays in a controlled
environment (no real third parties in CI).

- **Yes** → **Functional test** (few per feature).
- **No** → Go to step 5.

### 5. Does this test validate that stubs/fakes match real provider/consumer behavior?

It checks schema conformance or verifies assumptions about an external API.

- **Yes** → **Contract test** (schedule nightly/weekly for third-party APIs).
- **No** → Go to step 6.

### 6. Does this test exercise a full-stack critical user path?

- **Yes** → **E2E / System test** (minimal count; fakes for third parties in CI).
- **No** → Re-examine the test's purpose. It may belong at a simpler tier than
  you think. Default to the **lowest tier** that covers the behavior.

---

## Summary Flowchart

```
Bug fix? ──yes──→ [regression] tag + find lowest tier
  │no
  ▼
Real boundary? ──yes, one──→ Integration
  │no          └─yes, many──→ step 4
  ▼
Single unit? ──yes──→ Unit
  │no
  ▼
Feature slice? ──yes──→ Functional
  │no
  ▼
Stub/fake validation? ──yes──→ Contract
  │no
  ▼
Full-stack critical path? ──yes──→ E2E/System
  │no
  ▼
Default to lowest tier that covers the behavior.
```
