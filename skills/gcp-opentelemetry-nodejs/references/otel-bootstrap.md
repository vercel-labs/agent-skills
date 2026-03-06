# OpenTelemetry Bootstrap for Google Cloud Node.js

This document provides the minimal recommended bootstrap pattern for OpenTelemetry on Google Cloud Run and Firebase Functions gen2.

## Scope and signal ownership

- **Traces:** OpenTelemetry SDK + Google Cloud Trace exporter.
- **Metrics:** OpenTelemetry SDK + Google Cloud Monitoring exporter.
- **Logs:** Handled separately via standard stdout/stderr structured JSON.

## Packages

You should install:
- `@google-cloud/opentelemetry-cloud-trace-exporter`
- `@opentelemetry/sdk-trace-node`
- `@opentelemetry/sdk-trace-base`
- `@opentelemetry/sdk-metrics` (if using metrics)
- `@opentelemetry/api`

## Minimal Bootstrap Pattern

Load this bootstrap before application code so all explicit spans and meters share one provider lifecycle. The exporter uses Application Default Credentials automatically.

```typescript
// otel.ts
import { context, trace, SpanStatusCode } from '@opentelemetry/api';
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { Resource } from '@opentelemetry/resources';

import { TraceExporter } from '@google-cloud/opentelemetry-cloud-trace-exporter';

const resource = new Resource({
  'service.name': 'your-service-name',
  'service.namespace': process.env.GCLOUD_PROJECT ?? 'unknown',
  'service.version': process.env.K_REVISION ?? 'unknown',
  'cloud.region': process.env.FUNCTION_REGION ?? 'us-central1',
  'deployment.environment': process.env.NODE_ENV ?? 'unknown',
});

const tracerProvider = new NodeTracerProvider({ resource });
tracerProvider.addSpanProcessor(new BatchSpanProcessor(new TraceExporter()));
tracerProvider.register();

export const tracer = trace.getTracer('your-service-name');
export { context, trace, SpanStatusCode };
```

**Note:** Broad auto-instrumentation is not recommended when the main objective is stable semantic control. Explicit boundary-driven design is preferred.
