# SDK and Runtime APIs

Use this reference when a Python project imports from the `vercel` package. The SDK provides both synchronous and asynchronous APIs for every module. Complete API examples are in the [vercel package on PyPI](https://pypi.org/project/vercel/).

## Installation

Add `vercel` to the project's dependencies. The SDK requires Python 3.10+.

```toml
[project]
dependencies = [
  "vercel",
]
```

## Blob Storage

Blob storage provides file upload, download, listing, and deletion. It requires a `BLOB_READ_WRITE_TOKEN` environment variable, set in the Vercel dashboard or via the Vercel CLI, or passed as a `token` parameter.

```python
from vercel.blob import BlobClient

with BlobClient() as client:
    # Upload
    uploaded = client.put(
        "assets/hello.txt",
        b"hello from python",
        access="public",
        content_type="text/plain",
    )

    # Download
    result = client.get(uploaded.url)
    print(result.content)  # bytes

    # List
    listing = client.list_objects(prefix="assets/")
    for blob in listing.blobs:
        print(blob.pathname, blob.size)

    # Delete
    client.delete(uploaded.url)
```

Async usage:

```python
from vercel.blob import AsyncBlobClient

async with AsyncBlobClient() as client:
    uploaded = await client.put("assets/data.json", b'{"ok": true}', access="public")
    await client.delete(uploaded.url)
```

For large files, the SDK provides multipart upload support via `auto_multipart_upload`, `create_multipart_uploader`, or manual part management. See the SDK README for details.

## OIDC Authentication

Use OIDC when the app needs to authenticate with third-party services using Vercel's identity.

```python
from vercel.oidc import get_vercel_oidc_token, decode_oidc_payload

token = get_vercel_oidc_token()
payload = decode_oidc_payload(token)
# payload contains: sub, project_id, owner_id, exp, etc.
```

Token resolution order:
1. `x-vercel-oidc-token` request header (requires `set_headers` middleware; see Middleware Pattern below).
2. `VERCEL_OIDC_TOKEN` environment variable.
3. Local Vercel CLI login (development only; reads from `.vercel/project.json` and CLI auth).

For credential resolution that combines token, project ID, and team ID:

```python
from vercel.oidc import get_credentials

creds = get_credentials()
# creds.token, creds.project_id, creds.team_id
```

Async variant: `from vercel.oidc.aio import get_vercel_oidc_token`.

## Cron Scheduling

The `@cron` decorator registers a function to run on a schedule. The Vercel builder calls `get_crons()` at build time to discover cron routes, so decorated functions must be module-level.

```python
from vercel.cron import cron

@cron("0 */6 * * *")
def refresh_data():
    # runs every 6 hours
    pass
```

For multiple jobs in one module, use `CronTab`:

```python
from vercel.cron import CronTab

tab = CronTab()

@tab.register("0 0 * * *")
def daily_cleanup():
    pass

@tab.register("*/15 * * * *")
def check_status():
    pass
```

## Runtime Cache

A key-value cache with TTL and tag-based invalidation.

On Vercel, the cache is backed by Vercel's platform cache infrastructure. The required environment variables are auto-injected at runtime; no dashboard configuration is needed. Locally, it falls back to an in-memory Python dict. Values must be JSON-serializable.

```python
from vercel.cache import get_cache

cache = get_cache(namespace="myapp")

# Set with TTL (seconds) and tags
cache.set("user:42", {"name": "Ada"}, {"ttl": 60, "tags": ["user"]})

# Get (returns None on miss or expiry)
value = cache.get("user:42")

# Delete
cache.delete("user:42")

# Invalidate all entries with a tag
cache.expire_tag("user")
```

Async variant:

```python
from vercel.cache import AsyncRuntimeCache

cache = AsyncRuntimeCache(namespace="myapp")

await cache.set("key", {"data": 1}, {"ttl": 120, "tags": ["demo"]})
value = await cache.get("key")
await cache.expire_tag("demo")
```

## Request Helpers

These helpers extract metadata from Vercel-provided request headers. They return meaningful data when deployed on Vercel; locally they return `None` or defaults.

```python
from vercel.headers import geolocation, ip_address
from vercel.env import get_env

# Geolocation from x-vercel-ip-* headers
geo = geolocation(request)
# geo: {city, country, flag, region, countryRegion, latitude, longitude, postalCode}

# Client IP from x-real-ip header
ip = ip_address(request.headers)

# Vercel system environment variables
env = get_env()
# env.VERCEL_ENV, env.VERCEL_URL, env.VERCEL_REGION, env.VERCEL_DEPLOYMENT_ID, etc.
```

These work with any framework whose request object exposes a `.headers.get(name)` interface (FastAPI, Flask, Django, Starlette).

## Middleware Pattern

Calling `set_headers(request.headers)` at the start of each request stores headers in a context variable. This is required for OIDC context resolution and allows request helpers to work without passing the request object explicitly.

```python
from fastapi import FastAPI, Request
from vercel.headers import set_headers

app = FastAPI()

@app.middleware("http")
async def vercel_context_middleware(request: Request, call_next):
    set_headers(request.headers)
    return await call_next(request)
```

The same pattern applies in Flask or Django middleware. After `set_headers` is called, `get_vercel_oidc_token()` can resolve the token from the request header, and `geolocation()` / `ip_address()` can be called without arguments.

## Other SDK Modules

These are platform API clients for less common use cases:

- **Sandbox**: `from vercel.sandbox import Sandbox` -- remote compute environments for running code, filesystem operations, and PTY sessions.
- **Workflow**: `from vercel.workflow import Workflows` -- durable multi-step orchestration with steps, sleep, and hooks.
- **Projects**: `from vercel.projects import ProjectsClient` -- project CRUD operations.
- **Deployments**: `from vercel.deployments import DeploymentsClient` -- deployment creation and file upload.

These clients authenticate via `VERCEL_TOKEN` or OIDC credentials. For deployment management tasks (env vars, domains, logs), prefer the Vercel CLI over direct API calls.

## Import Guidance

Prefer documented package exports over private/internal modules. If code imports from `vercel._internal`, replace it with the public export when available. The SDK README on [PyPI](https://pypi.org/project/vercel/) has complete examples for every module.
