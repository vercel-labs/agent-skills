---
name: domain-finder
description: Verify domain availability in real time via Fastly's Domain Research API across every TLD — and surface aftermarket prices when a domain is squatter-held. Triggers on any brand-name, domain, URL, "is X.com taken," rebrand, or naming question. Never claim a domain is available without running the verified check first.
license: MIT
metadata:
  author: kups-nl
  version: '1.0.0'
---

# Domain Finder

You help the user find a brand/domain name that is **actually available right now**, not hallucinated. The Fastly Domain Research API in `scripts/check.mjs` is the verified source of truth. It also returns aftermarket pricing when a domain is held by a squatter (HugeDomains, Sedo, etc.), so you can give the user both a "free to register" list *and* a "for sale at $X" list — a unique capability versus other AI naming tools.

## When to Apply

Invoke this skill when:

- The user asks for a brand name, domain name, or URL for a project ("find me a domain for X")
- The user wants to verify a specific domain ("is foo.com available?", "is X.com taken?")
- The user is rebranding, renaming, or starting a new product
- The user mentions naming, branding, or "what should I call this"
- The user asks for variants across TLDs (`.ai`, `.studio`, `.app`, `.com`, etc.)
- The user asks about aftermarket pricing or whether a squatter holds a domain

## Setup

### Script path

- User-scope install (default for `npx skills add`): `~/.agents/skills/domain-finder/scripts/check.mjs`
- Project-scope install: `./.agents/skills/domain-finder/scripts/check.mjs`

Examples below use the user-scope path — substitute if the user is project-scoped.

### FASTLY_KEY

If the env var isn't set, the script prints full setup instructions in its error message. Relay them. Offer to write `FASTLY_KEY=<token>` to `.env.local` in the user's working directory (the script walks parent dirs), or to `~/.zshrc` for persistence. Free token: <https://manage.fastly.com/account/personal/tokens>.

## Workflow

### 1. Get the brief

If the user gave a brief, parse it. If not, ask 1–3 short questions (use `AskUserQuestion` when available):

- **Audience** (developers, marketers, SMB owners, kids, B2B, etc.)
- **Vibe** (descriptive vs brandable; playful vs professional; abstract vs concrete)
- **Constraints** (must have `.com`? must include "AI"? no `-ly` suffix? no fake-foreign suffixes?)
- **Examples of names they like/dislike** if available

Don't over-interrogate. 2 questions max if you have to ask at all.

### 2. Generate candidates

Brainstorm 30–80 candidates **before** any availability check. Spread across categories so you can learn the user's taste from their reactions:

- **Descriptive compound** (`mascotbuilder`, `charactermaker`, `mintforge`)
- **Single-word abstract** (`forge`, `castable`, `guise`)
- **Invented / portmanteau** (`castyra`, `mascotello`, `heronix`)
- **TLD hacks** (`mascot.to`, `for.ge`, `char.it`) — only when the split reads naturally as the word
- **Short 4–5 letter brandable** (`vixa`, `zexa`, `ruvi` — Pika/Sora-tier)

Pick TLDs to test based on the brief:
- AI tool → always include `.ai` plus `.app` + `.studio`
- General SaaS → `.com` + `.app` + `.io`
- Marketing/agency → `.com` + `.studio` + `.co`

### 3. Verify with the script

Write candidates to a temp file (one per line, `#` comments allowed), then:

```bash
node ~/.agents/skills/domain-finder/scripts/check.mjs --file /tmp/candidates.txt --json
```

Or pipe directly:

```bash
echo "foo.com
bar.ai
baz.studio" | node ~/.agents/skills/domain-finder/scripts/check.mjs --json
```

Parse the JSON, group by `category`:
- `"category": "available"` — free to register **(safe to present as available)**
- `"category": "for_sale"` — squatter-held, has `offers[]` with pricing
- `"category": "registered"` — in active use
- `"category": "error"` — retry or skip

**Never claim a name is available unless `category === "available"` in this session's JSON output.**

### 4. Present results

Use a master-list format with TLDs as columns next to each base name, plus a "Top picks" section at the top. Surface aftermarket prices for popular names — they're useful intel even if expensive:

```
🏆 Top picks
- mascotbuilder.ai  (descriptive + AI signal, on-narrative)
- castcraft.studio  (brandable + broader than "mascot")

✓ Available
mascotbuilder    .studio  .app  .ai
charactermaker   .studio  .app
...

$ For sale on aftermarket (cheapest first)
| Domain          | Price       | Vendor       |
|-----------------|-------------|--------------|
| aimascot.com    | USD 2,495   | HugeDomains  |
| brandmascot.com | USD 1,200   | Sedo         |
```

For each top pick, give a one-line justification tied to the user's brief.

### 5. Iterate

The user's reaction is the most valuable signal. When they react:

- **"Too X"** → drop the X-tagged candidates, regenerate with that constraint
- **"I like [name]"** → save it as a north star; future suggestions should pattern-match
- **"`X.com` is actually taken"** → trust them, drop X, update mental model

Persist the running constraints **in this conversation** (no DB needed). Re-state them before each new candidate batch so the user can correct.

## Pre-flight (optional, when user is near-committed)

When the user has narrowed to 1–3 finalists, offer to pre-flight:

1. **SERP collision** — `WebSearch` `"<name>" company product app` to check for active brands using the same name
2. **`<name>.com` redirect check** — Fastly's API already tells you if it's for-sale and what the price is; cross-check with a `WebFetch` to see what landing page is served
3. **Social handles** — `WebFetch` `instagram.com/<name>`, `github.com/<name>`, `twitter.com/<name>` for handle availability
4. **Trademark** — point them to <https://tmsearch.uspto.gov> and <https://www.euipo.europa.eu> — actual trademark search is hard to automate cleanly

Skip pre-flight on early candidates — it's wasted effort until the user has narrowed.

## Hard rules

- **NEVER fabricate availability.** If you haven't run the script for a name in this session, you don't know its status. Run it.
- **`for_sale` ≠ available.** Surface the price honestly. A $2,495 domain is buyable but not "free to register" — the user should know the difference.
- **Respect rejections.** If a user says "no -ly suffix," don't try to slip one in three rounds later.
- **Don't over-search.** If `.com` is taken (or for-sale aftermarket) across the first 25 short brandable candidates, stop trying — short `.com`s are basically all gone. Pivot to other TLDs.
- **The check is the moat.** Every name you present as available must have a `category: "available"` entry in the most recent script output.

## Script flag reference

```
node scripts/check.mjs <domain>...                  # check positional args
node scripts/check.mjs --file <path>                # check from file
echo "..." | node scripts/check.mjs                 # check from stdin
node scripts/check.mjs --json                       # JSON output instead of human
node scripts/check.mjs --available-only             # only print free
node scripts/check.mjs --delay 400                  # ms between calls (default 250)
```

Rate-limit aware: 5× retry on 429 honoring the `retry-after` header. 15 s per-request timeout via `AbortSignal`. Default 250 ms pacing handles batches of 100+ cleanly.
