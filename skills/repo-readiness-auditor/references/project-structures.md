# Project Structure Best Practices Reference

Ideal directory layouts, root-level files, and repo polish for each tech stack.
The repo-readiness-auditor skill uses this to recommend structural improvements.

Source: Perplexity (2026 GitHub best practices), Context7 (Django 6.0 docs), ETH Zurich research.

---

## Root-Level Files Checklist

Every professional repo should have these files at the root:

### Required (flag 🔴 if missing)
| File | Purpose |
|---|---|
| `README.md` | Project overview, badges, quick start, screenshots |
| `LICENSE` | Legal terms (MIT, Apache 2.0, AGPL, etc.) |
| `.gitignore` | Comprehensive ignore patterns for detected stack |

### Strongly Recommended (flag 🟡 if missing)
| File | Purpose |
|---|---|
| `CHANGELOG.md` | Version history in Keep a Changelog format |
| `CONTRIBUTING.md` | How to contribute: PRs, issues, code style |
| `.env.example` | Template for environment variables (no real values) |
| `.editorconfig` | Consistent formatting across editors |

### Nice to Have (flag ℹ️ as suggestion)
| File | Purpose |
|---|---|
| `CODE_OF_CONDUCT.md` | Inclusive collaboration standards |
| `SECURITY.md` | Vulnerability reporting policy |
| `Makefile` or `justfile` | Standardized commands (build, test, lint, deploy) |
| `.github/workflows/` | CI/CD pipeline definitions |
| `.github/ISSUE_TEMPLATE/` | Bug report and feature request templates |
| `.github/pull_request_template.md` | PR description template |
| `Dockerfile` | Containerization (if applicable) |
| `docker-compose.yml` | Multi-service local dev (if applicable) |
| `docs/` | Extended documentation, ADRs, architecture |

---

## README.md Best Practices

A great README should include (in order):

1. **Badges row** — CI status, coverage, license, version, downloads
   ```markdown
   ![CI](https://github.com/user/repo/actions/workflows/ci.yml/badge.svg)
   ![Coverage](https://img.shields.io/codecov/c/github/user/repo)
   ![License](https://img.shields.io/github/license/user/repo)
   ```
2. **Project name + 1-sentence description**
3. **Screenshot or GIF** of the UI/output
4. **Table of contents** (for long READMEs)
5. **Quick Start** — Copy-paste install + run commands
6. **Features** — Bullet list of key capabilities
7. **Tech Stack** — Languages, frameworks, databases
8. **API Reference** — Table or link to docs
9. **Contributing** — Link to CONTRIBUTING.md
10. **License** — Footer with license type

---

## Framework-Specific Ideal Structures

### Python / Django

```
project-root/
├── README.md
├── LICENSE
├── CHANGELOG.md
├── .gitignore
├── .env.example
├── pyproject.toml
├── manage.py
├── config/                    # Project-level config (settings, urls, wsgi)
│   ├── __init__.py
│   ├── settings/
│   │   ├── __init__.py
│   │   ├── base.py            # Shared settings
│   │   ├── dev.py             # Development overrides
│   │   └── prod.py            # Production overrides
│   ├── urls.py
│   ├── wsgi.py
│   └── asgi.py
├── apps/                      # Django apps (or top-level per app)
│   ├── accounts/
│   │   ├── models.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   ├── admin.py
│   │   ├── serializers.py     # or schemas.py for django-ninja
│   │   └── migrations/
│   └── core/
│       └── ...
├── templates/
├── static/
├── tests/
│   ├── conftest.py
│   └── test_*.py
├── docs/
├── .github/workflows/
├── Dockerfile
└── docker-compose.yml
```

**Key principles:**
- Split settings into `base.py` / `dev.py` / `prod.py`
- Each app has its own `urls.py` for clean URL routing
- Use `pyproject.toml` over `requirements.txt` (2026 standard)

### Python / Flask

```
project-root/
├── README.md
├── LICENSE
├── .gitignore
├── .env.example
├── pyproject.toml
├── src/
│   └── app/
│       ├── __init__.py        # create_app() factory
│       ├── routes/            # Blueprint modules
│       │   ├── __init__.py
│       │   ├── auth.py
│       │   └── api.py
│       ├── models/
│       ├── services/          # Business logic
│       ├── templates/
│       └── static/
├── tests/
├── migrations/
├── docs/
├── .github/workflows/
└── Dockerfile
```

**Key principles:**
- Application factory pattern (`create_app()`)
- Blueprints for modular routes
- Services layer separates business logic from routes

### Node.js / Next.js (App Router)

