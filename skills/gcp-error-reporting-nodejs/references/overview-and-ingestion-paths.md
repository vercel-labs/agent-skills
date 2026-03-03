# Overview: ingestion paths & constraints

This reference explains how errors end up in Google Cloud Error Reporting, and which path to pick
for Node.js apps.

## Ingestion paths (pick one)

| Path | When to use | What you do |
|------|-------------|-------------|
| **Automatic capture from Cloud Logging** | Running on Google-managed runtimes that already emit unhandled exceptions (e.g. Cloud Run / Cloud Run functions) | Ensure unhandled exceptions are written to logs (often `stderr`) in a supported stack trace format |
| **Node.js client library** (`@google-cloud/error-reporting`) | You need manual reporting, framework middleware, or custom metadata | Install + initialize the library and call `errors.report(...)` (or use middleware) |
| **Write via APIs** (Error Reporting API `projects.events.report` or Cloud Logging `entries.write`) | You can’t use the library, or you’re integrating from outside Node.js | Format the request payload correctly (LogEntry or ReportedErrorEvent) and authenticate |

## API choice: Error Reporting API vs Cloud Logging API

- **Error Reporting API `projects.events.report`**
  - Use when you need **API key-based authentication**.
  - Calls generate Cloud Logging entries automatically in:
    `projects/PROJECT_ID/clouderrorreporting.googleapis.com%2Freported_errors`
  - Because entries are generated, you may incur Cloud Logging ingestion costs.

- **Cloud Logging API `entries.write`**
  - Use when you want to emit log entries and have Error Reporting ingest them.
  - Your `LogEntry` must contain either:
    - a stack trace, or
    - a `ReportedErrorEvent` payload copied into `jsonPayload`.
  - See `references/logentry-formatting.md` for exact formatting rules.

## Constraints that can prevent ingestion

Error Reporting analyzes log entries when all of the following are true:

- **Assured Workloads disabled** for the affected data path.
- **CMEK disabled** on log buckets that store the entry (Error Reporting can’t store entries in CMEK
  buckets).
- The log bucket is in the same project as the originating logs, or logs were routed to a project
  that owns the bucket.

## Cloud Run note (automatic path)

If you run on Cloud Run, unhandled exceptions written to logs (e.g. `stderr`) are typically sent to
Cloud Logging and automatically detected by Error Reporting. If they aren’t detected, use the
client library.

## See also

- [Cloud Run behavior](cloud-run.md)
- [Cloud Run functions behavior](cloud-run-functions.md)
- [LogEntry formatting rules](logentry-formatting.md)
- [Node.js setup](nodejs-setup.md)
