# Error Reporting Format for Node.js Services

Cloud Error Reporting groups errors from service logs. It recognizes errors through two main paths:
1. A stack trace written directly in `textPayload`.
2. A `jsonPayload` that includes a recognizable field: `stack_trace`, `exception`, or `message`.

If multiple exist, Error Reporting evaluates in this order: `stack_trace` > `exception` > `message`.

## Recommended Error Log Pattern

To ensure logs are caught by Error Reporting and correlated with the active trace, use the following pattern:

```typescript
import { context, trace } from '@opentelemetry/api';

// See structured-logging.md for currentTraceFields implementation
function currentTraceFields(projectId: string) {
  const span = trace.getSpan(context.active());
  if (!span) return {};

  const spanContext = span.spanContext();
  return {
    trace: spanContext.traceId,
    spanId: spanContext.spanId,
    traceSampled: (spanContext.traceFlags & 0x1) === 1,
    'logging.googleapis.com/trace': `projects/${projectId}/traces/${spanContext.traceId}`,
    'logging.googleapis.com/spanId': spanContext.spanId,
    'logging.googleapis.com/trace_sampled': (spanContext.traceFlags & 0x1) === 1,
  };
}

export function logError(err: Error, extra: Record<string, unknown> = {}) {
  const projectId = process.env.GCLOUD_PROJECT ?? 'unknown-project';
  const traceFields = currentTraceFields(projectId);

  const entry = {
    severity: 'ERROR',
    message: err.message,
    ...traceFields,
    jsonPayload: {
      // Provide the stack trace or message for Error Reporting ingestion
      message: err.stack ?? err.message,
      exception: err.stack ?? err.message,
      serviceContext: {
        service: process.env.K_SERVICE ?? 'unknown',
        version: process.env.K_REVISION ?? 'unknown',
      },
      errorName: err.name,
      ...extra,
    },
  };

  process.stderr.write(JSON.stringify(entry) + '\n');
}
```

## Special Cases

If you need Error Reporting to capture a plain text message even when there is no stack trace, you can include `@type` inside `jsonPayload`:

```json
"jsonPayload": {
  "@type": "type.googleapis.com/google.devtools.clouderrorreporting.v1beta1.ReportedErrorEvent",
  "message": "Plain text error message here"
}
```

However, if a stack trace is provided in `message` or `exception` within `jsonPayload`, this explicit `@type` is not required.
