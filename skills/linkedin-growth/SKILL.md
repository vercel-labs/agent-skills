---
name: linkedin-growth
description: Two-phase LinkedIn lead pipeline driven by linkedin-cli. Phase A imports leads from a search URL or filters, qualifies them against a configurable ICP via sub-agent, and stores them in a local SQLite database with round-robin assignment across one or more LinkedIn accounts. Phase B runs on a schedule per account — sends connection invites up to a daily limit and withdraws stale pending requests. Use when the user wants to grow their network from LinkedIn searches, manage outgoing invites at scale, ask status questions (counts, conversion, pending older than N days, last imports), pause/resume an account, change ICP, or install the recurring scheduler.
---

# LinkedIn Growth Skill

This skill turns a Sales Navigator (or regular) search into a managed pipeline:
**search → qualify (you, via sub-agent) → store → invite on schedule → check pending → withdraw stale**.

All state lives in a local SQLite database. Every LinkedIn action goes through
`linkedin-cli` (the `linkedin` binary). You orchestrate via the Node scripts
under `scripts/`.

## Vocabulary

| Term | Meaning |
|------|---------|
| **Account** | A LinkedIn account registered in `linkedin-cli` AND added to this skill's DB. The DB stores per-account policy (`daily_invite_limit`, `active_start`/`active_end` hours, `max_pending_days`, `paused`). |
| **Lead** | A qualified person row in `leads`. PK is `hashed_url` (Sales Nav hashed URL for `nv` imports, or `publicUrl` for `st` imports). Has exactly one `owner_account`. |
| **List** | A free-text `list_name` attached at import time (e.g. "VP of Sales TOP 100"). Used for filtering and conversion analytics. |
| **Batch** | A row in `import_batches`. Created by `import.mjs prepare`; transitions `pending_qualification → committed | aborted`. |
| **Status** | A lead's lifecycle state: `not_connected → pending → (connected | exhausted | error)`. `not_connected` means ready for an invite from `owner_account` (could be the 1st attempt or a retry under a different account). `connected` = success (terminal). `exhausted` = tried up to `max_connect_attempts` accounts, none accepted (terminal). `error` = an invite failed technically (manual reset). |
| **Retry policy** | Global `max_connect_attempts` setting. When an account's attempt fails (we withdrew a stale pending, OR the person declined/expired), the lead is reassigned to another untried account and set back to `not_connected` — until `max_connect_attempts` distinct accounts have tried, then it becomes `exhausted`. `1` = no retry (default); `all` = try every active account. |
| **Phase A** | Import — runs only when the user triggers it. Includes the LLM step (you, via sub-agent). |
| **Phase B** | Network maintenance — `network-invite` + `network-pending`. Runs on a schedule. NEVER calls an LLM. |

## First-run setup

**1. Verify Node ≥ 20:** `node --version`.
If missing — print the OS-specific install command and stop:
- macOS: `brew install node`
- Linux: `apt install nodejs` / `dnf install nodejs` / etc., or nvm
- Windows: `winget install OpenJS.NodeJS.LTS`

**2. From this skill's directory, run:**

```bash
node scripts/doctor.mjs --json
```

If the output is `Cannot find module 'better-sqlite3'`:

```bash
npm install --omit=dev
```

Then re-run doctor. (Alternative: `node scripts/doctor.mjs --fix` does this automatically.)

**3. For each FAIL in the doctor output, apply the remediation:**

