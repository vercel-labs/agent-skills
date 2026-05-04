# Dependencies and Versions

Use this reference for `pyproject.toml`, `requirements.txt`, `Pipfile`, `uv`, lockfiles, Python version diagnostics, dependency sync failures, and large bundle behavior.

## Manifest Priority

Vercel discovers Python dependencies from the entrypoint directory upward to the project root. The effective priority is:

1. `pyproject.toml`
2. `Pipfile.lock`
3. `Pipfile`
4. `requirements.frozen.txt`
5. `requirements-frozen.txt`
6. `requirements.txt`
7. `requirements.in`
8. `requirements/prod.txt`

Prefer `pyproject.toml` for new projects. Use one primary manifest to avoid confusing agents and future maintainers.

## Lockfile Priority

When using `pyproject.toml`, lockfiles are selected in this order:

1. `uv.lock`
2. `pylock.toml`

`Pipfile.lock` is for Pipfile-based projects and should not be treated as the lockfile for a `pyproject.toml` project.

## Python Versions

Vercel Python deployments currently support Python 3.12, 3.13, and 3.14 for new projects. Python 3.12 is the default.

Version selection sources:

1. Nearest `.python-version`
2. `project.requires-python` in `pyproject.toml`

Use `.python-version` when the desired exact runtime matters:

```text
3.13
```

Use `requires-python` for package compatibility. A bounded range allows Vercel to select the best supported version:

```toml
[project]
requires-python = ">=3.12,<3.15"
```

A wildcard equality pin locks to a specific minor version:

```toml
[project]
requires-python = "==3.12.*"
```

Both patterns are valid. Do not request unsupported future versions such as `3.15`.

## uv Behavior

Vercel uses `uv` for Python dependency installation. Build-time installs can download managed Python versions automatically. Runtime dependency installation avoids Python downloads and expects the needed runtime to be available.

If dependency sync fails:

1. Reproduce locally with `uv sync` or `uv pip install -r requirements.txt`.
2. Check native extensions and platform-specific wheels.
3. Confirm the selected Python version satisfies all dependencies.
4. Remove stale or conflicting lockfiles.

## Custom Build or Install Commands

Custom `installCommand` or `buildCommand` can disable or limit Vercel's Python dependency optimization. Avoid custom commands unless the project genuinely needs them.

When custom commands are required, document why and keep them minimal.

## Bundle Size

Vercel Python functions support up to 500 MB of total bundle size.

When a project exceeds the standard bundle limit and a `uv.lock` is present, the builder can automatically externalize public PyPI packages. Externalized packages are installed at cold start from the lockfile rather than bundled into the function. This is the primary mechanism for deploying large Python dependency sets. It requires:

- `pyproject.toml` with a `uv.lock` lockfile.
- No custom install or build commands (these disable the optimization).

Common fixes for oversized bundles:

- Prefer `uv.lock` with `pyproject.toml` so the builder can externalize large public packages.
- Remove unused heavy packages.
- Avoid committing `.venv`, `venv`, caches, model weights, and generated artifacts.
- Use `excludeFiles` in `vercel.json` only for files safe to omit from the function bundle.
- Avoid custom install/build commands when the issue is dependency bundle size.

Do not assume Vercel deploys every local file. Static `public/**` assets are served separately, and many development/cache directories are excluded.
