---
description: Onboard the linkedin-growth pipeline — check prerequisites, connect LinkedIn accounts, register them, and install the scheduler.
---

Use the **linkedin-growth** skill. Walk me through first-run setup, doing as much as
possible yourself and only asking me for things you genuinely cannot obtain
(LinkedIn tokens, account names, preferred invite limits/times).

Follow the skill's "First-run setup" section end to end:

1. Verify Node ≥ 20. If missing, give me the exact install command for my OS and stop.
2. From the skill directory run `node scripts/doctor.mjs --json`. If dependencies are
   missing, run `npm install --omit=dev` and re-check.
3. For each failing check, apply the documented remediation:
   - install `linkedin-cli` if absent
   - if no LinkedIn accounts are connected, ask me for my Linked API Token and
     Identification Token (from app.linkedapi.io) and run `linkedin setup ...` per account
   - register each connected account into the DB with `node scripts/account.mjs add`,
     asking me for a short name, a daily invite limit, and the daily hours during which
     invites should go out (`--active-start` / `--active-end`, e.g. 09:00–18:00). If I
     have more than one account, suggest slightly different hours so they don't act at the
     exact same time.
4. Ask me ONCE about the pace between connection requests (not per account): "By default
   each account sends at most one connection request every 15 minutes — keep 15, or change
   it?". Apply my answer to ALL accounts via `--min-invite-interval <N>` (pass it on each
   `account.mjs add`, or `account.mjs update` them afterward). Tell me I can fine-tune this
   per account later just by asking — e.g. "make kiril send one every 30 minutes".
5. Re-run the doctor until `"ok": true`.
6. Ask me about the retry policy: "If someone doesn't accept the request, should we try
   connecting from another account?" — then set it with
   `node scripts/settings.mjs set max_connect_attempts <1|N|all>` (default 1 = no retry).
7. Once at least one account is registered, turn on the background scheduler with
   `node scripts/schedule.mjs install` and confirm with `node scripts/schedule.mjs status`.

Then summarize in plain language: which accounts are connected, how many invites per day
each sends, during which hours, and at what pace (one every N minutes), the retry policy, and
that the pipeline now runs in the background on its own. Do NOT mention internal scheduling
details (wake-up intervals, ticks). Do not send any invites during setup.

8. Optionally capture my ICP now so the first import is smooth. Ask who my ideal leads are
   and who to filter out — roles/seniority, industries/company types, company size/stage,
   locations to include/exclude, and any hard exclusions. Summarize it back, then save with
   `node scripts/settings.mjs set icp_definition --stdin` (pipe the agreed text in via a
   heredoc — it is stored in the database, not a file; do not leave stray ICP files around).
   If I'd rather decide later, skip this — the import flow will ask before qualifying.

**Finally — and this is required — give me the next step and offer to do it now.** Setup
alone imports nothing; the pipeline stays empty until leads are added. Say something like:
"To start filling the pipeline, send me a LinkedIn or Sales Navigator search URL (or search
filters) plus a name for the list, and I'll import and qualify your first batch." If I give
you one, continue straight into the import (the `/linkedin-growth-import` flow). Never end the setup
without offering this next step.
