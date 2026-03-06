# Explicit HTTP Instrumentation

The most reliable explicit model for HTTP-triggered workloads (Cloud Run / Firebase gen2) is:
1. Extract or start one root server span at request entry.
2. Keep that span active during request handling.
3. Create child spans only around meaningful operations.
4. Record metrics from the same code path.

## Minimal HTTP Handler Pattern

```typescript
import { context, propagation, SpanStatusCode } from '@opentelemetry/api';
import { tracer } from './otel';
import { logRequestSummary } from './logger';

export async function handleHttp(req: any, res: any) {
  const parent = propagation.extract(context.active(), req.headers);

  await context.with(parent, async () => {
    const span = tracer.startSpan('http.request', {
      kind: 1, // SERVER
      attributes: {
        'http.request.method': req.method,
        'url.full': `${req.protocol}://${req.get('host')}${req.originalUrl}`,
        'http.route': req.route?.path ?? req.path,
        'server.address': req.get('host') ?? undefined,
        'user_agent.original': req.get('user-agent') ?? undefined,
      },
    });

    const started = process.hrtime.bigint();

    try {
      await context.with(trace.setSpan(context.active(), span), async () => {
        // ... business logic ...
        res.status(200).json({ ok: true });
      });

      span.setAttribute('http.response.status_code', res.statusCode);
    } catch (err: any) {
      span.recordException(err);
      span.setStatus({ code: SpanStatusCode.ERROR, message: err?.message });
      span.setAttribute('http.response.status_code', 500);
      throw err;
    } finally {
      const elapsedNs = Number(process.hrtime.bigint() - started);
      span.end();

      // See structured-logging.md for logRequestSummary implementation
      logRequestSummary({ req, res, elapsedNs });
    }
  });
}
```

## Child Spans

Create child spans around explicit boundaries like Cloud SQL queries or external API calls, but avoid wrapping every internal function.
