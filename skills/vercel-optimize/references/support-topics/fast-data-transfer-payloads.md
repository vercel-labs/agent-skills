---
id: fast-data-transfer-payloads
title: Fast Data Transfer payloads
status: active
candidateKinds: ["uncached_route"]
frameworks: ["*"]
priority: 65
citations: ["https://vercel.com/docs/edge-network/bandwidth", "https://vercel.com/docs/caching/cdn-cache"]
maxBriefChars: 900
---

## Investigation Brief
When uncached routes carry high bandwidth, check payload shape before recommending only cache headers. FDT meters **post-compression** bytes — compare gzipped/brotli sizes to the signal, not raw JSON. ISR cache compressed since Jan 2025; a stale-deploy project still pays uncompressed rates until next deploy.

## Evidence To Check
Use `bandwidthByCache`, response size, and source serialization. Look for unbounded JSON, large embedded objects, static files through functions, missing pagination.

## Do Not Recommend When
Do not shrink payloads without identifying fields or assets that are unnecessary for the route’s response.

## Verification
Tie the finding to observed bytes, cache result mix, and the exact response line. A "large payload" claim must reflect post-compression bytes — the unit FDT meters.
