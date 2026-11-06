# Frameworks

Use this reference for FastAPI, Flask, Django, ASGI/WSGI app shape, static files, and framework-specific deployment friction.

## Zero Configuration

Correctly structured Python projects deploy with zero configuration. No `vercel.json` is needed when the entrypoint and callable follow Vercel's conventions. Do not create a `vercel.json` unless the project genuinely needs an override — unnecessary config is a common source of deployment failures.

## FastAPI

Minimal entrypoint:

```python
from fastapi import FastAPI

app = FastAPI()


@app.get("/")
def read_root():
    return {"ok": True}
```

FastAPI is ASGI. Declare both `fastapi` and an ASGI server such as `uvicorn` in the dependency manifest. WSGI frameworks like Flask do not need `uvicorn`.

See `runtime-and-entrypoints.md` for entrypoint discovery rules and conventional file names.

Typical fixes:

- Export `app` at top level.
- Do not rely on local dev commands such as `uvicorn main:app` as the deploy entrypoint.

## Flask

Minimal entrypoint:

```python
from flask import Flask

app = Flask(__name__)


@app.get("/")
def index():
    return "ok"
```

For non-trivial apps, Flask's [application factory](https://flask.palletsprojects.com/en/stable/tutorial/factory/) pattern is recommended. The factory function returns the app, and the top-level assignment makes it discoverable by Vercel:

```python
from flask import Flask


def create_app():
    app = Flask(__name__)
    # register blueprints, configure extensions
    return app


app = create_app()
```

Flask is WSGI. It does not need `uvicorn` or any ASGI server dependency.

Typical fixes:

- Export `app` or `application` at top level.
- Declare `flask` in `pyproject.toml` or `requirements.txt`.
- Avoid debug-only local server code as the deployment path.

## Django

Django projects should have `manage.py` at the project root or one directory below. Vercel inspects settings and prefers `ASGI_APPLICATION` over `WSGI_APPLICATION`.

Typical checks:

```bash
python manage.py check
python manage.py collectstatic --noinput
```

If settings import fails locally, fix that before deploying. Common causes include missing dependencies, required environment variables, bad `ALLOWED_HOSTS`, or incorrect settings module paths.

## Static Assets

Use Vercel's `public/` directory for static files that do not need framework processing.

FastAPI and Flask apps should not mount framework static directories for files that can live in `public/`.

Django static collection can run during build when static settings are compatible. Supported patterns include:

- Default Django static storage.
- `ManifestStaticFilesStorage`.
- WhiteNoise `CompressedManifestStaticFilesStorage`.
- `django-storages` configurations.

`WHITENOISE_USE_FINDERS=True` can work without `STATIC_ROOT`, but prefer an explicit static setup for production.

## Background Workers

Vercel supports background task processing via the `vercel-workers` package. Worker services run alongside the web service and consume messages from Vercel Queues.

The `vercel-workers` package provides:

- `send()` and `@subscribe` primitives for publishing and consuming queue messages.
- Adapters for **Celery**, **Dramatiq**, and **Django tasks**.

Worker services are configured in `vercel.json` using `experimentalServices`:

```json
{
  "experimentalServices": {
    "web": {
      "framework": "fastapi",
      "entrypoint": "main.py",
      "routePrefix": "/"
    },
    "worker": {
      "type": "worker",
      "entrypoint": "worker.py",
      "topic": "default",
      "consumer": "default"
    }
  }
}
```

When a Python app requires background processing (task queues, scheduled jobs, event-driven workers), check whether `vercel-workers` can handle the workload before concluding that the app is incompatible with Vercel.

## Databases

Vercel Marketplace provides managed database integrations that automatically configure connection environment variables:

- **Neon Postgres** -- serverless PostgreSQL.
- **Supabase** -- PostgreSQL with auth, storage, and realtime.
- **AWS RDS** -- managed relational databases (PostgreSQL, MySQL).

When a Python app requires a database, check whether a Vercel Marketplace integration can provision it. The integration sets connection environment variables (e.g., `DATABASE_URL`, `POSTGRES_URL`) automatically.

## Environment Variables

If app import requires secrets or database URLs, configure those in Vercel before deployment. Add environment variables via the Vercel dashboard, Vercel CLI, or by adding a Marketplace integration.

Keep deployment diagnosis separate from secret handling: identify the missing variable name, then add it via the Vercel dashboard or CLI.
