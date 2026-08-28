---
description: Show the linkedin-growth dashboard — lead counts by status, invites left today, pending older than the threshold, recent errors, and recent imports.
argument-hint: "[account name] [question]"
---

Use the **linkedin-growth** skill to answer status questions. Arguments: $ARGUMENTS

1. Start with the dashboard: `node scripts/status.mjs --json` (add `--account <name>` if I
   named one, and `--since 7d`/`30d` if I asked about a time window).
2. Present it clearly per account: paused?, daily limit, invites sent today and remaining,
   counts by status (not_connected / pending / connected / withdrawn / error), and any
   recent errors.
3. If I asked something the dashboard does not directly answer (conversion rates, best
   lists, pending older than N days, per-list breakdowns), consult
   `node scripts/schema.mjs --examples --json` and then run a read-only query with
   `node scripts/query.mjs --sql "..." --json`.
4. For a specific lead, use `node scripts/lead.mjs show "<name|url>" --json` and explain
   its status and recent run history.

These reads hit the local database (fast, free). Only if I explicitly ask for the *live*
LinkedIn state should you call linkedin-cli directly.