```
project-root/
├── README.md
├── LICENSE
├── .gitignore
├── .env.example
├── package.json
├── next.config.js
├── tsconfig.json
├── .eslintrc.js
├── public/
│   └── images/
├── src/
│   ├── app/                   # App Router pages
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── globals.css
│   │   └── api/               # Route handlers
│   ├── components/
│   │   ├── ui/                # Reusable UI primitives
│   │   └── features/          # Feature-specific components
│   ├── lib/                   # Utilities, API clients
│   ├── hooks/                 # Custom React hooks
│   └── types/                 # TypeScript types
├── tests/
├── .github/workflows/
└── Dockerfile
```

### Node.js / React (Vite)

```
project-root/
├── README.md
├── LICENSE
├── .gitignore
├── .env.example
├── package.json
├── vite.config.ts
├── tsconfig.json
├── .eslintrc.js
├── public/
├── src/
│   ├── assets/                # Images, fonts, icons
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   ├── utils/
│   ├── types/
│   ├── styles/
│   └── main.tsx
├── tests/
├── .github/workflows/
└── Dockerfile
```

### C# / .NET

```
project-root/
├── README.md
├── LICENSE
├── .gitignore
├── .editorconfig
├── Directory.Build.props
├── MyProject.sln
├── src/
│   └── MyProject/
│       ├── MyProject.csproj
│       ├── Program.cs
│       ├── Controllers/
│       ├── Models/
│       ├── Services/
│       ├── Data/              # EF Core DbContext, migrations
│       └── wwwroot/           # Static files (for web apps)
├── tests/
│   └── MyProject.Tests/
│       └── MyProject.Tests.csproj
├── docs/
├── .github/workflows/
└── Dockerfile
```

**Key principles:**
- Solution file (`.sln`) at root
- `Directory.Build.props` for shared MSBuild properties
- Tests in parallel `tests/` directory with matching namespace

### Rust

```
project-root/
├── README.md
├── LICENSE
├── .gitignore
├── Cargo.toml
├── Cargo.lock                 # Commit for binaries, gitignore for libraries
├── src/
│   ├── main.rs                # Binary entry point
│   ├── lib.rs                 # Library entry point
│   └── modules/
│       ├── mod.rs
│       ├── api.rs
│       └── db.rs
├── tests/                     # Integration tests
├── examples/                  # Usage examples
├── benches/                   # Benchmarks
├── docs/
├── .github/workflows/
└── Dockerfile
```

### Go

```
project-root/
├── README.md
├── LICENSE
├── .gitignore
├── go.mod
├── go.sum
├── cmd/                       # Entry points
│   └── myapp/
│       └── main.go
├── internal/                  # Private packages
│   ├── api/
│   ├── db/
│   └── services/
├── pkg/                       # Public reusable packages
├── api/                       # OpenAPI/protobuf specs
├── configs/
├── scripts/                   # Build/deploy helpers
├── tests/
├── docs/
├── .github/workflows/
└── Dockerfile
```

**Key principles:**
- `cmd/` for entry points, `internal/` for private code
- `pkg/` only for genuinely reusable packages
- Standard Go project layout (golang-standards)

---

## Clean Code Organization Principles

1. **src/ layout**: Keep all source code under `src/` to separate it from
   config, docs, and tooling files at the root.
2. **Group by feature, not type**: Prefer `features/auth/` over `controllers/`,
   `models/`, `services/` spread across the tree.
3. **Flat over nested**: Avoid deeply nested directories (max 4 levels).
4. **Co-locate tests**: Place tests next to source (`*.test.ts`) or in a
   parallel `tests/` directory mirroring source structure.
5. **Single responsibility**: Each file should have one clear purpose. Avoid
   god-files with 500+ lines.

---

## DevOps Readiness Checklist

| Item | Check |
|---|---|
| `.github/workflows/ci.yml` | Lint + test on every PR |
| `.github/workflows/cd.yml` | Deploy on merge to main |
| `Dockerfile` | Multi-stage build for minimal image |
| `docker-compose.yml` | Local dev stack (DB, cache, app) |
| `.env.example` | All required env vars with placeholders |
| Branch protection | Require PR reviews on main |
| Dependabot / Renovate | Automated dependency updates |

---

## Nice Repo Polish Touches

1. **GitHub Topics**: Add 5-10 relevant tags for discoverability
2. **Description**: 1-sentence hook in repo settings
3. **Social Preview**: 1280×640 PNG for link previews
4. **Pinned Issues**: Link to roadmap, getting started
5. **Releases**: Use GitHub Releases with changelogs
6. **Issue Templates**: `bug_report.yml`, `feature_request.yml`
7. **PR Template**: Checklist for reviewers
