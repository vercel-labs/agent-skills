# linkedin-growth

A LinkedIn lead pipeline skill for AI agents (Claude Code, Codex, Cursor, etc.).
Drops a single SQLite DB and a set of Node scripts that wrap
[`linkedin-cli`](https://www.npmjs.com/package/@linkedapi/linkedin-cli) into a
local, queryable lead pipeline.

## What it does

**Phase A — Import.** Triggered by the user. Searches LinkedIn (Sales Navigator or
regular) via `linkedin-cli`, hands candidates to your AI agent for qualification
against a configurable ICP prompt, dedupes, and inserts qualified leads with a
round-robin owner assignment across all registered accounts.

**Phase B — Network maintenance.** Runs on a recurring schedule per account.
Sends connection invites up to that account's daily limit, then checks pending
requests that are older than `max_pending_days` and either marks them connected
or withdraws them.

All state lives in a local SQLite database. No external services beyond
`linkedin-cli` and what it talks to.

## Install (humans)

1. Install Node.js ≥ 20.
2. Install `linkedin-cli`:
   ```bash
   npm install -g @linkedapi/linkedin-cli
   linkedin setup --linked-api-token=<token> --identification-token=<token>
   ```
   Repeat the second command per LinkedIn account you want to connect.
3. Place this `linkedin-growth/` folder into your AI agent's skills directory:
   - Claude Code (project): `<project>/.claude/skills/linkedin-growth/`
   - Claude Code (user): `~/.claude/skills/linkedin-growth/`
   - Codex / other: per your tool's skill discovery convention
4. Install local dependencies:
   ```bash
   cd <path-to-linkedin-growth>
   npm install --omit=dev
   ```
5. Verify:
   ```bash
   node scripts/doctor.mjs
   ```
6. Register each linkedin-cli account in this skill's DB (pick any short name you like;
   it maps to the exact name shown by `linkedin account list`):
   ```bash
   linkedin account list
   node scripts/account.mjs add --name <account> --cli-account "<name from the list>"
   ```
7. Turn on the background scheduler:
   ```bash
   node scripts/schedule.mjs install
   ```
   This runs the pipeline in the background and sends invites during each account's
   active hours, paced across the day.

After this, ask your agent: "import leads from this search URL: ..." or "how
many pending invites does &lt;account&gt; have?" — see `SKILL.md` for the full agent
playbook.

## Slash commands (optional, Claude Code)

Four guided entry points ship in `commands/`. Install them by copying or
symlinking into your commands directory:

```bash
# project-level
ln -s <path>/linkedin-growth/commands/linkedin-growth-*.md <project>/.claude/commands/
# or user-level
ln -s <path>/linkedin-growth/commands/linkedin-growth-*.md ~/.claude/commands/
```

| Command | What it does |
|---------|--------------|
| `/linkedin-growth-setup` | First-run onboarding: prerequisites, connect accounts, install scheduler |
| `/linkedin-growth-import` | Guided Phase A import (search → qualify → store) |
| `/linkedin-growth-status` | Dashboard + answers arbitrary status questions |
| `/linkedin-growth-config` | Change per-account limits/schedule/pause, or edit the ICP prompt |

These are conveniences — you can equally just talk to the agent in plain language.

## Data location

| Platform | DB / data dir |
|----------|------------------------|
| macOS / Linux | `~/.local/share/linkedapi-linkedin-growth/` |
| Windows | `%APPDATA%\linkedapi-linkedin-growth\` |

## Manual operations cheat sheet

```bash
node scripts/doctor.mjs --json                          # health check
node scripts/status.mjs --json                          # dashboard for all accounts
node scripts/status.mjs --account <account> --since 7d
node scripts/account.mjs list
node scripts/account.mjs pause --name <account>
node scripts/account.mjs update --name <account> --daily-invite-limit 20
node scripts/lead.mjs list --account <account> --status pending
node scripts/lead.mjs show "<Full Name>"
node scripts/lead.mjs reset <hashed-url>                # clears error
node scripts/query.mjs --sql "SELECT ... FROM leads ..."   # read-only SQL
node scripts/schema.mjs --examples                       # schema + example queries
node scripts/export.mjs --format csv --output leads.csv  # full dump
node scripts/schedule.mjs status
node scripts/schedule.mjs install
node scripts/schedule.mjs uninstall
```

## License

MIT — see [LICENSE](../LICENSE).
