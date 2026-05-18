---
id: observability-events-cost-attribution
title: Observability Events cost attribution
status: active
candidateKinds: ["observability_events_attribution"]
frameworks: ["*"]
priority: 92
citations: ["https://vercel.com/docs/observability/observability-plus", "https://vercel.com/docs/observability/anomaly-detection"]
maxBriefChars: 900
---

## Investigation Brief
Observability Events is the metered SKU under Observability Plus. Field baseline: median 9% of bill, P90 28%. Above 20% means event volume is the lever, but no sampling control exists. Reduce upstream: lift cache hit rate, narrow middleware matchers, cap custom-span cardinality.

## Evidence To Check
Verify the share from `usage.services`. Cross-reference `requestsByRouteCache`, `middlewareCount`, external API span counts, and third-party tracing (`tracesSampleRate=1`).

## Do Not Recommend When
Skip below 15% share. Skip when cache hit rate is already >90% across hot routes — the lever is elsewhere. Do not propose sampling — Observability Plus has no sample rate.

## Verification
Name the share, upstream drivers, and concrete remediation per driver, not generic "reduce events".
