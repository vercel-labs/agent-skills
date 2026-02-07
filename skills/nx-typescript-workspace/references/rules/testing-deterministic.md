---
title: Tests Must Be Deterministic
impact: HIGH
impactDescription: prevents flaky tests and unreliable CI
tags: testing, deterministic, flaky, isolation
---

## Tests Must Be Deterministic

**Impact: HIGH (prevents flaky tests and unreliable CI)**

Tests MUST produce the same result on every run. No live network calls (except
to local containers), no dependency on system time, no random values without
seeding.

**Incorrect (non-deterministic tests):**

```typescript
// ❌ Depends on live network
it('should fetch user data', async () => {
  const response = await fetch('https://api.example.com/users/1');
  expect(response.ok).toBe(true);
});

// ❌ Depends on system time
it('should expire after 30 minutes', () => {
  const token = createToken();
  expect(token.expiresAt.getTime()).toBeGreaterThan(Date.now());
});

// ❌ Random values without seeding
it('should generate unique ID', () => {
  const id = generateId();
  expect(id).toHaveLength(32); // May pass/fail based on random output
});
```

**Correct (deterministic tests):**

```typescript
// ✅ Uses local container (Testcontainers)
it('should persist event to database', async () => {
  const db = await startPostgresContainer();
  const repo = new KyselyRawEventsRepo(db);
  await repo.create(testEvent);
  const found = await repo.findById(testEvent.id);
  expect(found).toEqual(testEvent);
});

// ✅ Controlled time via dependency injection
it('should expire after 30 minutes', () => {
  const fakeClock = { now: () => new Date('2026-01-01T12:00:00Z') };
  const token = createToken({ clock: fakeClock });
  expect(token.expiresAt).toEqual(new Date('2026-01-01T12:30:00Z'));
});

// ✅ Seeded randomness
it('should generate unique ID', () => {
  const fakeRng = createSeededRng(42);
  const id = generateId({ rng: fakeRng });
  expect(id).toBe('expected-deterministic-id');
});
```

**Rules:**
- No live network calls (except local containers)
- Time and randomness must be controlled via dependency injection
- Database tests use Testcontainers with real PostgreSQL
- Test setup and teardown must leave no shared state

Reference: [Vitest — Test Isolation](https://vitest.dev/guide/improving-performance#test-isolation)
