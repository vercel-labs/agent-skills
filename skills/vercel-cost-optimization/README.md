# Vercel Cost Optimization

Analyze Vercel billing data, identify cost drivers, map them to your code, and get scored optimization recommendations.

## Structure

- `scripts/` - Automation scripts
  - `get-usage.sh` - Wraps `vercel usage --format json` for billing data
  - `detect-stack.sh` - Detects framework, version, ORM, and config
- `resources/` - Reference documents (read on-demand by the agent)
  - `billing-service-mapping.md` - Maps billing line items to code investigation steps
  - `optimization-patterns.md` - 22 patterns with IDs, version gating, and code examples
  - `version-gating.md` - Next.js 13/14/15 feature availability matrix
  - `stack-specific-advice.md` - Prisma, Drizzle, Supabase, tRPC advice
  - `scoring-guide.md` - Recommendation scoring formula
- `metadata.json` - Document metadata (version, organization, abstract)
- __`SKILL.md`__ - Skill definition with 6-step workflow

## How It Works

1. **Collect billing data** — Runs `get-usage.sh` to pull Vercel usage as JSON
2. **Detect project stack** — Runs `detect-stack.sh` to identify framework, version, ORM
3. **Map costs to code** — Investigates top cost drivers using grep/find commands
4. **Identify optimizations** — Matches applicable patterns filtered by version
5. **Score and rank** — `score = savings × effort_multiplier × confidence` (threshold $5/mo)
6. **Present report** — Structured output with cost breakdown, recommendations, and config checklist

## Prerequisites

- Vercel CLI installed and authenticated (`npm i -g vercel && vercel login`)
- Project linked to Vercel (`vercel link`)
- `jq` recommended for reliable JSON parsing (optional, script falls back to grep/sed)

## Cross-References

References 9 rules from `react-best-practices` by name:
`async-parallel`, `server-parallel-fetching`, `server-cache-react`, `server-cache-lru`,
`async-suspense-boundaries`, `bundle-dynamic-imports`, `bundle-barrel-imports`,
`bundle-defer-third-party`, `server-after-nonblocking`

## Acknowledgments

Created by Vercel Engineering. Optimization knowledge based on patterns from internal tooling.
