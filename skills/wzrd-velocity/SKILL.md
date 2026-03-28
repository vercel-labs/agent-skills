---
name: wzrd-velocity
description: >-
  Real-time AI model velocity signals for model routing and selection. Use when
  asked "which model should I use", "what's trending in AI", "best model for
  code/reasoning/math", "model momentum", "inference routing", or when building
  model selection logic. Covers 100+ models across 4 platforms, updated every
  5 minutes. Free API, no auth required.
metadata:
  author: twzrd-sol
  version: "1.0.0"
  category: ai
---

# WZRD Velocity — AI Model Routing Signal

Real-time velocity and momentum signals for 100+ AI models across HuggingFace,
GitHub, OpenRouter, and Artificial Analysis. Use these signals for model
selection, routing, pre-warming, and trend analysis.

**Free API. No authentication required for reading signals.**

## When to Use

- User asks "which model should I use for X?"
- Building model routing or selection logic
- Comparing model momentum or trending status
- Pre-warming inference infrastructure based on demand signals
- Answering "what models are trending right now?"
- Task-specific model selection (code, chat, reasoning, math, vision)

## Quick Start

Fetch the top trending models:

```
GET https://api.twzrd.xyz/v1/signals/momentum?trending=true&limit=5
```

Example response:

```json
{
  "contract_version": "wzrd.momentum.v1",
  "count": 5,
  "models": [
    {
      "model": "Qwen/Qwen3-235B-A22B",
      "trend": "surging",
      "score": 0.891,
      "action": "pre_warm_urgent",
      "confidence": "high",
      "platform": "huggingface",
      "reason": "Rapid velocity increase, high confidence"
    }
  ]
}
```

## API Reference

### Base URL

```
https://api.twzrd.xyz/v1/signals/momentum
```

### Query Parameters

| Parameter    | Example                | Description                                          |
| ------------ | ---------------------- | ---------------------------------------------------- |
| `limit`      | `?limit=10`            | Number of results (max 100)                          |
| `trending`   | `?trending=true`       | Only surging or accelerating models                  |
| `platform`   | `?platform=openrouter` | Filter by source platform                            |
| `capability` | `?capability=code`     | Filter by task: `code`, `chat`, `reasoning`, `vision`, `audio` |
| `window`     | `?window=7d`           | Time window: `1d`, `3d`, `7d`, `14d`, `30d`         |

### Response Fields

| Field        | Values                                                                                                          |
| ------------ | --------------------------------------------------------------------------------------------------------------- |
| `model`      | Model identifier (e.g., `meta-llama/Llama-4-Scout-17B-16E-Instruct`)                                           |
| `trend`      | `surging` (>30% delta), `accelerating` (>8%), `stable`, `decelerating`, `cooling`                               |
| `score`      | Velocity score (0.0 - 1.0)                                                                                      |
| `action`     | `pre_warm_urgent`, `pre_warm`, `candidate`, `recommend`, `route`, `maintain`, `watch`, `consider_deprovision`    |
| `confidence` | `high`, `normal`, `low`, `insufficient`                                                                          |
| `platform`   | `huggingface`, `github`, `openrouter`, `artificial_analysis`                                                     |

### Premium Endpoint

```
GET https://api.twzrd.xyz/v1/signals/momentum/premium
```

Same response plus additional fields: `velocity_ema`, `accel`, `delta_pct`,
`quality_index`, `value_score`. Also free, no auth required.

## Common Patterns

### Pick the best model for a task

```
GET https://api.twzrd.xyz/v1/signals/momentum?capability=code&trending=true&limit=3
```

Returns the top 3 trending models with code capability, sorted by velocity score.

### Compare models across platforms

```
GET https://api.twzrd.xyz/v1/signals/momentum?limit=20
```

Filter the response by `platform` field to compare HuggingFace vs OpenRouter vs
GitHub trends for the same model family.

### Monitor model momentum over time

Use different `window` values to detect if a model is newly trending vs
sustained:

- `?window=1d` — today's movers
- `?window=7d` — weekly momentum (default)
- `?window=30d` — sustained trends

### Health check

```
GET https://api.twzrd.xyz/health
```

Returns `200 OK` when the API is operational.

## Python Client (Optional)

For agents that prefer a Python interface:

```bash
pip install wzrd-client
```

```python
from wzrd_client import WZRDClient

client = WZRDClient()
models = client.momentum(capability="code", trending=True, limit=5)
for m in models:
    print(f"{m['model']}: {m['trend']} (score={m['score']})")
```

CLI usage (no auth needed for signal reading):

```bash
wzrd pick code          # best model for code tasks
wzrd shortlist reasoning --limit=5   # ranked models for reasoning
```

## Platforms Tracked

| Platform              | What It Measures                        |
| --------------------- | --------------------------------------- |
| HuggingFace           | Downloads, likes, trending activity     |
| GitHub                | Stars, forks, issues, contributor pulse |
| OpenRouter            | Request volume, routing share           |
| Artificial Analysis   | Benchmark scores, pricing efficiency    |

Signals are aggregated using a time-weighted exponential moving average (TWAA)
and updated every 5 minutes across all platforms.

## Earning CCM (Optional, Advanced)

Agents can earn CCM tokens on Solana by reporting model picks with verified
inference results. This is entirely optional and requires a Solana keypair.

The earn flow: authenticate with Ed25519 challenge/verify, pick a model via the
momentum API, run inference through the server-witnessed endpoint, report the
result, and claim rewards via gasless relay.

Full earn documentation: https://github.com/twzrd-sol/wzrd-final

## Verification

A working API response contains a `models` array where each entry has `model`,
`trend`, `score`, `action`, `confidence`, and `platform` fields. If the response
is empty or returns an error, check the health endpoint first.
