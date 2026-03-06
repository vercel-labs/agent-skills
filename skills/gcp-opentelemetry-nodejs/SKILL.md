---
name: gcp-opentelemetry-nodejs
description: >-
  Provides OpenTelemetry explicit instrumentation methodology and Google Cloud LogEntry formatting rules for Node.js workloads. Use when instrumenting Cloud Run services or Firebase Functions gen2, correlating traces with logs, configuring structured logging, or integrating with Cloud Error Reporting.
metadata:
  domain: observability
  framework: opentelemetry
  platform: google-cloud
---

# Google Cloud OpenTelemetry Node.js Knowledge Hub

Rules and patterns for explicitly instrumenting Node.js workloads (Cloud Run, Firebase Functions gen2) with OpenTelemetry and Google Cloud structured logging.

## Applicability Gate

Apply this skill when ANY of the following are true:

- You are setting up OpenTelemetry (`opentelemetry-js`) in a Google Cloud Node.js service
- You need to structure logs to be compatible with Google Cloud `LogEntry` format
- You are trying to correlate logs and traces in Google Cloud (Cloud Logging / Cloud Trace)
- You want to format errors so they are caught by Google Cloud Error Reporting
- You are instrumenting an HTTP request handler in Cloud Run or Firebase

## Routing Table

| Question | Route to |
|----------|----------|
| "How do I bootstrap OpenTelemetry and Google Cloud exporters?" | [references/otel-bootstrap.md](references/otel-bootstrap.md) |
| "How do I manually instrument an HTTP request?" | [references/http-instrumentation.md](references/http-instrumentation.md) |
| "How do I format logs so they correlate with traces in GCP?" | [references/structured-logging.md](references/structured-logging.md) |
| "How do I format error logs for Cloud Error Reporting?" | [references/error-reporting.md](references/error-reporting.md) |

## Procedure

1. **Identify the task type.** Determine which part of the observability stack needs to be implemented or fixed (e.g., traces, logging, error reporting).
2. **Route to the right reference.** Use the routing table above.
   Read only the reference file(s) needed — do not load all.
3. **Apply the methodology.** Follow the patterns and constraints from the loaded reference, ensuring you respect the Google Cloud contracts (like `LogEntry` structure).
4. **Use exact correlation fields.** Never use arbitrary fields for linking traces and logs; rely on the exact keys specified in the references.

## Confirmation Policy

Do NOT apply observability code changes derived from these rules without explicit user confirmation. Present proposed instrumentation or logging format changes as diffs and wait for approval.
