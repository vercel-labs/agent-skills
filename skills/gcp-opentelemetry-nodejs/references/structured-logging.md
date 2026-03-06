# Structured Logging for Google Cloud LogEntry

Cloud Logging defines `LogEntry` as the durable schema for application logs. Log lines written to stdout/stderr in JSON format will be ingested by GCP.

## Core Rules

1. Put business data in `jsonPayload`.
2. Put standard HTTP envelope data in `httpRequest`.
3. Put correlation data in exact fields: `trace`, `spanId`, and `traceSampled`.
4. Use one request-summary log near response completion. Avoid emitting a full `httpRequest` object on every internal log line.

## Extracting Trace Fields

To correctly link logs to OpenTelemetry traces in GCP, extract the active span:

```typescript
import { context, trace } from '@opentelemetry/api';

function currentTraceFields(projectId: string) {
  const span = trace.getSpan(context.active());
  if (!span) return {};

  const spanContext = span.spanContext();
  return {
    trace: spanContext.traceId, // Or legacy: projects/${projectId}/traces/${spanContext.traceId}
    spanId: spanContext.spanId,
    traceSampled: (spanContext.traceFlags & 0x1) === 1,
    
    // Transport-level convenience keys for structured JSON on GCP:
    'logging.googleapis.com/trace': `projects/${projectId}/traces/${spanContext.traceId}`,
    'logging.googleapis.com/spanId': spanContext.spanId,
    'logging.googleapis.com/trace_sampled': (spanContext.traceFlags & 0x1) === 1,
  };
}
```

## Request Summary Log Implementation

```typescript
export function logRequestSummary({ req, res, elapsedNs }: { req: any, res: any, elapsedNs: number }) {
  const projectId = process.env.GCLOUD_PROJECT ?? 'unknown-project';

  const entry = {
    severity: res.statusCode >= 500 ? 'ERROR' : 'INFO',
    message: 'request.completed',
    ...currentTraceFields(projectId),
    httpRequest: {
      requestMethod: req.method,
      requestUrl: `${req.protocol}://${req.get('host')}${req.originalUrl}`,
      status: res.statusCode,
      userAgent: req.get('user-agent'),
      remoteIp: req.ip,
      referer: req.get('referer'),
      protocol: req.httpVersion ? `HTTP/${req.httpVersion}` : undefined,
      latency: `${elapsedNs / 1_000_000_000}s`,
    },
    jsonPayload: {
      event: 'request.completed',
      service: process.env.K_SERVICE ?? 'unknown',
      revision: process.env.K_REVISION ?? 'unknown',
    },
  };

  process.stdout.write(JSON.stringify(entry) + '\n');
}
```
