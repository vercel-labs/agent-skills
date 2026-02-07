# Checklist — Regression Fix Workflow

Use this checklist when fixing a bug to ensure the fix includes a proper
regression test. Derived from
[taxonomy-test-tiers.md](../../references/taxonomy-test-tiers.md) and
[methodology-red-green-refactor.md](../../references/methodology-red-green-refactor.md).

---

## Before Fixing

- [ ] Understand the bug's **mechanism**: what specifically goes wrong and at
      which layer.
- [ ] Identify the **lowest test tier** that reproduces the bug's mechanism:
  - Can a unit test reproduce it? → Unit test.
  - Does it require a real boundary (DB, HTTP, queue)? → Boundary integration test.
  - Does it require multiple units / a feature slice? → Functional test.
  - Does it only manifest in a full-stack scenario? → E2E test (last resort).

## Write the Regression Test (RED)

- [ ] Write a test that **would have failed before the fix**.
- [ ] Name it with a regression tag:
      `[regression] ISSUE-ID: description of what broke`.
- [ ] Place it at the chosen tier (lowest that reproduces the mechanism).
- [ ] Run the test and confirm it **fails** for the expected reason.

## Fix the Bug (GREEN)

- [ ] Write the minimal fix that makes the regression test pass.
- [ ] Confirm all existing tests still pass.
- [ ] Confirm test output is pristine (no new warnings).

## Refactor (if needed)

- [ ] Clean up the fix if needed, keeping all tests green.

## Anti-Pattern Check

- [ ] The regression test is NOT at a higher tier than necessary.
      ("We fixed it but only added a giant E2E test" is an anti-pattern.)
- [ ] The regression test is NOT in a dedicated "regression" directory.
      (Regression is a tag/intent, not a location.)
- [ ] The regression test would have caught this bug if it existed before.
