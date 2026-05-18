---
id: usage-spike-triage
title: Usage spike triage
status: active
candidateKinds: ["usage_spike_triage"]
frameworks: ["*"]
priority: 95
citations: ["https://vercel.com/docs/observability/anomaly-detection", "https://vercel.com/docs/pricing/spend-management", "https://vercel.com/docs/security/bot-protection"]
maxBriefChars: 950
---

## Investigation Brief
A single-day or single-SKU spike needs cause before fix. Branches: bot or AI crawler on a cacheable route, viral moment, pricing-model migration, or code regression.

## Evidence To Check
Confirm SKU and day from `usage.breakdown.data`. Cross-check firewall/bot data, traffic curve, SKU rename timing, and deploy log around the spike day. Spend Management goes silent post-threshold; Anomaly Alerts is continuous.

## Do Not Recommend When
Do not propose a code fix until the branch is identified. Do not rate-limit a viral moment or revert a deploy for third-party crawler traffic.

## Verification
Name SKU, day, value, window mean, branch, and one supporting datum.
