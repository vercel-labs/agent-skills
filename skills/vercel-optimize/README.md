# vercel-optimize

Optimize cost and performance for projects on Vercel.

This skill uses Vercel metrics to find high-impact improvements in your app. Every recommendation is backed by observed data, scoped code evidence, and version-aware docs.

[![skills.sh](https://skills.sh/b/vercel-labs/agent-skills)](https://skills.sh/vercel-labs/agent-skills)

## Install

Install just this skill:

```bash
npx skills add vercel-labs/agent-skills --skill vercel-optimize
```

Manual install: copy `skills/vercel-optimize` into `.agents/skills/vercel-optimize` and reference `SKILL.md` from your project `AGENTS.md`.

## Requirements

- Node.js 20+
- Vercel CLI v53+ (`npm i -g vercel@latest`)
- Authenticated Vercel CLI session (`vercel login`)
- Linked Vercel project (`vercel link`) or `VERCEL_PROJECT_ID`
- Observability Plus for metric-backed route ranking
- Supported framework for code recommendations: Next.js, SvelteKit, or Nuxt. Astro is limited; Hono, Remix, and unknown frameworks pause up front.

If route-level metrics are unavailable, the skill pauses before scanner-only mode. Scanner-only can catch traffic-independent code issues, but it cannot rank hot routes or prove cost impact.

## Use

From the Vercel project directory, ask your coding agent:

```text
optimize this Vercel project
```

The agent should collect metrics first. If it starts by reading source files or guessing from `vercel.json`, the skill was not loaded correctly.

## What It Checks

- Function invocations, duration, TTFB, cold starts, memory, CPU, and GB-hours
- Request volume, cache hit rate, status codes, methods, and Fast Data Transfer
- ISR reads and writes
- Middleware volume and duration
- Image Optimization usage
- Speed Insights metrics
- External API usage
- Build Minutes, usage spikes, Bot Protection, Fluid Compute, and project config

## What You Get

- Ranked recommendations tied to observed Vercel metrics
- Specific route and file references when source changes are justified
- Before/after code for ready recommendations
- Citations from a curated, version-aware documentation allow-list
- Held-back findings when evidence is real but not strong enough for a recommendation
- A concise final message plus optional debug artifacts for development

## Trust Model

- Metrics come first. Code investigation starts only after signals are collected.
- Gates are deterministic JavaScript thresholds. No LLM decides whether a metric qualifies.
- Citations are allow-listed. Unknown URLs and version-mismatched framework docs are stripped.
- Project config contradictions are rejected. For example, the verifier blocks "enable Fluid Compute" when Fluid Compute is already on.
- Cost impact uses magnitude framing, not invented exact savings.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md). New gates, scanners, playbooks, citations, and sanitizers need fixture coverage in `packages/vercel-optimize-tests`.

## License

MIT
