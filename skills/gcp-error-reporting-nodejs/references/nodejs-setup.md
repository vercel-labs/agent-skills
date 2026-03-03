# Set up Error Reporting for Node.js apps

This reference focuses on the official Node.js path using `@google-cloud/error-reporting`.

## Prerequisites

- Select or create a Google Cloud project.
- Ensure billing is enabled.
- Enable the **Error Reporting API** (`clouderrorreporting.googleapis.com`).

## Install and initialize

```bash
npm install @google-cloud/error-reporting
```

```js
const {ErrorReporting} = require('@google-cloud/error-reporting');

const errors = new ErrorReporting();
errors.report('Something broke!');
```

## Running on Google Cloud

To create error groups using the Error Reporting API method `projects.events.report`, the service
account needs **Error Reporting Writer** (`roles/errorreporting.writer`).

Some runtimes grant this role automatically (including **Cloud Run** and **Cloud Run functions**).

Also note: Cloud Run is configured to use Error Reporting automatically. Unhandled JavaScript
exceptions appear in Logging and can be processed by Error Reporting without needing the library.

## Local development

When running locally (outside Google-managed runtimes), you typically must provide the library with
Application Default Credentials (ADC).

One common setup path is:

```bash
gcloud auth application-default login
```

If you want to use explicit credentials in code (not recommended for production repos), the client
constructor supports options such as `projectId` + `keyFilename`.

## See also

- [Client library usage and configuration](nodejs-client-library.md)
- [Quick reference: config options](../assets/quickref/nodejs-config.md)
- [Cloud Run behavior](cloud-run.md)
