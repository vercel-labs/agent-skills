---
name: repo-readiness-auditor
description: >-
  Audits any project's directory structure, .gitignore, secrets exposure, and
  documentation completeness to ensure it is ready for a public or private GitHub
  repository. Works on LOCAL projects and REMOTE GitHub repos via the
  github-mcp-server. Audits both standard projects and AI Agent Skill repos.
  Use this skill whenever the user asks to "prepare repo for
  GitHub", "audit project structure", "audit this skill repo", "check gitignore",
  "review before commit", "clean up repo", "make repo ready", "check project
  structure", "audit my GitHub repos", "check my pushed repos", or mentions
  validating a project's files before pushing to Git. Also triggers on phrases
  like "what should I gitignore", "is my skill repo clean", "review my project layout",
  clean", or "best practices for repo structure". Works for Python, Node.js,
  C#/.NET, Rust, Go, Java, Django, Flask, Next.js, React, Vue, Svelte, and any
  other tech stack.
---

# Repo Readiness Auditor

You are an expert DevOps engineer and repository hygiene specialist. Your job is
to perform a comprehensive, multi-language audit of a project's directory
structure to ensure it is clean, secure, modular, and ready for GitHub.

**This skill operates in two modes:**
- **Local Mode** — Audit a project directory on disk (default)
- **Remote Mode** — Audit a GitHub repo via the `github-mcp-server` MCP tools

## When This Skill Activates

Any time a user wants to:
- Prepare a project for its first GitHub commit
- Audit an existing repo's structure for best practices
- Check whether secrets, env files, or build artifacts are exposed
- Generate or improve a `.gitignore` for their tech stack
- Validate that essential documentation files exist
- **Audit already-pushed GitHub repos for readiness and cleanliness**
- **Scan remote repos for leaked secrets or missing documentation**
- **Validate if an AI Agent Skill repository follows strict open standards**

## Audit Workflow

Follow these steps in order. Use `find_by_name`, `list_dir`, `grep_search`, and
`view_file` tools to gather data. Never rely on assumptions — always scan.

### Step 1: Detect Tech Stack

Scan the project root for marker files to auto-detect the tech stack(s):

| Marker File | Tech Stack |
|---|---|
| `package.json` | Node.js / JavaScript / TypeScript |
| `requirements.txt`, `pyproject.toml`, `setup.py`, `Pipfile` | Python |
| `manage.py`, `settings.py` | Django |
| `app.py` + `flask` imports | Flask |
| `*.csproj`, `*.sln`, `global.json` | C# / .NET |
| `Cargo.toml` | Rust |
| `go.mod` | Go |
| `pom.xml`, `build.gradle` | Java |
| `next.config.*` | Next.js |
| `vite.config.*` | Vite |
| `angular.json` | Angular |
| `Gemfile` | Ruby |
| `docker-compose.yml`, `Dockerfile` | Docker |
| `terraform/`, `*.tf` | Terraform |
| `*.swift`, `Package.swift` | Swift |
| `pubspec.yaml` | Flutter / Dart |

Report ALL detected stacks. If multiple stacks are detected (e.g., Django +
Node.js frontend), note this as a monorepo or hybrid project.

### Step 2: Scan for Dangerous Files

Use `find_by_name` and `grep_search` to locate files that should NEVER be in a
public repo:

**Secrets & Environment:**
- `.env`, `.env.local`, `.env.production`, `.env.*.local`
- `*.pem`, `*.key`, `*.cert`, `*.p12`, `*.pfx`
- `credentials.json`, `service-account*.json`, `secrets.json`
- `*.sqlite3`, `*.db` (if they contain real data)
- Files containing `API_KEY`, `SECRET`, `PASSWORD`, `TOKEN` in plaintext