| Check name | Remediation |
|------------|-------------|
| `linkedin-cli` | `npm install -g @linkedapi/linkedin-cli` |
| `cli-accounts` | Ask the user for their Linked API Token and Identification Token (link: https://app.linkedapi.io), then `linkedin setup --linked-api-token=<a> --identification-token=<b>`. Repeat per LinkedIn account they want connected. |
| `db` | Auto-fixed by any script on first invocation, or explicitly: `node scripts/db.mjs init` |
| `db-accounts` | Run `linkedin account list` (prints a table; the `*` marks the active account) and register each one here: `node scripts/account.mjs add --name <short-name> --cli-account "<exact name from linkedin account list>"`. The short name is what every other command takes; the cli-account is the mapping. |
| `scheduler` | Should pass automatically. On headless Linux without systemd-user, doctor falls back to `cron`. |

**4. Re-run `node scripts/doctor.mjs --json` until `"ok": true`.**

**5. Set the connection pace — ask once, apply to all accounts.** Ask the user a single
question (not per account): "By default each account sends at most one connection request
every 15 minutes — keep 15, or change it?". Apply their answer to every account via
`--min-invite-interval <N>` (either pass it on each `account.mjs add`, or
`account.mjs update --name <acct> --min-invite-interval <N>` for all afterward). Default is
15. Let the user know they can fine-tune it per account later just by asking (e.g. "make
kiril one every 30 minutes") — it is a per-account setting, this question just sets a common
value for everyone.

**6. Set the retry policy.** Ask the user: "If someone doesn't accept the request, should
we try connecting from another account? (no / a specific number of accounts / all of them)".
Then:

```bash
node scripts/settings.mjs set max_connect_attempts 1      # no retry (default)
node scripts/settings.mjs set max_connect_attempts 2      # original + 1 more
node scripts/settings.mjs set max_connect_attempts all    # every account
```

**7. Enable the background scheduler (only after at least one account is registered):**

```bash
node scripts/schedule.mjs install
```

This installs one platform-native background task that keeps the pipeline running
on its own. When talking to the user, describe it as "the pipeline now runs in the
background and sends invites during each account's active hours" — do not expose the
scheduler's internal wake-up frequency (the tick) or other plumbing. (The invite *pace*
from step 5 — "one connect every N minutes" — is a real user-facing setting and fine to
discuss; it's the tick's 5-minute heartbeat that stays hidden.) See the **Phase B** and
**Scheduler** sections below for how it actually works.

**8. Tell the user the next step and offer to do it.** Setup alone sends nothing — the
pipeline is empty until leads are imported. End onboarding with a concrete call to action,
e.g.: "You're all set. To start, give me a LinkedIn or Sales Navigator search URL (or
search filters) and a name for the list, and I'll import and qualify your first batch of
leads." If the user provides one, proceed straight into **Phase A** below. Do not end the
setup conversation without this prompt.

## Phase A — Importing leads (interactive)

Triggered by the user via wording like:
- "import leads from this search ..."
- "add leads from this Sales Navigator URL"
- "add a list called 'X' from this search"

### Step 1 — Prepare

**Always ask the user for a limit first.** Before running `prepare`, ask "how many of the
found leads should I take?" — the user gives a number, or says "max" for the maximum. The
maximum depends on the search type (these are the Linked API / LinkedIn caps):
- Sales Navigator (`nv`): **2500**
- standard search (`st`): **1000**

`--limit` is **required**; `prepare` errors if it is missing. Pass `--limit max` (or `all`)
for the cap, or a number (clamped to the cap, with `limit_capped_to_max: true` reported).

```bash
node scripts/import.mjs prepare \
  --searcher <db-account-name> \
  --list "<list name>" \
  --limit <N|max> \         # REQUIRED — ask the user; 'max' = 2500 (nv) / 1000 (st)
  [--type nv|st]            # default nv
  [--search-url "<url>"]    # Sales Nav or LinkedIn search URL
  [--term ... --position ... --locations ... --industries ...]
```

Auto-detect: if the URL contains `/sales/`, pass `--type nv`; otherwise `--type st`.
Either `--search-url` or filter flags must be provided.

The script:
1. Runs the LinkedIn search via `linkedin-cli` (workflow run for URL-based, native CLI for filters)
2. Normalizes results
3. Dedupes against existing rows in `leads` (skipped count is reported)
4. Writes the new candidates to `<data_dir>/tmp/qualify-<batch-id>.candidates.json`
5. Creates an `import_batches` row in state `pending_qualification`
6. Returns the batch id + the candidate file path + the expected result file path + the path to the qualification prompt

### Step 2 — Qualify (YOU, against the user's ICP)

Qualification is filtering candidates against the user's **ICP** (Ideal Customer Profile) —
their definition of who is a good lead and who to filter out. The ICP is user-owned and
**must come from the user**, never from a hardcoded list. It is stored in the
`icp_definition` setting and persists across imports.

