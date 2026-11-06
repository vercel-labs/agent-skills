# Report Format

A QA engagement produces two artifacts: a **test plan** written before testing,
and an **execution report** written after. Both are designed so a reader who
sees only the document knows exactly what was and was not covered.

## Result framework

Every test case resolves to exactly one result:

| Result | Meaning |
|--------|---------|
| **PASS** | Verified working in the browser, with evidence. |
| **FAIL** | Verified broken. File a bug with repro + severity. |
| **SKIP** | Not run. State the reason. |
| **BLOCKED** | Could not run; an earlier bug blocks reaching it. Name the blocker. |

A PASS is never awarded from reading code or reasoning about intent — only from
observed browser behavior.

## Bug severity

| Severity | Use for |
|----------|---------|
| **P1** | Silent failure, data loss, crash, security/auth hole. Blocks sign-off. |
| **P2** | Degraded UX, broken-but-recoverable, missing error handling. |
| **P3** | Cosmetic or minor. Does not block sign-off. |

## Test plan template

Written *before* execution. Maps the journey and enumerates cases — including
the negative ones.

```markdown
# Test Plan — <Feature>

**Prepared:** YYYY-MM-DD
**App URL:** <url>
**Auth:** <how to authenticate / seed user>
**Out of scope:** <what this plan deliberately does not cover, and why>

## Journey
<entry → actions → expected system response → exit, and the failure branches>

## Cases

| ID | Test | Expected | How to verify |
|----|------|----------|---------------|
| F-01 | Feature renders | "<heading>" visible | `get text "h1"` |
| F-02 | Happy path completes | Lands on <state> | walk flow, assert URL/text |
| F-03 | Empty state | Intentional empty view | empty account; read body |
| F-04 | Loading state | Spinner appears then resolves | screenshot on navigate |
| F-05 | Error state | Visible error message | `network route --body`, reload |
| F-06 | Unauthorized | Blocked / redirected | clear cookies, open route |
| F-07 | Offline | Degrades, stays usable | `set offline on`, retry |
| F-08 | Persistence | Change survives reload | mutate, reload, re-read |
```

## Execution report template

Written *after* execution. Records results and every bug found.

```markdown
# QA Execution Report — <Feature>

**Date:** YYYY-MM-DD
**App URL:** <url>
**Screenshots:** <path or attachment note>

## Summary

| Passed | Failed | Blocked | Skipped |
|--------|--------|---------|---------|
| 0 | 0 | 0 | 0 |

## Results

| ID | Result | Notes |
|----|--------|-------|
| F-01 | PASS | Heading "<...>" visible |
| F-03 | FAIL | BUG-01 — empty list renders blank, no message |
| F-04 | SKIP | Loading state resolved too fast to capture |
| F-06 | BLOCKED | Blocked by BUG-01 |

## Bugs

### BUG-01 — <title> (P1)

**Repro:**
1. `agent-browser open <url>`
2. <exact commands>

**Observed:** <what the browser showed>
**Expected:** <what should have happened>

## Out of scope / risks

<What was not tested and why; what could still break.>
```

## Why "out of scope" is mandatory

An explicit out-of-scope section is what separates "I tested the feature" from
"I tested these eight cases and deliberately left these two." Without it, a
reader assumes full coverage and is surprised by the gap. State exclusions and
the reason for each.