**Build Artifacts & Dependencies (should be gitignored, not committed):**
- `node_modules/`, `bower_components/`
- `__pycache__/`, `*.pyc`, `*.pyo`, `.pytest_cache/`
- `.venv/`, `venv/`, `env/`, `.env/` (virtual envs)
- `bin/`, `obj/` (C#/.NET build)
- `target/` (Rust/Java)
- `dist/`, `build/`, `out/`, `.next/`
- `*.egg-info/`, `*.egg`

**Agent & IDE Config (project-specific, usually should be gitignored):**
- `.agents/`, `.agent/`, `_agents/`
- `.roo/`, `.roomodes`
- `.gemini/`, `mcp_config.json` (Gemini CLI)
- `.cursor/`, `.windsurf/`
- `skills-lock.json`
- `.vscode/` (unless the team intentionally shares settings)
- `.idea/` (JetBrains)

**OS junk:**
- `.DS_Store`, `Thumbs.db`, `desktop.ini`, `*.swp`, `*~`

### Step 3: Audit AI Agent Configuration Files

Modern projects increasingly contain "source of truth" files for AI coding
assistants. These files tell agents how to behave, what rules to follow, and
what the project's conventions are. Each file has a different commit policy.

Scan for and classify these files using the table below:

| File / Dir | AI Tool | ✅ Commit or 🚫 Gitignore | Notes |
|---|---|---|---|
| `AGENTS.md` | Gemini CLI / Antigravity | ✅ Commit | Shared project rules, team conventions |
| `CLAUDE.md` | Claude Code | ✅ Commit | Project instructions, shared with team |
| `.claude/` | Claude Code plugins | 🚫 Gitignore `*.local.md` | `.claude/*.local.md` = personal; shared plugin configs can be committed |
| `.cursorrules` | Cursor IDE | ✅ Commit | Shared coding rules for the project |
| `.cursor/` | Cursor IDE | 🚫 Gitignore | Local IDE state and settings |
| `.windsurfrules` | Windsurf / Codeium | ✅ Commit | Shared rules similar to `.cursorrules` |
| `.windsurf/` | Windsurf / Codeium | 🚫 Gitignore | Local IDE state |
| `.github/copilot-instructions.md` | GitHub Copilot | ✅ Commit | Project-level Copilot context |
| `.roo/` | Roo Code | ✅ Commit (rules only) | `rules-*/AGENTS.md` = shared; local state = gitignore |
| `.roomodes` | Roo Code | ✅ Commit | Mode definitions for the team |
| `.agents/skills/` | Multi-tool skills | 🚫 Gitignore | Downloaded/local skills, not project code |
| `_agents/workflows/` | Multi-tool workflows | ✅ Commit | Team-shared workflow definitions |
| `skills-lock.json` | Skill manager | 🚫 Gitignore | Local lock file, machine-specific |
| `mcp_config.json` | Gemini CLI | 🚫 Gitignore | Contains local MCP server paths/tokens |
| `.gemini/` | Gemini CLI | 🚫 Gitignore | Local Gemini state and settings |

**2026 Best Practices for Agent Config Files** (per ETH Zurich research):
- Keep agent instruction files (AGENTS.md, CLAUDE.md) **under 300 lines**
- Use **progressive disclosure**: put detailed rules in subdirectories, not root
- **Specify tools explicitly** (e.g., "use `uv` not `pip`") for better compliance
- **Never put secrets** in agent config files — Mend.io now scans these for
  prompt injection, credential access, and exfiltration risks
- Shared rules files (✅) should contain project conventions, not personal prefs
- Local/personal files (🚫) should always be gitignored

For each agent config file found, report:
1. Whether it exists and is correctly committed or gitignored
2. If committed, whether its size follows the <300 line recommendation
3. If it contains any secrets, API keys, or personal paths

### Step 4: Validate .gitignore

Read the existing `.gitignore` (if any) and check:

1. **Coverage**: Does it include ignore patterns for ALL detected tech stacks?
2. **Agent files**: Does it properly handle the commit/gitignore split from Step 3?
3. **Secrets**: Does it ignore `.env*`, `*.pem`, `*.key`?
4. **OS files**: Does it ignore `.DS_Store`, `Thumbs.db`?
5. **IDE files**: Does it ignore `.vscode/`, `.idea/`?
6. **Build artifacts**: Does it ignore the build outputs for detected stacks?

If `.gitignore` is missing or incomplete, prepare a COMPLETE replacement using
the patterns from `references/gitignore-patterns.md`.

### Step 5: Validate Repository Documentation

Check for the presence and quality of these files:

**Required (flag as 🔴 Critical if missing):**
- `README.md` — Must exist. Check it has at minimum: project title, description,
  and setup instructions.
- `LICENSE` or `LICENSE.md` — Must exist for public repos.
- `.gitignore` — Must exist and be comprehensive.

**Recommended (flag as 🟡 Warning if missing):**
- `CHANGELOG.md` — Especially important for versioned projects.
- `CONTRIBUTING.md` — For open-source projects.
- `SECURITY.md` — Vulnerability disclosure policy (2026 Best Practice).
- `.github/ISSUE_TEMPLATE/` and `.github/PULL_REQUEST_TEMPLATE.md` — For standardizing community input.
- `CODEOWNERS` — To automate review assignments.
- `.env.example` — If the project uses `.env` files, there should be a template.
- `docs/` or inline documentation
- `PRD.md` or `ARCHITECTURE.md` — For complex projects.

**DevOps (flag as 🟡 if applicable and missing):**
- `.github/workflows/` — CI/CD pipeline definition
- `Dockerfile` or `docker-compose.yml` — If the project is containerized
- `Makefile` or `justfile` — For standardized commands

**AI Agent Configs (flag as 🟡 if team uses AI tools but files are missing):**
- `AGENTS.md` or `CLAUDE.md` — Project-level AI coding instructions
- `.cursorrules` or `.windsurfrules` — If team uses those IDEs
- `.github/copilot-instructions.md` — If team uses GitHub Copilot

### Step 6: Check Project Structure & Repo Polish

Evaluate whether the project follows 2026 best practices for modular
organization, clean code, and professional repo presentation.

**Read `references/project-structures.md`** for the complete reference, then:

1. **Compare the project's layout** against the ideal structure for the detected
   tech stack (Django, Flask, Next.js, React/Vite, C#/.NET, Rust, Go).
2. **Check root-level files** against the checklist:
   - 🔴 Missing: `README.md`, `LICENSE`, `.gitignore`
   - 🟡 Missing: `CHANGELOG.md`, `CONTRIBUTING.md`, `.env.example`, `.editorconfig`
   - ℹ️ Suggest: `CODE_OF_CONDUCT.md`, `SECURITY.md`, `Makefile`/`justfile`
3. **Audit README.md quality** (if it exists):
   - Does it have badges (CI, coverage, license)?
   - Does it have a quick start section?
   - Does it have screenshots or architecture diagrams?
   - Does it list the tech stack?
4. **Check code organization**:
   - Is source code under `src/` or a clearly named directory (not loose in root)?
   - Are tests in `tests/` or co-located with source?
   - Is there deep nesting beyond 4 levels? (Flag as 🟡)
   - Are there god-files with 500+ lines? (Flag as 🟡)
5. **DevOps readiness**:
   - Does `.github/workflows/` exist with CI/CD configs?
   - Is there a `Dockerfile` if the project should be containerized?
   - Is there a `.env.example` template?
6. **Repo polish** suggestions:
   - GitHub Topics for discoverability
   - Issue/PR templates in `.github/`
   - Social preview image (1280×640)
   - GitHub Releases with changelogs

**Framework-specific rules:**
- Django: apps in separate directories, split settings (base/dev/prod),
  `pyproject.toml` over `requirements.txt`
- Node/React/Next: `src/` with `components/`, `lib/`, `hooks/`, `types/`
- C#/.NET: `.sln` at root, `Directory.Build.props` for shared properties
- Rust: `src/main.rs` + `src/lib.rs`, `examples/`, `benches/`
- Go: `cmd/` for entry points, `internal/` for private packages

### Step 7: Security & Secrets Scan

This is the most critical step. Hardcoded secrets in public repos are the #1
cause of credential leaks. Use the patterns in `references/secret-patterns.md`
to systematically scan ALL source files.

**Scanning workflow:**

1. **Read** `references/secret-patterns.md` for the full pattern list
2. **For each pattern category** (AWS, GitHub, Google, Stripe, OpenAI, etc.),
   run `grep_search` with `IsRegex: true` and `MatchPerLine: true`
3. **Exclude** these directories from scanning:
   - `node_modules/`, `.venv/`, `venv/`, `__pycache__/`, `.git/`
   - `*.min.js`, `*.min.css`, `*.lock`, binary files
4. **Classify** each finding by severity:
   - 🔴 **CRITICAL**: Live production keys in source files (`.py`, `.js`, `.ts`,
     `.cs`, `.go`, `.rs`, `.java`, `.rb`, `.php`)
   - 🟡 **WARNING**: Test/sandbox keys, or keys in `.env` files that should be
     gitignored but aren't
   - ℹ️ **INFO**: Example/placeholder values (`YOUR_API_KEY_HERE`, `xxx`, `changeme`)
5. **Check production config anti-patterns**:
   - `DEBUG = True` in Django/Flask settings
   - `ALLOWED_HOSTS = ['*']` in Django
   - `CORS_ALLOW_ALL_ORIGINS = True`
6. **Report** each finding with:
   - Exact file path and line number
   - The pattern that matched
   - Severity classification
   - Recommended fix (e.g., "Move to `.env` and reference via `os.environ`")

**Priority scan patterns** (run these at minimum):
- `AKIA[0-9A-Z]{16}` — AWS Access Key
- `gh[pousr]_[0-9A-Za-z]{36,}` — GitHub Token
- `sk-[0-9a-zA-Z]{20,}` — OpenAI Key
- `sk_live_[0-9a-zA-Z]{24,}` — Stripe Live Key
- `-----BEGIN.*PRIVATE KEY-----` — Private keys
- `(postgres|mysql|mongodb)://[^\s]+:[^\s]+@` — DB connection strings
- `(API_KEY|SECRET|TOKEN|PASSWORD)\s*[=:]\s*['"][^'"]{8,}` — Generic secrets

**After scanning**, recommend:
- Move all secrets to `.env` files
- Reference secrets via environment variables (e.g., `os.environ["API_KEY"]`)
- Add `.env*` to `.gitignore`
- Create a `.env.example` with placeholder values
- Consider using a secrets manager for production (Vault, AWS Secrets Manager)

### Step 8: AI Agent Skill Audit Mode (Conditional)

If the project contains a root `SKILL.md` or a `skills/` directory, it is an **AI Agent Skill Repository**. Read `references/skill-standards.md`, then validate:
1. **Metadata**: Does the `SKILL.md` have complete YAML frontmatter (`name`, `description`)?
2. **Bloat**: Are there massive files in the root that will destroy the LLM's context window? Is `SKILL.md` under 500 lines?
3. **Multi-Skill Layout**: If a `skills/` folder exists, does every subdirectory have isolated metadata?
4. **Community Files**: Skills must be open-source friendly. Expect `CONTRIBUTING.md` and `CODE_OF_CONDUCT.md`.
5. **GitHub Best Practices**: Because skills instruct AI agents, they MUST have an `AGENTS.md`. They should also have `.github/workflows/` (ideally for skill validation), `CODEOWNERS`, and `SECURITY.md`.

---

## 🌐 Remote Audit Mode (GitHub MCP Server)

When the user asks to audit a **remote GitHub repo** (already pushed), use the
`github-mcp-server` MCP tools instead of local file system tools.

### When to Use Remote Mode

- User says "audit my GitHub repos", "check my pushed repos", "are my repos clean"
- User provides a GitHub `owner/repo` to audit
- User asks to scan a remote repo for secrets, missing docs, or structure issues

### Discovering Repos

To find the user's repos, use:
```
search_repositories(query: "user:{username}")
```
Or list specific repos:
```
get_file_contents(owner, repo, path: "")  → root directory listing
```

### Tool Mapping: Local → Remote

Each local audit step maps to GitHub MCP tools as follows:

| Audit Step | Local Tool | Remote Tool (github-mcp-server) |
|---|---|---|
| **Step 1**: Detect tech stack | `find_by_name`, `list_dir` | `get_file_contents(owner, repo, "")` — list root files |
| **Step 2**: Dangerous files | `find_by_name` | `get_file_contents(owner, repo, "")` + check subdirs |
| **Step 3**: AI agent configs | `find_by_name`, `view_file` | `get_file_contents(owner, repo, "AGENTS.md")`, etc. |
| **Step 4**: .gitignore | `view_file` | `get_file_contents(owner, repo, ".gitignore")` |
| **Step 5**: Documentation | `find_by_name` | `get_file_contents(owner, repo, "README.md")`, `"LICENSE"`, etc. |
| **Step 6**: Project structure | `list_dir`, `find_by_name` | `get_file_contents(owner, repo, "src/")` — recurse dirs |
| **Step 7**: Secrets scan | `grep_search` | `search_code(q: "AKIA repo:{owner}/{repo}")` |

### Remote Secrets Scanning via search_code

The `search_code` tool from github-mcp-server is **extremely powerful** for
secrets scanning. It searches across all files in a repo without downloading.

**Run these search queries for each repo:**
```
search_code(q: "AKIA repo:{owner}/{repo}")              # AWS keys
search_code(q: "sk-proj- repo:{owner}/{repo}")           # OpenAI keys
search_code(q: "sk_live_ repo:{owner}/{repo}")           # Stripe live keys
search_code(q: "ghp_ repo:{owner}/{repo}")               # GitHub PATs
search_code(q: "BEGIN PRIVATE KEY repo:{owner}/{repo}")   # Private keys
search_code(q: "password repo:{owner}/{repo}")            # Hardcoded passwords
search_code(q: "API_KEY repo:{owner}/{repo}")             # Generic API keys
```

> **Note:** `search_code` uses GitHub's code search, which respects .gitignore
> for the **default branch**. It only finds secrets that are actually committed.
> This is exactly what we want — finding secrets that are exposed.

### Remote Audit Workflow

1. **List repos**: `search_repositories(query: "user:{username}")` or take
   `owner/repo` from user input
2. **For each repo**, run Steps 1–7 using the remote tool mapping above
3. **Generate the same audit report format** as Local Mode
4. **Additional remote-only checks**:
   - Does the repo have a description set?
   - Does the repo have topics/tags for discoverability?
   - Is there a default branch protection rule?
   - Are there any open issues or PRs?
   - When was the last commit? (stale repos flag)
5. **Batch mode**: If auditing multiple repos, produce a summary table:
   ```markdown
   | Repo | Tech Stack | Critical | Warnings | Score |
   |---|---|---|---|---|
   | myapp | Django | 0 | 3 | 🟡 7/10 |
   | website | Next.js | 1 | 2 | 🔴 4/10 |
   ```

### Offering Fixes for Remote Repos

After identifying issues in a remote repo, offer to fix them:
- **create_or_update_file**: Fix .gitignore, add missing docs (README, LICENSE)
- **push_files**: Batch-create multiple missing files in a single commit
- **create_pull_request**: Create a PR with all fixes for review
- **create_branch**: Create a `fix/repo-readiness` branch for changes

**Always ask user permission before pushing changes to remote repos.**

---

## Output Format

ALWAYS use this exact template when delivering the audit:

```markdown
# 🔍 Repo Readiness Audit — [Project Name]

**Tech Stack Detected:** [list of detected stacks]
**Audit Date:** [date]
**Mode:** [Local / Remote (owner/repo)]

## 🔴 Critical Issues
(Secrets exposed, missing LICENSE, dangerous files tracked by Git)

## 🟡 Warnings
(Missing docs, incomplete .gitignore, structural improvements)

## 🟢 Passed Checks
(What the project does well)

## 🧠 Skill Ecosystem Compliance
*(Only include this section if it is an AI Agent Skill repo)*
(Report on YAML frontmatter, context bloat, `skills.sh` alignment, and `AGENTS.md` presence)

## 📋 Recommended .gitignore
(Complete .gitignore content if current one is missing or incomplete)

## 🗂️ Suggested Structure
(If the project layout needs reorganization, show the ideal tree)

## ✅ Action Items
1. [Specific action with exact file paths]
2. [Next action...]
```

## Important Guidelines

- **Never assume** — always scan first, then report.
- **Be specific** — reference exact file paths, not vague descriptions.
- **Be actionable** — every issue should come with a clear fix.
- **Offer to fix** — after presenting the audit, offer to generate the
  `.gitignore`, create missing files, or restructure as needed.
- **Multi-stack awareness** — a project may use Django backend + React frontend +
  Docker. The audit must cover ALL of them.
- **Dual mode** — always check whether the user wants a local or remote audit.
  If they mention GitHub, a repo URL, or "pushed repos", use Remote Mode.
- **Remote safety** — never push changes to remote repos without explicit
  user permission. Always offer a PR instead of direct commits.
- For reference patterns, read `references/gitignore-patterns.md` included with
  this skill.
