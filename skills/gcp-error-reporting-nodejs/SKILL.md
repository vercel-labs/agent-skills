---
name: gcp-error-reporting-nodejs
description: >-
  Set up and use Google Cloud Error Reporting in Node.js applications. Explains when to rely on
  automatic error capture (Cloud Run / Cloud Run functions) vs the @google-cloud/error-reporting
  client library, and how to format Cloud Logging entries so Error Reporting ingests them. Use when
  the user asks about Error Reporting, clouderrorreporting.googleapis.com, reporting Node.js
  exceptions, configuring @google-cloud/error-reporting, or formatting logs for Error Reporting.
license: MIT
compatibility:
  - Node.js + npm (when using @google-cloud/error-reporting)
  - A Google Cloud project with Error Reporting API enabled (when using the client library or APIs)
metadata:
  domain: observability
  cloud: gcp
  language: nodejs
  services: [error-reporting, cloud-logging, cloud-run, cloud-run-functions]
---

# Google Cloud Error Reporting — Node.js

This skill helps you decide the right Error Reporting ingestion path (automatic capture vs client
library vs log formatting), then implement it safely for Node.js apps.

## Applicability Gate

Apply this skill when ANY of the following are true:

- You want errors from a Node.js app to appear in **Google Cloud Error Reporting**
- You are deploying to **Cloud Run** or **Cloud Run functions** and want to confirm what is automatic
- You need to **report custom errors** (not only unhandled exceptions)
- You need to format logs so **Error Reporting ingests** them from **Cloud Logging**
- You need to configure `@google-cloud/error-reporting` (`reportMode`, `serviceContext`, auth)

Do NOT apply when:

- You only need to query logs / build Cloud Logging filters → route to **gcloud-logging**

## Routing Table

| Question | Route to |
|----------|----------|
| “What are the ingestion paths (automatic vs library vs APIs)?” | [overview-and-ingestion-paths](references/overview-and-ingestion-paths.md) |
| “Do I need the Node.js client library on Cloud Run?” | [cloud-run](references/cloud-run.md) |
| “Do I need the Node.js client library on Cloud Run functions?” | [cloud-run-functions](references/cloud-run-functions.md) |
| “How do I set up Error Reporting for Node.js?” | [nodejs-setup](references/nodejs-setup.md) |
| “How do I configure @google-cloud/error-reporting options?” | [nodejs-config quickref](assets/quickref/nodejs-config.md) |
| “How do I manually report errors from Node.js?” | [nodejs-client-library](references/nodejs-client-library.md) |
| “How should I format Cloud Logging entries so Error Reporting ingests them?” | [logentry-formatting](references/logentry-formatting.md) |
| “Which jsonPayload fields does Error Reporting look at?” | [logentry fields quickref](assets/quickref/logentry-fields.md) |

## Procedure

1. **Identify the runtime.** Local dev, Cloud Run, Cloud Run functions, or something else?
2. **Pick the ingestion path.**
   - Prefer **automatic capture** when your runtime already emits unhandled exceptions to Logging.
   - Use `@google-cloud/error-reporting` when you need **manual reporting**, framework middleware, or
     custom grouping/metadata.
   - Use **log formatting** when you can’t (or don’t want to) use the library, but still control
     log entry shape.
3. **Route to the right reference** using the table above (read only what you need).
4. **Propose the minimal change set** (dependency + initialization + middleware + config), and keep
   credentials out of source code.
5. **Validate safely.** Generate a test error (in a non-production environment) and confirm it
   appears in Error Reporting and/or in Cloud Logging with expected payload shape.

## Confirmation Policy

Do NOT apply code/config changes without explicit user confirmation, especially when:

- Adding dependencies (`@google-cloud/error-reporting`)
- Changing auth strategy (service account keys, API keys, ADC)
- Enabling `reportUnhandledRejections` or adding `process.on("uncaughtException")` handlers

## Related Skills

- **gcloud-logging** — query Cloud Logging and investigate stack traces and error patterns