**a. Make sure there is an ICP.** `prepare`'s output includes `icp_configured` and the
current `icp_definition`.
- If `icp_configured` is **false**: interview the user before qualifying. Ask concrete
  questions — which roles/seniority to target, which industries/company types fit, company
  size/stage if relevant, locations to include or exclude, and any hard exclusions
  (competitors, students, specific titles). Summarize what you heard back to them, then save
  it straight into the database via stdin (no stray files):
  ```bash
  node scripts/settings.mjs set icp_definition --stdin <<'ICP'
  <the agreed ICP text>
  ICP
  ```
- If `icp_configured` is **true**: show the user the current ICP in plain language and ask
  whether to use it as-is or tweak it for this list. If they tweak it, re-save it the same way.

**b. Qualify each candidate.** Read the candidate file (JSON array of
`{hashed_url, public_url, full_name, position, location}`) and the qualification contract at
`config/qualification-prompt.md`. Judge every candidate against the ICP. For more than ~25
candidates, chunk the work and delegate each chunk to a sub-agent (Task tool in Claude Code,
or the equivalent in other hosts), passing the ICP + the contract + the chunk. Each must
return `[{hashed_url, suitable, reasoning}]` covering EVERY lead, preserving `hashed_url`,
where `reasoning` cites the actual ICP criterion that drove the decision.

