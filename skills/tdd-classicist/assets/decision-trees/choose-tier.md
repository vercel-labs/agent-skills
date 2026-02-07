# Decision Tree — Choose a Test Tier

Use this procedure to determine which tier a test belongs to. Start at the top
and follow the branches.

Derived from [taxonomy-test-tiers.md](../../references/taxonomy-test-tiers.md).

---

## Procedure

Classification is based on two inputs:

- **Real boundary count** (\(0 / 1 / many\))
- **SUT boundary** (single unit vs use-case slice vs contract vs deployed journey)

The test MUST have exactly one primary claim (one contract proved). If it has
multiple, split it before classifying.

Do NOT classify by “how many units it touches.”

### 0. Is this test pinning a specific bug fix?

- **Yes** → This is a **regression test**. Determine the bug's mechanism, then
  continue to step 1 to find the **lowest tier** that reproduces it. Tag the
  test as `[regression]`.
- **No** → Continue to step 1.

### 1. Did the test cross any real boundary?

"Real boundary" = database, message queue, filesystem, HTTP transport, external
service adapter, system clock, serializer/parser, middleware stack — anywhere
the failure modes change (serialization, SQL semantics, transactions,
concurrency, retries).

- **No** → Go to step 3.
- **Yes** → Go to step 2.

### 2. If yes: how many real boundaries are you exercising?

- **Exactly one** → **Boundary integration**.
- **More than one** → **E2E/System**.

  Multi-boundary integration is generally forbidden; if you need it, treat it
  explicitly as system/E2E (or redesign to isolate one boundary per test).

### 3. If no real boundary: is the SUT a single unit or a use-case slice across units?

"Unit" = module, class, function with a clear responsibility. The test is
in-process, deterministic, and IO-free (or IO-abstracted).

- **Yes** → **Unit test** (colocated with the unit).
- **No, it spans multiple units / a use-case slice** → **Functional test**.

### 4. Contract override: is the primary claim cross-service compatibility/schema/versioning?

- **Yes** → **Contract test** (even if executed inside one codebase's test
  runner, and even if it runs provider verification against a real provider
  build).

  Treat it as contract because the thing being proven is the contract, not
  “integration.”
- **No** → Keep the prior classification.

---

## Summary Flowchart

```
Bug fix? ──yes──→ [regression] tag + find lowest tier
  │no
  ▼
Cross real boundary? ──yes──→ Count boundaries
  │no
  ▼
Count boundaries ──1──→ Boundary integration
  │              └many→ E2E/System
  ▼
No real boundary → Single unit? yes→ Unit
               │
               └no → Functional

Contract claim? yes→ Contract (override)
             no→ keep prior classification
```
