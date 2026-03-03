# Cloud Run: Error Reporting behavior

Error Reporting is automatically enabled for Cloud Run applications.

For most languages (including Node.js), exceptions written to `stderr`, `stdout`, or other logs that
include a supported stack trace format are written to Cloud Logging and are automatically detected
by Error Reporting.

If exceptions aren’t being detected, the recommended fallback is to use the Error Reporting client
library for your language (for Node.js, `@google-cloud/error-reporting`).

## Viewing errors

- In Cloud Run, you can view top errors detected by Error Reporting on the service detail page’s
  **Metrics** tab.
- You can also use the Error Reporting page in Google Cloud Console to view error groups.

## See also

- [Node.js setup (library)](nodejs-setup.md)
- [LogEntry formatting rules](logentry-formatting.md)
- [Overview: ingestion paths](overview-and-ingestion-paths.md)