**Use a cheap, fast model for the qualification sub-agents.** This is a bounded
classification task (role + location vs ICP → boolean + one-line reason), not deep
reasoning — so the heaviest model is a waste of money at lead volume. In Claude Code, spawn
the qualification sub-agents with `model: "haiku"` (the Task tool's `model` parameter); in
other hosts pick their equivalent small/fast model. Keep the orchestration, the ICP
interview, and the final report on the main model — only the per-chunk classification goes to
the cheap tier. If the ICP is unusually nuanced and you see many borderline calls, raise the
tier for that import. The stored per-lead `reasoning` lets you spot-check cheaply.

Concatenate all results and write them to the expected result file path from `prepare`.

(Non-agentic context: the user can write the result file by hand or with any model; nothing
in the skill enforces a specific provider.)

### Step 3 — Commit

```bash
node scripts/import.mjs commit --batch <batch-id> --results <result-file>
```

The script:
1. Reads results, looks up candidates by `hashed_url`
2. For each `suitable: true`: round-robin assigns `owner_account` from active (non-paused) accounts in alphabetical order, starting after the last-assigned account (cursor persists across imports). Inserts the lead with `status='not_connected'`.
3. Updates the batch to `state='committed'` with stats
4. Returns counts: `suitable`, `unsuitable`, `assigned`, `skippedExisting`, `skippedMissing`

**After committing, report the decision transparently** so the user understands the filter:
state how many were kept vs filtered, and give a few concrete sample reasons from both sides
(e.g. "kept: Head of Sales at a B2B SaaS — matches target role; filtered: Software Engineer —
not a targeted role"). The per-lead `reasoning` is stored on each lead and is also queryable
later via `node scripts/lead.mjs show <id>` or `query.mjs`.

### Other batch commands

```bash
node scripts/import.mjs list [--state pending_qualification|committed|aborted]
node scripts/import.mjs show --batch <id>
node scripts/import.mjs abort --batch <id>     # cancel a pending_qualification batch
```

## Phase B — Network maintenance (scheduled, distributed)

Phase B is **not** a single daily batch. The background scheduler does small,
resumable units of work spread across each account's active hours. Invites and
pending checks are **decoupled** — they run on their own cadence.

On each wake-up, for every active account that is **within its active window**
(`active_start`–`active_end`, local time):

1. **Invites** (write, rate-sensitive): send **one** invite if both
   - the daily quota (`daily_invite_limit`) is not yet reached, and
   - at least `min_invite_interval_minutes` have passed since the last invite.

   `min_invite_interval_minutes` is the explicit "no more than one connect every N
   minutes" control (default 15). The effective daily ceiling is the tighter of the
   daily limit and what the interval allows inside the window.

2. **Pending checks** (mostly reads, low-risk): process up to `pending_batch_size`
   due pending leads (status check, and withdraw if still pending past
   `max_pending_days`). This runs **independently of the invite decision** and is
   **not** throttled by the invite interval, so a backlog of stale pending requests
   drains quickly instead of one-per-wake-up.

Both can happen in the same wake-up.

Why this shape matters (and what to tell the user if they ask):
- Each LinkedIn operation is written to the DB immediately. If the machine sleeps or
  a run is killed mid-operation, the next wake-up just continues from the current DB
  state — **there is no batch to resume and nothing to roll back**.
- Daily quota is recomputed from the `runs` table every time (bounded to the local
  calendar day), so it stays correct across interruptions and restarts.
- Invites are paced by an explicit interval; pending checks are not — a read is cheap,
  a write is rate-limited.

You normally never run Phase B by hand. For testing or a deliberate one-off "drain
now" (ignores pacing, respects the daily quota and active-window checks inside the
scripts only loosely — use with care):

```bash
node scripts/network-invite.mjs --account <name> --limit 1     # exactly one invite
node scripts/network-pending.mjs --account <name> --limit 1    # exactly one pending check
node scripts/network-run.mjs --account <name>                  # full invite + pending sweep now
```

### Invite outcomes

For each `not_connected` lead within the day's remaining budget, runs the workflow:

```json
{
  "actionType": "st.openPersonPage",
  "personUrl": "...",
  "basicInfo": true,
  "then": { "actionType": "st.sendConnectionRequest" }
}
```

Result classification:
- `data.then.success === true` → `status='pending'`, `sent_at=now`, `basic_info_json` stored
- `data.then.error.type` includes `alreadyPending` → `status='pending'`
- `data.then.error.type` includes `alreadyConnected` → `status='connected'`
- `data.then.error.type` signals an account-level limit on the action category (e.g.
  `limitExceeded`, a rate limit) → the lead stays `not_connected` (NOT a per-lead error) and
  this account's run backs off (stops for the cycle); the lead is retried on a later wake-up.
- `data.then.error.type` is `noteLimitExceeded` → the account has reached LinkedIn's
  personalized invitation-note limit. Treat it as account-level gating, not a per-lead error:
  leave the lead `not_connected`, back off, and retry later or send future invites without notes.
- `data.then.error.type` is `requestNotAllowed` ("LinkedIn has restricted sending a connection
  request") → ambiguous, disambiguated by pattern: a **streak** (2+ in a row with no successful
  invite between) = the account's weekly invite limit → leave `not_connected` and back off (not
  the lead's fault); an **isolated** hit = the person restricts invites → counted against the
  lead, and after `RESTRICTED_LEAD_ATTEMPTS` (2) isolated hits the lead is closed as `exhausted`
  so it never hangs. Never burns a whole queue on a weekly-limit burst.
- anything else → `status='error'`, `error_type`/`error_message` stored

`linkedin-cli` exit code 4 (account issue) or 6 (rate limit) aborts the whole
run immediately — no further leads touched. Other non-zero exits mark the lead
as error and continue.

### Pending outcomes (with cross-account retry)

For each `pending` lead where `sent_at` is older than `max_pending_days`:

1. `linkedin connection status <public_url>`
2. Branch:
   - `connected` → `status='connected'` (terminal success)
   - `notConnected` (declined / expired) → **failed attempt** → apply retry policy
   - `pending` (still) → `linkedin connection withdraw <public_url>` → on success this is a
     **failed attempt** → apply retry policy
   - other → leave as `pending`, log run as error

**Retry policy (`resolveFailedAttempt`).** On a failed attempt, look up how many distinct
accounts have already invited this lead (from the `runs` table). If that count is below
`max_connect_attempts` (global setting) AND there is an active account that has NOT tried
this lead yet, reassign the lead to the least-loaded such account and set it back to
`not_connected` (it re-enters the invite flow under the new account). Otherwise mark it
`exhausted` (terminal). With the default `max_connect_attempts = 1`, every failed attempt
goes straight to `exhausted` (no retry).

## Answering arbitrary status questions

The user will ask things like "how many pending on <account>?", "imports last 7 days?",
"which lists convert best?", "why is lead X in error?". Substitute the user's real
account/list names. Use this decision tree:

1. **Try the high-level dashboard first:**

   ```bash
   node scripts/status.mjs --json                       # all accounts
   node scripts/status.mjs --account <account> --json
   node scripts/status.mjs --since 7d --json            # adds imported_since per account
   ```

   Output covers: paused, daily_limit, sent_today, remaining_today, status counts,
   recent_errors, imported_since.

2. **For lead-level lookups:**

   ```bash
   node scripts/lead.mjs list --account <account> --status pending --limit 100
   node scripts/lead.mjs list --list "<list name>"
   node scripts/lead.mjs show <hashed-url|public-url|"Full Name">
   ```

   `lead.mjs show` returns the lead + the last 25 runs (action, started_at, success, error_message).

3. **For anything else — write SQL via `query.mjs`:**

   First refresh your schema knowledge if you don't have it cached:

   ```bash
   node scripts/schema.mjs --examples --json
   ```

   Then run:

   ```bash
   node scripts/query.mjs --sql "SELECT ... FROM leads WHERE ..." --json
   ```

   `query.mjs` opens the DB read-only and rejects any non-SELECT statement.
   For sanity-checking a complex query, append `--explain`.

### Schema quick-reference

```
accounts(name PK, cli_account, paused, daily_invite_limit, min_invite_interval_minutes,
         active_start, active_end, max_pending_days, pending_batch_size,
         last_action_at, created_at)

leads(hashed_url PK, public_url, full_name, position, location, list_name,
      reasoning, owner_account FK accounts.name, basic_info_json,
      status [not_connected|pending|connected|exhausted|error],
      sent_at, status_updated_at, error_type, error_message, created_at)

runs(id PK, lead_hashed_url FK leads.hashed_url, account, action
     [invite|check_status|withdraw], started_at, finished_at, success,
     raw_response_json, error_message)

import_batches(id PK, list_name, searcher_account, search_url, search_type,
               candidate_count, qualified_count, committed_count,
               skipped_existing_count, state, created_at, committed_at)

import_state(id=1 singleton, last_assigned_account)

settings(key PK, value)   -- global config, e.g. max_connect_attempts ('1' | 'N' | 'all')
```

All timestamps are SQLite `datetime('now')` strings in UTC.

## Retry policy (global settings)

```bash
node scripts/settings.mjs list
node scripts/settings.mjs get max_connect_attempts
node scripts/settings.mjs set max_connect_attempts 2      # try original + 1 more account
node scripts/settings.mjs set max_connect_attempts all    # try every active account
node scripts/settings.mjs set max_connect_attempts 1      # no retry (default)
```

`max_connect_attempts` is the number of DISTINCT accounts that may attempt one lead. When
a request goes unaccepted (withdrawn stale pending, or declined/expired), the lead is
handed to the least-loaded untried account until this many accounts have tried, then it is
`exhausted`. Frame it to the user as "if someone doesn't accept, try from N other accounts".

## Account management

`<account>` below is a placeholder — the user picks their own short name; it maps to
a real `linkedin-cli` account name (from `linkedin account list`). The skill ships
with no accounts and no predefined names.

```bash
node scripts/account.mjs list
node scripts/account.mjs add --name <account> --cli-account "<linkedin-cli account name>" \
  [--daily-invite-limit 35] [--min-invite-interval 15] \
  [--active-start 09:00] [--active-end 18:00] \
  [--max-pending-days 10] [--pending-batch-size 5]
node scripts/account.mjs update --name <account> --daily-invite-limit 25
node scripts/account.mjs update --name <account> --min-invite-interval 20   # one connect / 20 min
node scripts/account.mjs update --name <account> --active-start 10:00 --active-end 16:00
node scripts/account.mjs pause --name <account>        # scheduler + import skip this account
node scripts/account.mjs resume --name <account>
node scripts/account.mjs rename --name <account> --new-name <new-name>
node scripts/account.mjs remove --name <account> [--force]   # --force needed if leads exist
```

Per-account invite controls (all independent):
- `active_start`/`active_end` — **when** (daily hours, local time) invites go out.
- `min_invite_interval_minutes` — **how fast** (minimum gap between two invites,
  default 15). This is the direct "no more than one connect every N minutes" knob.
- `daily_invite_limit` — **how many** per day (hard cap).

`status.mjs` reports `effective_max_per_day` = the tighter of the daily limit and what
the interval allows inside the window. `pending_batch_size` controls how many stale
pending requests are checked per wake-up (independent of invites). When discussing with
the user, frame these as plain-language behavior ("invites go out 9am–6pm, at most one
every 15 minutes, up to 35 a day") — never in terms of the scheduler's wake-up frequency.

## ICP and the qualification contract

Two separate things:
- **The ICP** (who to keep / filter) is user-owned data. It lives in the local **database**
  (the `settings` table, key `icp_definition`) — NOT in any file. View it with
  `node scripts/settings.mjs get icp_definition`. Change it by piping the text via stdin:
  ```bash
  node scripts/settings.mjs set icp_definition --stdin <<'ICP'
  <the ICP text, multi-line, as many lines as needed>
  ICP
  ```
  (For a short one-liner, `settings.mjs set icp_definition '<text>'` also works.) Do NOT write
  the ICP to a stray file in the repo or some tmp folder and load it from there — the file is
  not where it lives, and it litters the workspace. Capture the ICP by asking the user; never
  hardcode one. Changes take effect on the next import.
- **The qualification contract** at `config/qualification-prompt.md` is the product-agnostic
  scaffolding (how to judge + the JSON output format). You normally don't change it; it
  references the user's ICP rather than containing one.

## Scheduler

The scheduler is one OS-native background task (launchd / systemd-user / cron /
schtasks depending on platform) that wakes the pipeline periodically. The wake-up
frequency is an internal detail — the user-facing behavior is set by each account's
active hours and daily limit. Do not surface intervals to the user.

```bash
node scripts/schedule.mjs detect                # reports launchd | systemd-user | cron | schtasks
node scripts/schedule.mjs status
node scripts/schedule.mjs install [--interval-minutes 5]   # interval is internal; default is fine
node scripts/schedule.mjs uninstall
```

To inspect what the background runs are doing, read `<data_dir>/logs/<account>-<YYYY-MM-DD>.log`.

## Common pitfalls (read before acting)

- **Two LinkedIn accounts in the same DB with the same `cli_account` mapping** — undefined behavior; reject if the user tries it. Use `account.mjs list` to verify.
- **Lead PK across search types** — Sales Nav (`nv`) returns hashed URLs; regular (`st`) returns public URLs. The same person from both search types becomes two rows. If users mix, mention it explicitly.
- **Interrupted mid-operation** — each scheduler wake-up does at most one invite/check, persisted immediately. A sleep/kill loses at most that one in-flight operation; the next wake-up continues from DB state. There is no batch to resume. Leads not yet processed stay `not_connected`/`pending` and are picked up later.
- **The `connected` status on invite** — only set when LinkedIn reports `alreadyConnected` at invite time (the person was already a 1st-degree connection). Real new connections appear via `network-pending` (where `connection status` returns `connected`).
- **`error` status is terminal until reset** — `lead.mjs reset <hashed-url>` moves it back to `not_connected`. The auto-pipeline does not retry errored leads on its own.
- **Renaming an account** — leads' `owner_account` is ON UPDATE CASCADE; `rename` is safe. `remove` without `--force` refuses when leads exist; with `--force` they are orphaned (status queries will still include them but no scheduled run touches them).
- **`schedule.mjs install` without registered accounts** — harmless, but nothing happens until accounts exist. Install order: doctor → add accounts → install scheduler.
- **Daily quota boundary** — the per-day invite count resets at **local** midnight, not UTC. Quotas and `sent_today` are computed against the local calendar day.

## Idempotency

- `db.mjs init`, `doctor.mjs`, `schema.mjs`, `status.mjs`, `lead.mjs show/list`, `query.mjs`, `schedule.mjs status` — all safe to call multiple times.
- `import.mjs prepare` creates a new batch every time — call once per intended import.
- `import.mjs commit` refuses to run twice on the same batch.
- `schedule.mjs install` overwrites any existing installation of the same service id.
