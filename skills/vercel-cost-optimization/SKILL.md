---
name: vercel-cost-optimization
description: Analyze Vercel billing data, identify primary cost drivers, map them to your code, and provide scored optimization recommendations. Use when asked to optimize Vercel costs, reduce Vercel bill, analyze Vercel usage, or improve Vercel spending efficiency.
license: MIT
metadata:
  author: vercel
  version: "1.0.0"
---

# Vercel Cost Optimization

Analyzes your Vercel billing data, detects your project stack, maps cost drivers to specific code locations, and provides scored, actionable optimization recommendations ranked by estimated savings.

## Prerequisites

- **Vercel CLI** installed and authenticated (`npm i -g vercel && vercel login`)
- **Project linked** to Vercel (`vercel link` in project root)
- **Node.js** project with `package.json` in the working directory

Verify setup:

```bash
vercel whoami    # Should print your username
vercel project   # Should show linked project
```

## Workflow

Follow these 6 steps in order. Each step builds on the previous.

---

### Step 1: Collect Billing Data

Run the usage script to pull billing data for the current billing period:

```bash
bash scripts/get-usage.sh --from YYYY-MM-DD --to YYYY-MM-DD
```

- Use the current billing period dates (typically the 1st of the current month to today)
- Add `--breakdown` for per-resource granularity if overall costs are unclear
- The script outputs JSON to stdout

Parse the JSON output and identify:
1. Total cost for the period
2. Cost per billing service (Function Invocations, Function Duration, Edge Requests, Image Optimization, Bandwidth, ISR/Data Cache, Cron, Web Analytics)
3. Top 3 cost drivers by absolute dollar amount

---

### Step 2: Detect Project Stack

Run the stack detection script in the project root:

```bash
bash scripts/detect-stack.sh .
```

This outputs a JSON object with:
- `framework`, `frameworkVersion` — determines which optimization patterns apply
- `hasAppRouter`, `hasPagesRouter` — affects routing-specific recommendations
- `typescript` — for code example formatting
- `orm` — triggers stack-specific advice (Prisma, Drizzle, etc.)
- `isMonorepo` — may affect path-based investigation
- `configFlags` — already-enabled optimizations
- `hasCron`, `cronCount` — cron-specific cost investigation

---

### Step 3: Map Costs to Code

Read the billing service mapping reference:

```
resources/billing-service-mapping.md
```

For each of the top 3 cost drivers identified in Step 1:
1. Follow the investigation commands listed for that billing service
2. Run the grep/find commands against the project codebase
3. Document specific files and line numbers that contribute to the cost
4. Note any quick wins that are immediately applicable

Record findings as a list of `(billing_service, file, line, issue_description)` tuples.

---

### Step 4: Identify Applicable Optimizations

Read the optimization patterns and version gating references:

```
resources/optimization-patterns.md
resources/version-gating.md
```

For each code issue found in Step 3:
1. Check the version gating guide to determine which patterns are available for the detected `frameworkVersion`
2. Match applicable patterns from the optimization catalog (by pattern ID)
3. Filter out patterns that don't apply to the detected framework version
4. Note the effort level and cross-references to `react-best-practices` rules

If the detected `orm` is not `"none"`, also read:

```
resources/stack-specific-advice.md
```

And include any applicable ORM/library-specific recommendations.

---

### Step 5: Score and Rank Recommendations

Read the scoring guide:

```
resources/scoring-guide.md
```

For each applicable optimization from Step 4:
1. Estimate monthly savings based on the billing data from Step 1
2. Apply the effort multiplier (Low=1.0, Medium=0.7, High=0.4)
3. Apply the confidence level (Definite=1.0, High=0.8, Moderate=0.5)
4. Calculate: `score = estimated_savings × effort_multiplier × confidence`
5. Discard any recommendation with score ≤ $5/mo

Sort remaining recommendations by score descending.

---

### Step 6: Present Results

Use the report template below to present findings to the user.

---

## Report Template

Present the following report to the user:

### Cost Analysis Report

**Project**: {project_name}
**Stack**: {framework} {frameworkVersion} | {orm} | {app_router/pages_router}
**Billing Period**: {from} to {to}
**Total Cost**: ${total}

