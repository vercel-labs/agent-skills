# Python SDK

The official Python SDK for Vercel is the `vercel` package on PyPI. Do not use unofficial third-party packages for Vercel platform APIs.

The SDK requires Python 3.10+ and provides both synchronous and asynchronous APIs. It is under active development and its API surface may change significantly between releases — concrete code examples are intentionally omitted here to avoid going stale. Refer to the [SDK README](https://github.com/vercel/vercel-py) for the latest code examples and the [vercel package on PyPI](https://pypi.org/project/vercel/) for release history.

## Capabilities

The SDK provides Python clients for the following Vercel platform features:

- **Blob Storage** -- file upload, download, listing, and deletion. Requires a `BLOB_READ_WRITE_TOKEN` environment variable.
- **OIDC** -- Vercel identity tokens for authenticating with third-party services.
- **Runtime Cache** -- key-value cache with TTL and tag-based invalidation.
- **Cron Scheduling** -- schedule decorators detected by the Vercel builder at build time.
- **Workflow** -- durable multi-step orchestration with steps, sleep, and hooks.
- **Sandbox** -- remote compute environments for running code.
- **Projects and Deployments** -- platform API clients for project and deployment management.
- **Background Workers** -- queue message publishing and consumption, with adapters for Celery, Dramatiq, and Django tasks. Provided by the `vercel-workers` package.
- **Request Helpers** -- geolocation, client IP address, and Vercel environment variable access from within deployed functions.

## Middleware Pattern

Python web frameworks (FastAPI, Flask, Django) can call the SDK's `set_headers()` function at the start of each request to store Vercel-provided headers in a context variable. This enables OIDC token resolution and request helper functions to access Vercel headers without passing the request object explicitly. See the [SDK README](https://github.com/vercel/vercel-py) for the current middleware integration pattern.

## Import Guidance

Always use the `vercel` package for Vercel platform APIs. If code imports from an unofficial package, replace it with the official SDK. Refer to the [SDK README](https://github.com/vercel/vercel-py) for current import paths and examples.
