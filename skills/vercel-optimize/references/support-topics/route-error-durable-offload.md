---
id: route-error-durable-offload
title: Durable offload for timeout-heavy routes
status: active
candidateKinds: ["route_errors"]
frameworks: ["*"]
priority: 82
citations: ["https://vercel.com/docs/workflow", "https://vercel.com/docs/queues", "https://vercel.com/docs/functions/limitations"]
maxBriefChars: 850
---

## Investigation Brief
Timeout-heavy routes often need a job boundary, not a higher limit. Workflow is beta; mention it only when durable multi-step work is truly what the route is doing.

## Evidence To Check
Use `errorStatusPattern`, `errorCodes`, and source control flow. Look for long-running fan-out, polling, batch work, AI jobs, uploads, or multi-step side effects inside a request handler.

## Do Not Recommend When
Do not offload synchronous user-facing reads or writes that must complete before responding. Do not recommend beta primitives without naming the tradeoff.

## Verification
Name the timeout/error class, the long-running operation, and the queue or workflow boundary that preserves user-visible semantics.
