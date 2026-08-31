# APIClaw Analysis Skill

> Find winning Amazon products with 14 battle-tested selection strategies & 6-dimension risk assessment. Backed by 200M+ product database. Powered by [APIClaw API](https://apiclaw.io).

## What It Does

Gives AI agents the ability to perform real-time Amazon product research:

- 🔍 **Market Validation** — Category size, concentration, new product rate
- 🎯 **Product Selection** — 14 built-in filter presets (beginner, fast-movers, emerging, etc.)
- 📊 **Competitor Analysis** — Brand/seller landscape, Chinese seller cases
- ⚠️ **Risk Assessment** — 6-dimension risk matrix with compliance alerts
- 💰 **Pricing Strategy** — Price band analysis, profit estimation
- ✍️ **Listing Optimization** — Competitor listing analysis, copy generation, diagnosis
- 📈 **Daily Operations** — Market monitoring, alert signals

## Structure

```
apiclaw-analysis-skill/
├── SKILL.md                  # Main entry — intent routing, usage, evaluation criteria
├── references/
│   ├── reference.md            # API endpoints, fields, filters, scoring criteria
│   ├── scenarios-composite.md  # Comprehensive recommendations & Chinese seller cases
│   ├── scenarios-eval.md       # Product evaluation, risk, review analysis
│   ├── scenarios-pricing.md    # Pricing strategy, profit estimation, listing
│   ├── scenarios-ops.md        # Market monitoring, anomaly alerts
│   ├── scenarios-expand.md     # Expansion, trends, discontinuation
│   └── scenarios-listing.md   # Listing writing, optimization, diagnosis
└── scripts/
    └── apiclaw.py            # CLI script — 8 subcommands, 14 preset modes
```

## Installation

### Option 1: ClawHub (recommended for OpenClaw users)

```bash
npx clawhub install Amazon-analysis-skill
```

This installs the skill into `./skills/Amazon-analysis-skill/` under your current directory.

**For OpenClaw:** Run this command in your OpenClaw workspace directory (usually `~/.openclaw/workspace`). The skill will be automatically loaded in your next session — no extra setup needed.

**For other AI agents (Claude Code, etc.):** After install, point your agent to the `SKILL.md` file in the installed directory.

### Option 2: Manual Install

Clone this repo or download the files directly into your agent's skill directory.

## Setup

1. Get an API Key at [apiclaw.io/api-keys](https://apiclaw.io/api-keys) (format: `hms_live_xxx`)
2. Configure your key (choose one):
   - **Environment variable (recommended):** `export APICLAW_API_KEY='hms_live_xxx'`
   - **Config file:** Tell your AI agent your key — it saves to `config.json` automatically

## Script Commands

| Command | Description |
|---------|-------------|
| `categories` | Query Amazon category tree |
| `market` | Market-level aggregate data |
| `products` | Product search with filters (14 preset modes) |
| `competitors` | Competitor lookup by keyword/brand/ASIN |
| `product` | Real-time single ASIN details |
| `report` | Full market report (composite workflow) |
| `opportunity` | Product opportunity discovery (composite workflow) |
| `check` | API connectivity self-check |

## Product Selection Modes

14 built-in presets for `products --mode`:

`beginner` · `fast-movers` · `emerging` · `high-demand-low-barrier` · `single-variant` · `long-tail` · `underserved` · `new-release` · `fbm-friendly` · `low-price` · `broad-catalog` · `selective-catalog` · `speculative` · `top-bsr`

## Requirements

- Python 3.8+ (stdlib only, no pip dependencies)
- APIClaw API Key ([get one here](https://apiclaw.io/api-keys))

## API Coverage

| Endpoint | Description |
|----------|-------------|
| `categories` | Amazon category tree navigation |
| `markets/search` | Market-level metrics (concentration, brand count, etc.) |
| `products/search` | Product search with 20+ filter parameters |
| `products/competitor-lookup` | Competitor discovery by keyword/brand/ASIN |
| `realtime/product` | Real-time product details (reviews, features, variants) |

## License

MIT
