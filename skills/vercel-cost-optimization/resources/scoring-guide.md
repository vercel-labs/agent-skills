# Recommendation Scoring Guide

## Formula

```
score = estimated_monthly_savings × effort_multiplier × confidence
```

Recommendations are ranked by score descending. Only present recommendations with `score > $5/mo`.

## Estimated Monthly Savings

Estimate based on billing data from `get-usage.sh`:
- Calculate what percentage of a billing line item would be reduced by the optimization
- Use conservative estimates (assume 30-50% reduction for most patterns, not 100%)
- For config-only changes (e.g., enabling Fluid Compute, adding middleware matcher), can estimate higher reduction (50-80%)
- If billing data is unavailable for a service, estimate based on typical usage patterns and note the estimate is approximate

### Estimation Guidelines by Pattern Type

| Pattern Type | Typical Savings Range |
|---|---|
| Static generation (FUNC-01) | 40-80% of Function Invocations for affected routes |
| Caching (FUNC-02, FUNC-03) | 30-60% of Function Invocations for cached routes |
| Parallel fetching (DUR-01) | 20-40% of Function Duration |
| Connection pooling (DUR-03) | 10-30% of Function Duration |
| Middleware scoping (EDGE-01) | 50-80% of Edge Requests |
| Image sizes prop (IMG-01) | 20-40% of Image Optimization cost |
| Dynamic imports (BW-02) | 10-30% of Bandwidth |
| Revalidate intervals (ISR-01) | 30-70% of ISR/Data Cache cost |

## Effort Multiplier

Higher multiplier = easier to implement = ranked higher:

| Effort Level | Multiplier | Description |
|---|---|---|
| Low | 1.0 | Config change, single-file edit, adding a prop |
| Medium | 0.7 | Multi-file changes, moderate refactoring, adding new utility |
| High | 0.4 | Architecture change, significant refactoring, new infrastructure |

## Confidence Level

How certain we are the optimization will actually reduce costs:

| Confidence | Value | When to Use |
|---|---|---|
| Definite | 1.0 | Config change with known effect (e.g., middleware matcher, Fluid Compute) |
| High | 0.8 | Clear code pattern match (e.g., sequential awaits → Promise.all) |
| Moderate | 0.5 | Speculative or depends on traffic patterns (e.g., "might reduce invocations if users access this less") |

## Example Scoring

1. **Middleware matcher (EDGE-01)**: $50/mo edge requests × 0.7 reduction × 1.0 effort × 1.0 confidence = **$35/mo** → Present
2. **Parallel fetching (DUR-01)**: $30/mo function duration × 0.3 reduction × 1.0 effort × 0.8 confidence = **$7.20/mo** → Present
3. **Convert polling to webhooks (FUNC-05)**: $20/mo invocations × 0.5 reduction × 0.4 effort × 0.5 confidence = **$2.00/mo** → Skip (below $5 threshold)

## Presentation Rules

- Sort recommendations by score descending
- Group into tiers: "High Impact" (>$20/mo), "Medium Impact" ($10-20/mo), "Quick Wins" ($5-10/mo)
- Always present the score breakdown so users can assess the recommendation
- If total estimated savings across all recommendations < $10/mo, note that the project is already well-optimized