#### Cost Breakdown

| Service | Cost | % of Total |
|---------|------|------------|
| {service_1} | ${amount} | {pct}% |
| {service_2} | ${amount} | {pct}% |
| ... | ... | ... |

#### Top Cost Drivers

For each top cost driver, explain:
1. **What's driving the cost** — specific files/routes identified
2. **Why it's expensive** — the pattern causing excess usage
3. **Code locations** — file paths and line numbers

#### Recommendations

Group by tier:

**High Impact (>$20/mo savings)**

| # | Pattern | Est. Savings | Effort | Confidence | Score |
|---|---------|-------------|--------|------------|-------|
| 1 | {ID}: {title} | ${savings}/mo | {Low/Med/High} | {confidence} | ${score} |

For each recommendation, provide:
- **What to change**: Specific code modification with before/after
- **Files affected**: List of files to modify
- **Cross-reference**: Link to `react-best-practices` rule if applicable (e.g., "See rule `async-parallel`")

**Medium Impact ($10-20/mo savings)**

(Same table format)

**Quick Wins ($5-10/mo savings)**

(Same table format)

#### Platform Configuration Checklist

Check these Vercel platform settings:

- [ ] **Fluid Compute** — Enabled in project settings (reduces cold starts and idle time)
- [ ] **Bot Protection** — Enabled in Vercel Firewall (reduces bot-driven function invocations)
- [ ] **Speed Insights** — Only enabled if actively used (adds function overhead)
- [ ] **Web Analytics** — Only enabled if no external analytics provider
- [ ] **Skew Protection** — Evaluate if needed (adds header overhead)
- [ ] **Function Region** — Set to closest region to your database

#### Summary

- **Total estimated savings**: ${total_savings}/mo
- **Number of recommendations**: {count}
- **Highest impact change**: {top_recommendation}

If total estimated savings < $10/mo:
> Your project is already well-optimized. The identified optimizations would yield minimal savings. Consider revisiting after traffic grows significantly.

---

## Cross-Skill References

This skill references the following rules from `react-best-practices`. Reference them by name — do not duplicate the rule content:

| Rule | Used In | Context |
|------|---------|---------|
| `async-parallel` | DUR-01 | Parallel data fetching with Promise.all |
| `server-parallel-fetching` | DUR-01 | Restructure components for parallel fetches |
| `server-cache-react` | DUR-05 | React.cache() for request deduplication |
| `server-cache-lru` | DUR-05 | LRU cache for cross-request caching |
| `server-after-nonblocking` | DUR-06 | after() for non-blocking operations |
| `bundle-dynamic-imports` | BW-02 | next/dynamic for heavy components |
| `bundle-barrel-imports` | BW-03 | Direct imports to avoid barrel files |
| `bundle-defer-third-party` | BW-04 | Defer analytics and third-party scripts |
| `async-suspense-boundaries` | BW-05 | Suspense boundaries for streaming |

When presenting a recommendation that maps to a `react-best-practices` rule, mention:
> "See `react-best-practices` rule `{rule-name}` for detailed implementation guidance."

---

## Troubleshooting

### "vercel: command not found"
Install the Vercel CLI: `npm i -g vercel`

### "Not authenticated"
Run `vercel login` and follow the prompts.

### "Project not linked"
Run `vercel link` in the project root to connect to your Vercel project.

### "No usage data returned"
- Verify the date range is within your current billing cycle
- Check that the project has had deployments and traffic in the specified period
- Ensure your account has billing enabled (free tier may have limited usage data)

### "jq not found" (detect-stack.sh)
The detection script works without `jq` but results are more reliable with it installed:
- macOS: `brew install jq`
- Linux: `apt-get install jq` or `yum install jq`

### Stack detection is incorrect
- Ensure `node_modules` is installed (`npm install`) for accurate version detection
- The script reads `package.json` — verify your dependencies are listed correctly
- For monorepos, run the script from the specific app directory, not the workspace root

### Low confidence in savings estimates
Savings estimates are conservative approximations based on billing data and code patterns. Actual savings depend on traffic patterns, caching hit rates, and implementation details. Monitor your Vercel bill after applying changes to validate impact.
