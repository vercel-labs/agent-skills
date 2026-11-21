---
description: Adjust linkedin-growth account settings — daily invite limit, schedule time, pending threshold, pause/resume — or edit the ICP qualification prompt.
argument-hint: "[account name] [what to change]"
---

Use the **linkedin-growth** skill to change configuration. Arguments: $ARGUMENTS

First show current state with `node scripts/account.mjs list --json`. Then apply what I
asked, confirming the exact change back to me:

- Daily invite limit (how many/day) → `node scripts/account.mjs update --name <acct> --daily-invite-limit <n>`
- Invite pace (no more than one connect every N min) → `node scripts/account.mjs update --name <acct> --min-invite-interval <n>`
- Active hours (when invites go out) → `node scripts/account.mjs update --name <acct> --active-start <HH:MM> --active-end <HH:MM>`
- Pending threshold (check after N days) → `node scripts/account.mjs update --name <acct> --max-pending-days <n>`
- Pending check batch per run → `node scripts/account.mjs update --name <acct> --pending-batch-size <n>`
- Retry policy — if someone doesn't accept, try from other accounts (global, not per-account)
  → `node scripts/settings.mjs set max_connect_attempts <1|N|all>` (1 = no retry)
- Temporarily stop an account → `node scripts/account.mjs pause --name <acct>`
  (and `resume` to re-enable). A paused account is skipped by both import round-robin and
  the scheduler.
- Rename / remove an account → `account.mjs rename` / `account.mjs remove`
- Change who we target (the ICP) → show me the current ICP with
  `node scripts/settings.mjs get icp_definition`, discuss the change, then save the new
  version with `node scripts/settings.mjs set icp_definition --stdin` (pipe via heredoc). It
  is stored in the database (not a file) and takes effect on the next import. The ICP is my
  own data, not a hardcoded list — don't leave stray ICP files around.

If I am vague, ask which account and which setting before changing anything. Never change
limits or schedules without telling me the before/after values.
