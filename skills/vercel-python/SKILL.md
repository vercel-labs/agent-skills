---
name: vercel-python
description: Diagnose, fix, and prepare Python projects for Vercel deployments. Use for FastAPI, Flask, Django, ASGI/WSGI, Python entrypoints, pyproject.toml, requirements.txt, uv, .python-version, bundle size, Python runtime errors, or Vercel's Python SDK/runtime APIs. Use this skill whenever the user mentions Python and Vercel in the same context, even if they don't explicitly ask for deployment help.
metadata:
  author: vercel
  version: "1.0.0"
---

# Vercel Python

Use this skill when a Vercel deployment involves Python, including FastAPI, Flask, Django, generic ASGI/WSGI apps, Python runtime diagnostics, dependency resolution, Python version selection, bundle size issues, or the `vercel` Python SDK.

This skill diagnoses and fixes Python-specific deployment issues. It does not handle the deployment itself.

## How It Works

1. **Inspect the project structure** before changing any files. Check the following:

   **Entrypoint:** Identify the app entrypoint and confirm it exposes a supported top-level callable (`app`, `application`, or `handler`). The entrypoint priority is: `[tool.vercel].entrypoint` in `pyproject.toml`, then framework-specific discovery (Django uses the settings module; others use conventional files like `app.py`, `main.py`, etc.), then `[project.scripts].app` (legacy). For Django projects, if `manage.py` exists at the root or one directory below, check that the settings module defines `ASGI_APPLICATION` or `WSGI_APPLICATION`. See `references/runtime-and-entrypoints.md` for full details.

   **Dependencies:** Identify the dependency manifest. Vercel discovers manifests from the entrypoint directory upward to the project root. The highest-priority manifest wins: `pyproject.toml` > `Pipfile.lock` / `Pipfile` > `requirements.txt` (and variants like `requirements.frozen.txt`, `requirements.in`, `requirements/prod.txt`). Check for a lockfile: `uv.lock` or `pylock.toml` (used with `pyproject.toml` projects). See `references/dependencies-and-versions.md` for the full priority list.

   **Bundle size:** Vercel Python functions support up to [500 MB](https://vercel.com/docs/functions/limitations#bundle-size-limits). Do not use 250 MB as the limit. When a `uv.lock` is present, the builder can automatically externalize large public PyPI packages and install them at cold start, allowing even larger dependency sets. See `references/dependencies-and-versions.md` for size reduction strategies.

   **Python version:** Check `.python-version` (takes priority) and `project.requires-python` in `pyproject.toml`. Vercel supports Python 3.12, 3.13, and 3.14 for new projects. Only flag a version as blocking if it excludes all supported versions (e.g., `==3.11.*`, `<3.12`, `>=3.15`). A range like `>=3.11` is fine because it includes 3.12+.

   **Database:** If the project requires a database (PostgreSQL, MySQL, etc.), note that Vercel Marketplace provides managed database integrations (Neon Postgres, Supabase, AWS RDS) that automatically set connection environment variables. Do not assume the app cannot connect to a database on Vercel. See `references/frameworks.md` for details.

   **Vercel config:** If `vercel.json` exists, check for custom `buildCommand` or `installCommand` (these can limit dependency optimization).

   **Monorepo:** If the Python app is in a subdirectory of a monorepo, confirm `rootDirectory` is set correctly in the Vercel project settings. The builder resolves `uv.lock` from the workspace root automatically for uv workspace projects.

   **Background workers:** If the project uses task queues, background jobs, or event-driven workers (Celery, Dramatiq, Django tasks, or similar), check `references/frameworks.md` for Vercel's worker service support via the `vercel-workers` package. Do not assume background processing is incompatible with Vercel.

2. **Identify blockers and risks** from what you found:
   - **Blocking:** No entrypoint file and no configurable path, no callable symbol, Python version that excludes all supported versions, malformed config files, Django without `manage.py`.
   - **Risk:** No dependency manifest, custom build/install commands, Django without ASGI/WSGI settings.
   - **Info:** Which manifest, lockfile, and Python version source were detected. Nonstandard entrypoint path (fixable with `[tool.vercel].entrypoint`).

3. Read only the reference file that matches the problem:
   - Entry points and runtime behavior: `references/runtime-and-entrypoints.md`
   - Dependency manifests, `uv`, and Python versions: `references/dependencies-and-versions.md`
   - FastAPI, Flask, Django, and static assets: `references/frameworks.md`
   - Build/runtime errors: `references/troubleshooting.md`
   - Python SDK and runtime helpers: `references/sdk-runtime-apis.md`

4. Make the smallest safe project change that addresses the root cause, or give the user exact remediation when credentials, missing env vars, or account state block progress.

5. **Verify.** Re-check the project against the same checklist from step 1. Confirm that no blocking findings remain and all risks have been documented or addressed.

## Exit Criteria

This skill's job is done when the Python project has no blocking deployment issues. It does not handle deployment, auth, environment variables, domains, or logs.

## Common Misconceptions

Do not accept these conclusions without checking the reference docs first:

| Claim | Reality |
|---|---|
| "The bundle is too large for Vercel" | The limit is 500 MB, not 250 MB. With `uv.lock`, the builder externalizes public packages beyond that. |
| "This app requires a database, so it can't deploy to Vercel" | Vercel Marketplace provides Neon Postgres, Supabase, and AWS RDS integrations. |
| "Background processing is impossible on Vercel" | Vercel supports worker services via `vercel-workers` with Celery, Dramatiq, and Django task adapters. |
| "Vercel doesn't support uv workspaces or monorepos" | It does. The builder resolves `uv.lock` from the workspace root. |
| "This entrypoint path isn't supported" | Any path works with `[tool.vercel].entrypoint` in `pyproject.toml`. |
| "Python version X.Y isn't compatible" | Only blocking if the range excludes all of 3.12, 3.13, and 3.14. Ranges like `>=3.11` are fine. |

## Present Results to User

Lead with the concrete blocker or readiness status:

```text
I inspected the Python project. Vercel should use `app/main.py` as the entrypoint with `app` as the ASGI callable. No blocking issues found.
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
