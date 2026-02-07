---
title: Tests MUST Be Written Before Implementation
impact: HIGH
impactDescription: ensures correctness and prevents untested code
tags: testing, test-first, tdd, methodology
---

## Tests MUST Be Written Before Implementation

**Impact: HIGH (ensures correctness and prevents untested code)**

This is NON-NEGOTIABLE: new behavior MUST be covered by automated tests before
implementation is considered done. Implementation MUST follow a strict test-first
mindset (Red-Green-Refactor):

1. Write unit/integration tests for the intended behavior.
2. Validate that tests compile and can be run.
3. Confirm tests FAIL (Red phase) before implementation makes them pass.

**Exception:** Critical production hotfixes may have tests added in a follow-up
PR within 24 hours.

**Incorrect (implementation without tests):**

```typescript
// ❌ PR contains only implementation, no tests
// libs/guard/ingestion/domain/src/event-ingestion.usecase.ts
export function ingestEvent(input: EventInput, deps: IngestDeps) {
  const hash = computeEventHash(input);
  return { ...input, hash, bufferedAt: deps.clock.now() };
}
// No corresponding .test.ts or .spec.ts file
```

**Incorrect (tests written after implementation):**

```typescript
// ❌ Tests added as an afterthought, may not cover edge cases
// Written to match existing implementation rather than intended behavior
it('should return hash', () => {
  const result = ingestEvent(input, deps);
  expect(result.hash).toBeDefined(); // Weak assertion
});
```

**Correct (test-first approach):**

```typescript
// libs/guard/ingestion/domain/src/event-ingestion.usecase.test.ts
// ✅ Step 1: Write test for intended behavior
describe('ingestEvent', () => {
  it('should compute deterministic hash from event payload', () => {
    const input = createEventInput({ payload: { action: 'login' } });
    const deps = { repo: fakeRepo(), clock: fakeClock('2026-01-01') };

    const result = ingestEvent(input, deps);

    expect(result.hash).toBe('expected-sha256-hash');
    expect(result.bufferedAt).toEqual(new Date('2026-01-01'));
  });

  it('should reject events with missing environmentId', () => {
    const input = createEventInput({ environmentId: undefined });
    expect(() => ingestEvent(input, deps)).toThrow('MISSING_ENV_ID');
  });
});
// ✅ Step 2: Run tests — they FAIL (Red)
// ✅ Step 3: Implement — tests PASS (Green)
// ✅ Step 4: Refactor while tests stay green
```

Reference: [Test-Driven Development](https://martinfowler.com/bliki/TestDrivenDevelopment.html)
