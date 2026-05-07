# Troubleshooting

Use this reference when Vercel build output, runtime logs, or the inspector reports a Python-specific diagnostic.

## Entrypoint Diagnostics

`PYTHON_ENTRYPOINT_NOT_FOUND`

- Add a conventional entrypoint such as `app.py`, `main.py`, `server.py`, `wsgi.py`, or `asgi.py`.
- Or add `[tool.vercel].entrypoint = "path/to/file.py"` to `pyproject.toml`.

`FASTAPI_ENTRYPOINT_NOT_FOUND` or `FLASK_ENTRYPOINT_NOT_FOUND`

- Confirm the dependency is declared.
- Confirm the entrypoint file is inside the Vercel project root.
- Export a top-level `app`, `application`, or `handler`.

`DJANGO_ENTRYPOINT_NOT_FOUND`

- Confirm `manage.py` is at the project root or one directory below.
- Verify the settings module defines `ASGI_APPLICATION` or `WSGI_APPLICATION`:
  ```bash
  uv run manage.py diffsettings | grep -E 'WSGI_APPLICATION|ASGI_APPLICATION'
  ```
- Ensure required environment variables are set in the Vercel project so the settings module can import.

`PYTHON_HANDLER_NOT_FOUND`

- The entrypoint exists but no supported top-level callable was found.
- Export `app`, `application`, or `handler`.
- If a custom handler is configured, the target must be top-level.

## Config Diagnostics

`PYTHON_CONFIG_PARSE_ERROR`

- Fix invalid TOML or JSON in Python/Vercel configuration.

`PYTHON_CONFIG_VALIDATION_ERROR`

- Check `[tool.vercel]` keys and Vercel function config.
- Prefer simple `[tool.vercel].entrypoint` for entrypoint overrides.

`INVALID_VERCEL_JSON`

- Fix invalid JSON in `vercel.json`.
- Remove comments; JSON does not allow them.

## Dependency Diagnostics

`PYTHON_REQUIREMENTS_PARSE_ERROR`

- Remove unsupported pip options from requirements files.
- Check malformed requirement specifiers.
- Prefer `pyproject.toml` for new projects.

`PYTHON_PIPFILE_LOCK_PARSE_ERROR`

- Regenerate `Pipfile.lock`.
- If the project has moved to `pyproject.toml`, remove stale Pipfile artifacts.

`PYTHON_DEPENDENCY_SYNC_FAILED`

- Reproduce locally with `uv sync` or `uv pip install -r requirements.txt`.
- Check selected Python version compatibility.
- Check native dependencies that may lack Linux wheels.
- Remove conflicting manifests and stale lockfiles.

## Python Version Diagnostics

`BUILD_UTILS_PYTHON_VERSION_DISCONTINUED`

- Move to Python 3.12, 3.13, or 3.14.
- Update `.python-version` or `project.requires-python`.

Unsupported future versions:

- Do not request Python versions newer than Vercel supports.
- Use a bounded range such as `>=3.12,<3.15`.

## Django Diagnostics

`DJANGO_SETTINGS_FAILED`

- Run `python manage.py check` locally.
- Ensure required environment variables are available.
- Confirm settings paths, installed apps, middleware, and storage backends import correctly.
- Add missing environment variables via the Vercel dashboard or the Vercel CLI.

## Size and Runtime Install Diagnostics

`LAMBDA_SIZE_EXCEEDED`

Vercel Python functions support up to 500 MB. When the bundle exceeds the standard limit and a `uv.lock` is present, the builder can automatically externalize public PyPI packages and install them at cold start. This is the primary fix path for large dependency sets.

- Prefer `pyproject.toml` with `uv.lock` so the builder can externalize large public packages.
- Avoid custom install/build commands -- these disable the externalization optimization.
- Remove committed virtualenvs, caches, model files, generated artifacts, and unused heavy packages.
- Add targeted `excludeFiles` only for files safe to omit.

Runtime dependency installation failure:

- Check dependency compatibility with the selected Python version.
- Ensure the lockfile matches the manifest.
- Reduce dependency footprint before retrying.

## Deployment Flow

After Python issues are fixed, proceed with deployment. Use the Vercel CLI or a deployment skill if available for auth, domains, environment variables, and logs.
