---
name: vercel-python
description: Diagnose, fix, and prepare Python projects for Vercel deployments. Use for FastAPI, Flask, Django, ASGI/WSGI, Python entrypoints, pyproject.toml, requirements.txt, uv, .python-version, bundle size, Python runtime errors, or Vercel's Python SDK/runtime APIs.
metadata:
  author: vercel
  version: "1.0.0"
---

# Vercel Python

Use this skill when a Vercel deployment involves Python, including FastAPI, Flask, Django, generic ASGI/WSGI apps, Python runtime diagnostics, dependency resolution, Python version selection, bundle size issues, or the `vercel` Python SDK.

This skill handles Python-specific diagnosis and remediation. For the actual deployment flow, use a deployment skill if one is available. For CLI auth, environment variables, domains, or logs, use the Vercel CLI or a CLI-focused skill if available.

## How It Works

1. **Inspect the project structure** before changing any files. Check the following:

   **Entrypoint:** Look for these files in the project root, then in `src/`, `app/`, and `api/` subdirectories:
   - `app.py`, `index.py`, `server.py`, `main.py`, `wsgi.py`, `asgi.py`

   If found, read the file and check for a top-level `app`, `application`, or `handler` symbol (variable assignment, function, or class). If none of these symbols exist, the deployment will fail at build time.

   If the project uses a nonstandard entrypoint path, check `pyproject.toml` for `[tool.vercel].entrypoint`.

   **Dependencies:** Identify the dependency manifest. Vercel uses this priority:
   1. `pyproject.toml`
   2. `Pipfile.lock` / `Pipfile`
   3. `requirements.txt` (and variants: `requirements.frozen.txt`, `requirements.in`)

   Check for a lockfile: `uv.lock` or `pylock.toml` (used with `pyproject.toml` projects).

   **Python version:** Check `.python-version` (takes priority, skip comment lines starting with `#`) and `project.requires-python` in `pyproject.toml`. Vercel supports Python 3.12, 3.13, and 3.14 for new projects. Only flag a version as blocking if it excludes all supported versions (e.g., `==3.11.*`, `<3.12`, `>=3.15`). A range like `>=3.11` is fine because it includes 3.12+.

   **Django:** If `manage.py` exists at the root or one directory below, look for a settings file containing `ASGI_APPLICATION` or `WSGI_APPLICATION`.

   **Vercel config:** If `vercel.json` exists, check for custom `buildCommand` or `installCommand` (these can limit dependency optimization).

2. **Identify blockers and risks** from what you found:
   - **Blocking:** No entrypoint file, no callable symbol, Python version outside supported range, malformed config files, Django without `manage.py`.
   - **Risk:** No dependency manifest, custom build/install commands, Django without ASGI/WSGI settings.
   - **Info:** Which manifest, lockfile, and Python version source were detected.

3. Read only the reference file that matches the problem:
   - Entry points and runtime behavior: `references/runtime-and-entrypoints.md`
   - Dependency manifests, `uv`, and Python versions: `references/dependencies-and-versions.md`
   - FastAPI, Flask, Django, and static assets: `references/frameworks.md`
   - Build/runtime errors: `references/troubleshooting.md`
   - Python SDK and runtime helpers: `references/sdk-runtime-apis.md`

4. Make the smallest safe project change that addresses the root cause, or give the user exact remediation when credentials, missing env vars, or account state block progress.

5. When the Python project is ready, proceed with deployment. If a deployment skill is available, use it. Deploy as preview unless the user explicitly asks for production.

## Present Results to User

Lead with the concrete blocker or readiness status:

```text
I inspected the Python project. Vercel should use `app/main.py` as the entrypoint with `app` as the ASGI callable.

The deployment blocker is `requires-python = ">=3.15"` in `pyproject.toml`; Vercel currently supports Python 3.12, 3.13, and 3.14 for new Python deployments. I can change this to a supported range and then deploy a preview.
```

When several findings exist, group them by deployment impact:

- Blocking: prevents Vercel from building or routing the app.
- Risk: likely runtime failure or slow/large deployment.
- Info: useful context such as manifest, lockfile, or detected entrypoint.

## Troubleshooting

- Entrypoint or handler not found: inspect `references/runtime-and-entrypoints.md`.
- Dependency sync, `uv`, lockfile, or Python version issues: inspect `references/dependencies-and-versions.md`.
- FastAPI, Flask, Django, static assets, or `collectstatic` issues: inspect `references/frameworks.md`.
- Vercel diagnostic codes such as `PYTHON_ENTRYPOINT_NOT_FOUND`, `PYTHON_HANDLER_NOT_FOUND`, `DJANGO_SETTINGS_FAILED`, `PYTHON_REQUIREMENTS_PARSE_ERROR`, `PYTHON_DEPENDENCY_SYNC_FAILED`, or `LAMBDA_SIZE_EXCEEDED`: inspect `references/troubleshooting.md`.
- Runtime helper APIs such as Blob storage, OIDC, caching, geolocation, or cron scheduling: inspect `references/sdk-runtime-apis.md`.

This skill is for preparing and fixing Python apps. Once the project is ready, hand off deployment, auth, environment variables, domains, and logs to the appropriate tools or skills.
