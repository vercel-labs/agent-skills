---
title: OpenTelemetry Is Standard for Tracing and Metrics
impact: MEDIUM
impactDescription: ensures consistent observability across services
tags: observability, opentelemetry, tracing, metrics
---

## OpenTelemetry Is Standard for Tracing and Metrics

**Impact: MEDIUM (ensures consistent observability across services)**

OpenTelemetry is the standard for distributed tracing and metrics in this
workspace. All services must initialize the OTel SDK and propagate trace
context. Observability instrumentation is part of the definition of done.

**Incorrect (no observability):**

```typescript
// apps/guard-api/src/main.ts
// ❌ No OTel initialization
import express from 'express';

const app = express();
app.use('/events', eventRoutes);
app.listen(3000);
// Requests are invisible — no traces, no metrics
```

**Incorrect (custom tracing solution):**

```typescript
// ❌ Roll-your-own tracing
const startTime = Date.now();
const result = await processEvent(input);
console.log(`processEvent took ${Date.now() - startTime}ms`);
```

**Correct (OTel SDK initialization):**

```typescript
// apps/guard-api/src/otel-init.ts
// ✅ OTel setup before app starts
import { initTelemetry } from '@turbi/shared-observability';

initTelemetry({
  serviceName: 'guard-api',
  serviceVersion: process.env['APP_VERSION'] ?? '0.0.0',
});
```

```typescript
// apps/guard-api/src/main.ts
// ✅ Import OTel before anything else
import './otel-init.js';
import express from 'express';
// OTel auto-instruments Express, HTTP, and DB calls
```

**Correct (manual span for custom operations):**

```typescript
import { trace } from '@opentelemetry/api';

const tracer = trace.getTracer('guard-ingestion');

async function ingestEvent(input: EventInput): Promise<void> {
  return tracer.startActiveSpan('ingestEvent', async (span) => {
    try {
      span.setAttribute('event.id', input.eventId);
      const result = await processEvent(input);
      span.setStatus({ code: SpanStatusCode.OK });
      return result;
    } catch (error) {
      span.setStatus({ code: SpanStatusCode.ERROR });
      span.recordException(error as Error);
      throw error;
    } finally {
      span.end();
    }
  });
}
```

The shared `@turbi/shared-observability` lib handles SDK setup, exporters, and
common instrumentation.

Reference: [OpenTelemetry JS Documentation](https://opentelemetry.io/docs/languages/js/)
