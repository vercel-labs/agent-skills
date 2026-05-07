# Runtime and Entrypoints

Use this reference when Vercel cannot find a Python app, the callable is wrong, routing behaves unexpectedly, or the project uses ASGI/WSGI directly.

## Entrypoint Discovery

Entrypoint resolution follows this priority:

1. **`[tool.vercel].entrypoint`** in `pyproject.toml` — explicit path, highest priority.
2. **Framework-specific discovery:**
   - **Django:** The builder reads `manage.py` to find `DJANGO_SETTINGS_MODULE`, then looks in the settings module for top-level symbols.
   - **Everything else:** Conventional files named `app.py`, `index.py`, `server.py`, `main.py`, `wsgi.py`, or `asgi.py`. Search locations are the project root and shallow app directories such as `src`, `app`, and `api`.
3. **`[project.scripts].app`** in `pyproject.toml` — legacy fallback.

Prefer `[tool.vercel].entrypoint` for new work:

```toml
[tool.vercel]
entrypoint = "api/main.py"
```

## Callable Symbols

For generic Python, FastAPI, and Flask apps, the entrypoint should expose one top-level callable:

- `app`
- `application`
- `handler`

Examples:

```python
from fastapi import FastAPI

app = FastAPI()
```

```python
from flask import Flask

app = Flask(__name__)
```

If `handlerFunction` is configured in Vercel function settings, it must point to a top-level symbol.

## ASGI and WSGI

The runtime bridge distinguishes ASGI from WSGI by callable shape and async behavior.

- FastAPI is ASGI.
- Flask is WSGI.
- Django can use ASGI or WSGI; prefer ASGI when `ASGI_APPLICATION` is configured.
- A `BaseHTTPRequestHandler` subclass is also supported.

The runtime runs ASGI apps through a vendored Uvicorn layer for lifespan support. WSGI apps are adapted through HTTP request wrappers.

## Django Discovery

Django detection starts from `manage.py`, usually at the project root or one directory below. The builder reads `manage.py` to find the module used to set `DJANGO_SETTINGS_MODULE`, then looks in that module for top-level symbols. It prefers `ASGI_APPLICATION` over `WSGI_APPLICATION`.

If the settings module depends on environment variables or other configuration, these must be set in the Vercel project so the build environment can resolve them.

Common blockers:

- `manage.py` is nested too deeply.
- `DJANGO_SETTINGS_MODULE` cannot import because dependencies or environment variables are missing. Set required env vars in the Vercel project settings.
- Settings only define `WSGI_APPLICATION` when the app expects ASGI behavior.

## Working Directory

At runtime, relative file reads such as `open("file.txt")` resolve from the project root. Use absolute paths based on `Path(__file__)` when code needs files next to a module.

## Practical Fix Order

1. Add or correct `[tool.vercel].entrypoint` for nonstandard layouts.
2. Ensure the entrypoint file exists inside the deployed project root.
3. Expose `app`, `application`, or `handler` at top level.
4. For Django, ensure `manage.py` and settings import locally before deploying.
5. Re-run the inspector before deploying.
