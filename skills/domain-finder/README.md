# domain-finder

A Claude Code skill that finds available domain names with **real-time verified availability** via Fastly's Domain Research API. No more "AI suggested foo.com, but it's actually taken." Also surfaces **aftermarket pricing** when a domain is squatter-held — so you know whether `aimascot.com` is free, or held by HugeDomains for $2,495.

Works inside Claude Code as a skill, or standalone as a Node CLI.

## Install (as a Claude Code skill)

```bash
npx skills add kups-nl/domain-finder
```

The interactive installer asks for a **scope** (Project or User) and which **agents** to install for. Files land in `<scope>/.agents/skills/domain-finder/` — the canonical universal path that skill-aware agents read from (Claude Code, Cursor, Codex, Amp, Cline, OpenCode, Warp, +others).

| Scope     | Install path                                | When to pick                              |
|-----------|---------------------------------------------|-------------------------------------------|
| **User**  | `~/.agents/skills/domain-finder/`           | Always available, in every project        |
| **Project** | `<your-project>/.agents/skills/domain-finder/` | Scoped to one codebase                 |

## One-time setup

### 1. Get a Fastly API token

1. Go to <https://manage.fastly.com/account/personal/tokens>
2. Create a token (the default read scope is enough)
3. Copy it

The free tier covers the Domain Research API at a generous rate limit.

### 2. Set the env var

Either export globally (recommended):

```bash
echo 'export FASTLY_KEY=<your-token>' >> ~/.zshrc
source ~/.zshrc
```

Or drop it in `.env.local` (or `.env`) in any project directory — the script walks up from `cwd` looking for it:

```
FASTLY_KEY=<your-token>
```

### 3. Verify

```bash
SCRIPT=$(ls ~/.agents/skills/domain-finder/scripts/check.mjs ./.agents/skills/domain-finder/scripts/check.mjs 2>/dev/null | head -1)
echo "google.com" | node "$SCRIPT"
```

Expected:

```
Checking 1 domain(s) via Fastly...
[1/1]    · registered google.com

0 available · 0 for sale · 1 registered · 0 errors
```

If you see `error: FASTLY_KEY not set` → env var didn't load. Re-run `source ~/.zshrc` or open a new terminal.

## Usage inside Claude Code

The skill activates automatically when Claude sees you asking for a brand/domain. Trigger phrases include:

- "find me a domain for X"
- "is foo.com available?"
- "I need a brand name for my new project"
- "what should I call this?"
- "rebrand from X to something else"

Claude then runs a brief discovery (audience, vibe, constraints), brainstorms 30–80 candidates, runs them through `scripts/check.mjs`, and presents grouped results with aftermarket pricing.

## Direct CLI use (without Claude)

```bash
# from file
node scripts/check.mjs --file candidates.txt

# from stdin
cat candidates.txt | node scripts/check.mjs

# inline
node scripts/check.mjs mascot.com mascot.ai mascot.studio

# JSON for scripting / agent parsing
node scripts/check.mjs --file in.txt --json --available-only > free.json
```

### Example output

```
$ echo -e "anthropic.com\nopenai.com\naimascot.com\nfreshlybaked123xyz.com" | node scripts/check.mjs

Checking 4 domain(s) via Fastly...
[1/4]    · registered anthropic.com
[2/4]    · registered openai.com
[3/4]    $ FOR_SALE   aimascot.com  USD 2,495 (HugeDomains)
[4/4]    ✓ AVAILABLE  freshlybaked123xyz.com

1 available · 1 for sale · 2 registered · 0 errors
```

## What you get back per domain

```json
{
  "domain": "aimascot.com",
  "status": "marketed priced active",
  "zone": "...",
  "tags": ["..."],
  "offers": [{ "price": 2495, "currency": "USD", "vendor": "HugeDomains" }],
  "category": "for_sale"
}
```

Four `category` values:

| Category     | Meaning                                                  |
|--------------|----------------------------------------------------------|
| `available`  | Free to register at any registrar                        |
| `for_sale`   | Squatter is selling, `offers[]` has the price            |
| `registered` | Active site, not for sale                                |
| `error`      | Transient HTTP/network issue or rate-limit (retry/skip)  |

## Why this beats WHOIS / TransIP / generic AI naming tools

- **No key signing, no IP whitelist** — just one HTTP header
- **Works for any TLD** — Fastly is a registry-data API, not a registrar
- **Includes aftermarket pricing** — you instantly know if `aimascot.com` is held by HugeDomains for $2,495, vs an active business
- **Rate-limit aware** — 250 ms pacing handles 100+ domain batches; 5× retry on 429 with `retry-after` honoring
- **No hallucinations** — the skill is built around the rule that nothing is presented as "available" without a verified API response

## CLI flag reference

```
node scripts/check.mjs <domain>...           # check positional args
node scripts/check.mjs --file <path>         # check from file (one per line, # comments OK)
echo "..." | node scripts/check.mjs          # check from stdin
node scripts/check.mjs --json                # JSON output instead of human-readable
node scripts/check.mjs --available-only      # only print free ones
node scripts/check.mjs --delay 400           # ms between calls (default 250)
```

## Known gotchas

- Fastly status strings are space-separated tag bags (e.g. `"marketed priced active"`). Use the `category` field in the output, don't parse `status` yourself.
- Rate limit: ~25 reqs/burst, then 429. Script handles this with backoff using the `retry-after` header.
- Some ccTLDs return ambiguous statuses due to limited registry visibility. Treat `unknown` as "verify at the registry directly."
- The free tier of the Fastly API is generous but not unlimited. Large batches (500+ checks/day) may exceed it.

## Agent portability

The Claude Code skill workflow uses `AskUserQuestion`, `WebSearch`, and `WebFetch` for the discovery and pre-flight steps — those are Claude-Code-specific. The core `scripts/check.mjs` script is plain Node ESM with no dependencies, so it works in any agent harness that can shell out, or as a regular CLI for humans.

## License

MIT — see [LICENSE](./LICENSE).
