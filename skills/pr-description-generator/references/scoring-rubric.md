# Scoring Rubric

Scores are integers 1-10. Use the bands below as anchors; interpolate for in-between cases.
Be honest - a mediocre PR should not score 8+.

---

## Code Quality (1-10)

Measures readability, correctness, and maintainability of the implementation.

| Band | Score | Signal |
|------|-------|--------|
| Excellent | 9-10 | Clean naming, no duplication, proper error handling, self-documenting, no smells |
| Good | 7-8 | Minor issues (slightly long functions, a TODO), overall solid |
| Average | 5-6 | Some duplication, inconsistent naming, missing error handling in places |
| Poor | 3-4 | Hard to follow, significant duplication, missing error handling, magic numbers |
| Critical | 1-2 | Unreadable, copy-paste everywhere, no error handling, security issues |

**Key signals to check:**
- Consistent naming conventions
- Functions/methods are focused (single responsibility)
- Error paths are handled (not just happy path)
- No obvious security issues (SQL injection, unvalidated inputs, exposed secrets)
- Dead code removed
- No commented-out code blocks left behind

---

## Architecture (1-10)

Measures how well the change fits the existing architecture and does not introduce coupling or design debt.

| Band | Score | Signal |
|------|-------|--------|
| Excellent | 9-10 | Clean layering, no leaky abstractions, extensible, follows existing patterns |
| Good | 7-8 | Fits well, minor deviation from patterns, no significant new coupling |
| Average | 5-6 | Some layer violations, moderate coupling, partial pattern adherence |
| Poor | 3-4 | Business logic in wrong layer, tight coupling, breaks existing abstractions |
| Critical | 1-2 | Architectural regression - cross-cutting concerns tangled, god objects created |

**Key signals to check:**
- Does the change respect existing layer boundaries (UI / API / service / repository)?
- Are new dependencies injected or imported correctly?
- Does the change introduce circular dependencies?
- Is new functionality placed in the right module/package?
- Are interfaces/contracts preserved or evolved cleanly?

---

## Test Coverage (1-10)

Measures whether the change is adequately tested.

| Band | Score | Signal |
|------|-------|--------|
| Excellent | 9-10 | Happy path, edge cases, error cases, and regression scenarios all covered with meaningful assertions |
| Good | 7-8 | Happy path and most edge cases covered; assertions verify behavior not just execution |
| Average | 5-6 | Happy path covered; edge cases partially covered; some assertions are shallow |
| Poor | 3-4 | Only a few tests; critical paths untested; tests assert almost nothing useful |
| Critical | 1-2 | No tests added for new logic, or existing tests deleted without replacement |

**Key signals to check:**
- Are new functions/methods covered by at least one test?
- Do tests assert meaningful outcomes (not just "no exception thrown")?
- Are error/failure paths tested?
- Are boundary values tested (empty list, null, zero, max)?
- Do integration tests cover the changed flows end-to-end if applicable?
