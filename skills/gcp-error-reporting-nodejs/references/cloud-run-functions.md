# Cloud Run functions: Error Reporting behavior

Cloud Run functions is configured to use Error Reporting automatically:

- Unhandled exceptions appear in Cloud Logging and can be processed by Error Reporting without
  needing to use a client library.
- Cloud Run functions grants the **Error Reporting Writer** role
  (`roles/errorreporting.writer`) to the default service account automatically, so client libraries
  can typically use Application Default Credentials without extra setup.

## See also

- [Cloud Run behavior](cloud-run.md)
- [Node.js setup (library)](nodejs-setup.md)
- [Overview: ingestion paths](overview-and-ingestion-paths.md)
