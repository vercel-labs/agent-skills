# Checklist — Suite Health

Use this checklist to audit the health of a test suite. Derived from
[suite-health.md](../../references/suite-health.md).

---

## Hermetic

- [ ] Each test creates its own state (no dependency on other tests running
      first).
- [ ] No shared mutable state between tests (global variables, shared DB rows,
      shared files).
- [ ] Tests can run in any order and produce the same result.
- [ ] If reference data is shared, it is immutable.

## Deterministic

- [ ] No live network calls (except to local/ephemeral containers).
- [ ] Time is controlled via dependency injection (clock abstraction), not
      `Date.now()` / `time.Now()`.
- [ ] Randomness is seeded or abstracted.
- [ ] Filesystem access uses temp directories or in-memory alternatives.
- [ ] Tests produce the same result on every run, on any machine.

## Parallel-Safe

- [ ] Tests are safe to run in parallel.
- [ ] Database tests use per-test isolation (ephemeral DB, transaction
      rollback, or schema-per-test).
- [ ] No locks, sleeps, or ordering dependencies between tests.

## Fixtures

- [ ] Data setup uses builders/factories (composable, explicit).
- [ ] No giant golden fixtures that many tests depend on.
- [ ] No shared mutable fixtures.
- [ ] Static fixtures (JSON, CSV) are read-only and small.

## Output Hygiene

- [ ] Test runs produce pristine output (no warnings, no deprecation notices,
      no unhandled rejections).
- [ ] Logging is suppressed or captured during tests.
- [ ] No noise that could hide real failures.

## Organization

- [ ] Directory and suffix conventions are standardized and documented.
- [ ] CI can target tiers predictably (unit, boundary-integration, functional, contract, e2e).
- [ ] No drift between documented conventions and actual file locations.
- [ ] Enforcement is automated (linters, audit scripts).

## Maintenance

- [ ] No flaky tests (fix or quarantine immediately).
- [ ] No tests that always pass regardless of implementation (zombie tests).
- [ ] No test-only methods on production classes.
- [ ] Test helpers are well-maintained and documented.
