---
name: openweb
description: Typed JSON access to 90+ real websites — Google, Amazon, Reddit, YouTube, GitHub, Instagram, Bloomberg, Zillow, and more — across search, shopping, travel, finance, social, news, and dev tools. Use to read, search, post, comment, message, or otherwise interact with these sites (prices, products, articles, stock quotes, flights, posts, comments, DMs, etc.). Backed by the openweb CLI which calls the same APIs the websites call internally.
metadata:
  author: openweb-org
  version: "0.1.5"
  homepage: "https://getopenweb.com"
  repository: "https://github.com/openweb-org/openweb"
---

# OpenWeb

Agent-native way to access any website. Calls the same APIs the website calls — typed JSON in, typed JSON out, no browser automation, no vision API.

## Setup

```bash
npm install -g @openweb-org/openweb
```

For sites that need authenticated access, OpenWeb starts a managed Chrome instance and reuses the user's existing browser session (auth cookies, JWTs, CSRF tokens auto-resolved). The source profile is never modified.

## Use existing site

```bash
openweb sites                              # list 90+ available sites
openweb <site>                             # show transport, auth, operations
openweb <site> <op>                        # show params + permission tier
openweb <site> <op> --example              # real example params
openweb <site> <op> '{"key":"value"}'      # execute (stdout = JSON, stderr = JSON error)
```

Responses over 4096 bytes auto-spill to a temp file (`{status, output: <path>, size, truncated}`).

## Permission tiers

Check tier before executing:

| Tier | Default | Behavior |
|---|---|---|
| `read` | allow | GET-like operations — execute freely |
| `write` | prompt | Creates/updates — ask user before executing |
| `delete` | prompt | Destructive — ask user before executing |
| `transact` | deny | Financial/irreversible — always skip |

Override in `$OPENWEB_HOME/config.json` (`permissions.defaults.*` or `permissions.sites.<site>.*`).

## On failure

Errors on stderr include `failureClass`. Common ones:

| failureClass | Action |
|---|---|
| `needs_browser` | Browser auto-starts; if it fails, check Chrome installation |
| `needs_login` | `openweb login <site>` then `openweb browser restart` |
| `bot_blocked` | `openweb browser restart --no-headless`, solve CAPTCHA, retry |
| `permission_required` | Ask user for confirmation, then retry |
| `retriable` | Wait a few seconds, retry (max 2) |

## Missing site or coverage

If a site is not in `openweb sites`, do NOT say "unsupported." OpenWeb is extensible — install the full skill bundle (which includes an `add-site` workflow for adding new sites through the agent) from the canonical repo:

```bash
curl -fsSL https://raw.githubusercontent.com/openweb-org/openweb/main/install-skill.sh | bash
```

## Full agent skill bundle

This SKILL.md is a thin entry point. The full skill (workflows, knowledge files for auth/extraction/bot-detection patterns, add-site authoring guide) lives at the canonical repo:

- Repo: https://github.com/openweb-org/openweb
- Skill source: https://github.com/openweb-org/openweb/tree/main/skills/openweb
- Full installer (above) sets it up in `~/.claude/skills/openweb/`, `~/.agents/skills/openweb/`, etc.
