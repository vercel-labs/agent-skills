---
name: web-qa-testing
description: QA a running web app by driving it in a real browser with agent-browser — exercise real flows and verify real behavior, not source code. Use when the user wants to test a feature, reproduce or verify a bug, walk a user flow end to end, check the states that are easy to forget (empty, loading, error, unauthorized, offline), do a regression pass, or produce a QA test plan and execution report. Triggers: "test this feature", "QA this", "reproduce this bug", "verify the fix", "does this flow work", "write a test plan", "check the error state".
license: MIT
metadata:
  author: vercel
  version: "1.0.0"
---

# Web QA Testing

Test a web application the way a QA engineer does: by **using the product** in a
real browser and verifying what it actually does. This skill drives
[`agent-browser`](https://github.com/vercel-labs/agent-browser) to exercise real
flows, observe real output, and produce a structured report.

This is **black-box behavioral testing**. It does not read or judge the app's
source code — it has no knowledge of the codebase's conventions, framework, or
file layout, and it does not need any. It tests behavior through the browser, so
it works on any web app regardless of stack.

## Core Principle: Observe, Don't Assume

A test result must come from something the browser actually showed.

- **A PASS requires browser-verified evidence.** Reading code, or reasoning that
  something "should" work, never justifies a PASS. Navigate to it, do it, read
  the result.
- **Assert exact values**, not vibes. Use `get text` / `eval` to read the real
  string, status, or count and compare it to what was expected.
- **After a mutation, reload and re-check.** A success message is not proof the
  change persisted. Reload the page and confirm the new state survives.

## When to Use This Skill

- **Feature / use-case testing** — does this flow work end to end?
- **Bug reproduction** — turn a vague report into deterministic repro steps.
- **Fix verification** — confirm a fixed bug no longer reproduces.
- **Regression** — re-walk a known-good flow after a change.
- **State coverage** — the states that ship broken: empty, loading, error,
  unauthorized, offline.

## Workflow

Follow these steps in order. Do not start clicking before you have mapped the
journey.

### 1. Map the user journey

Before touching the browser, write down the flow: where the user starts, what
they do, what the system should do at each step, where they end up, and **what
should happen when any step fails**. The failure branches are the test cases
most people skip.

### 2. Pre-flight

Confirm the app is reachable and set up auth/data through a stable path (an API,
a seed command, or stored credentials) rather than clicking through the UI to
get there — UI setup is slow and couples every test to the login screen.

```bash
agent-browser close --all                 # start from a clean session
agent-browser open https://localhost:3000 # or the app's URL
agent-browser get title                    # confirm the app loaded, not an error page
```

### 3. Walk the flow

The core loop for every step: act, wait for the result, read what happened,
capture it.

```bash
agent-browser snapshot                       # accessibility tree with @refs — read before acting
agent-browser find label "Email" fill "test@app.test"
agent-browser find label "Password" fill "Pass123!"
agent-browser find role button click --name "Sign in"
agent-browser wait --url "**/dashboard"      # wait for the expected result, not a fixed delay
agent-browser get text "h1"                  # assert the exact landing state
agent-browser screenshot                     # capture significant states
```

Prefer **semantic locators** (`find role`, `find text`, `find label`,
`find testid`) over CSS/ID selectors. Semantic locators survive refactors and
match how a user perceives the page; brittle selectors turn a passing test into
a false failure on the next styling change.

### 4. Test the states everyone forgets

On every feature, cover these — not just the happy path. Each has an
`agent-browser` recipe in [references/state-recipes.md](references/state-recipes.md).

| State | What to verify | How |
|-------|----------------|-----|
| **Happy path** | Flow completes, correct end state | Walk it, assert final text/URL |
| **Empty** | No-data view is intentional, not a crash | Use an empty account/filter; read body text |
| **Loading** | A spinner appears and then *resolves* | Screenshot immediately after navigate |
| **Error** | A failed request shows a real message | `network route ... --body` an error, reload |
| **Unauthorized** | Protected view blocks/ redirects | Hit it with no/expired auth |
| **Offline / network failure** | App degrades, doesn't hang | `set offline on`, retry the action |

A spinner that never disappears, an empty list that renders blank, or a failed
request that shows nothing are all user-facing bugs — and all invisible if you
only test the happy path.

### 5. Verify persistence

After any create/update/delete, reload and confirm the change is still there.

```bash
agent-browser find role button click --name "Save"
agent-browser wait --text "Saved"
agent-browser reload
agent-browser wait --load networkidle
agent-browser get text "..."                 # the change must still be present
```

### 6. Report

Produce a test plan (before) and an execution report (after) using the
templates and result framework in
[references/report-format.md](references/report-format.md).

## Result Framework

Every test case resolves to exactly one:

- **PASS** — verified working in the browser.
- **FAIL** — verified broken; file a bug with repro steps and severity.
- **SKIP** — not run, with a stated reason (e.g. loading state too fast to capture).
- **BLOCKED** — couldn't run because an earlier bug prevents reaching it.

Bug severity: **P1** silent failure / data loss / crash · **P2** degraded UX /
broken-but-recoverable · **P3** cosmetic / minor.

## Bug Reproduction & Verification

To reproduce a reported bug, reduce it to the **shortest deterministic sequence**
of `agent-browser` commands that shows the wrong behavior, with the exact
observed-vs-expected difference. To verify a fix, run that same sequence and
confirm the expected behavior now appears — and add the case to the regression
set so it can't silently come back.

## Decision Heuristics

- **Unsure what to test?** What does the user see in each state — empty, loading,
  error, success? That is the minimum surface.
- **A selector keeps breaking on refactors?** Switch to a semantic locator.
- **A loading state is too fast to capture?** It is not isolated — flag the
  component, don't silently PASS.
- **Something looks right but you're not certain?** `get text` the exact value
  and assert it.
- **A mutation seems to work?** Reload and check again before calling it PASS.
- **Tempted to PASS from reading behavior, not seeing it?** Don't. Go observe it.

## Reference Files

- [references/state-recipes.md](references/state-recipes.md) — copy-paste
  `agent-browser` recipes for each state (empty, loading, error, unauthorized,
  offline, modals, responsive).
- [references/report-format.md](references/report-format.md) — test plan and
  execution report templates, result framework, bug format.

## Installation

```bash
npx skills add vercel-labs/agent-skills --skill web-qa-testing
```

This skill requires [`agent-browser`](https://github.com/vercel-labs/agent-browser):

```bash
npm install -g agent-browser
agent-browser install
```
