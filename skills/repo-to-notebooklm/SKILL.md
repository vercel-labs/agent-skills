---
name: repo-to-notebooklm
description: Converts a GitHub repository into a focused, NotebookLM-ready markdown document that covers what the project does, when to use it, how to use it, and what it's capable of. Use this skill whenever the user mentions turning a GitHub repo into a document, study material, or something they can ask questions about — including phrases like "把这个 repo 转成 NotebookLM 文件", "帮我生成这个库的文档", "make notes about this library", "summarize this GitHub project", "create a doc from this repo", "I want to understand this codebase", or "turn this into NotebookLM". Trigger even if the user doesn't say "NotebookLM" explicitly — any request to document or summarize a GitHub repo for reading/learning purposes qualifies.
---

# Repo to NotebookLM

Convert a GitHub repository into a single markdown file that NotebookLM can ingest. The goal is a document that helps someone understand the project deeply enough to use it confidently — what it does, when it's the right tool, how to get started, and what it can do.

## Output document structure

Produce a single markdown file with these sections (skip any section where information genuinely isn't available):

1. **Overview** — What this project is, what problem it solves, and why it exists. One focused paragraph.
2. **When to use this** — Concrete situations where this repo is the right choice. Bullet list. Include what it's NOT suited for if relevant.
3. **Installation & Setup** — Package manager commands, required environment variables, prerequisites, and any gotchas during setup.
4. **Quick Start** — The smallest working example that demonstrates the core value. Should be copy-pasteable.
5. **Core Concepts** — Key abstractions, mental models, and architectural patterns needed to use this project well. Write in plain prose with bullet points — no Mermaid diagrams. Describe data flows and component relationships in sentences, like: "Requests pass through the middleware chain (auth → rate limiting → logging) before reaching the router."
6. **Key Features & Capabilities** — What it can do, organized by feature area. Include a short code snippet for each meaningful capability.
7. **API / Usage Guide** — Main functions, classes, configuration options, or CLI commands. Enough detail that a developer could write working code without looking elsewhere.
8. **Real-world Examples** — 2–3 complete, realistic examples showing common use cases from start to finish.
9. **Limitations & Gotchas** — Known constraints, performance characteristics, common mistakes, version-specific behavior to watch out for.

## How to gather information

### Step 1: Identify the repo

Extract `owner/repo` from the user's message. If the user gave a full GitHub URL, parse it. If ambiguous (e.g., just a library name), ask once to confirm the exact repo.

### Step 2: Fetch repo metadata and file tree

Run these in parallel:

```bash
gh repo view owner/repo --json name,description,homepageUrl,topics,primaryLanguage,stargazerCount,licenseInfo,createdAt,updatedAt
```

```bash
gh api repos/owner/repo/git/trees/HEAD?recursive=1 \
  | python3 -c "
import json, sys
tree = json.load(sys.stdin).get('tree', [])
for f in tree:
    if f['type'] == 'blob':
        print(f['path'])
" | head -300
```

### Step 3: Select which files to read

From the file tree, read files in this priority order. Use:
```bash
gh api repos/owner/repo/contents/PATH --jq '.content' | base64 -d
```

**Always read:**
- `README.md` (or `.rst`, `.txt` — whatever exists)
- Package manifest: `package.json`, `pyproject.toml`, `Cargo.toml`, `go.mod`, `composer.json`, `*.gemspec`

**Read if present:**
- `docs/` — quickstart, tutorial, or getting-started files (pick the 2–3 most useful)
- `examples/` or `example/` — pick 2–3 representative files that show real usage
- `CHANGELOG.md` or `CHANGELOG` — useful for understanding what the project considers important
- Main source entry point (e.g., `src/index.ts`, `lib/__init__.py`, `src/lib.rs`, `cmd/main.go`)
- Any file named `API.md`, `USAGE.md`, `GUIDE.md`, or similar

**Skip entirely:**
- Test files (`*.test.*`, `*_test.*`, `tests/`, `spec/`)
- CI/CD configs (`.github/`, `.circleci/`, `Makefile` unless it documents usage)
- Build artifacts, lock files, generated files
- Configuration files that aren't user-facing

**Limit:** Read at most 15 files total. For very large repos, prioritize breadth (README + examples + manifest) over reading every source file.

### Step 4: Supplement with release information

```bash
gh release list --repo owner/repo --limit 3
```

This helps understand what the project treats as major milestones.

## Writing the document

**Audience:** A developer who has never used this project but is reasonably experienced. Write as if explaining to a smart colleague, not a beginner and not an expert in this specific tool.

**Diagrams:** Never use Mermaid. Describe architecture and data flows in prose instead. Example of good plain-text architecture description:
> "The SDK has three layers: the client (handles auth and HTTP), the resource layer (one class per API endpoint, e.g., `client.messages`), and the type system (Pydantic models that validate inputs and parse responses). User code only touches the client and resource layers."

**Code blocks:** Always include language identifiers (` ```python `, ` ```bash `, ` ```typescript `).

**Internal references:** When a term is explained in another section, add a parenthetical like "(see Core Concepts)" so readers can navigate the document.

**Length:** 2,000–4,000 words. Lean longer for complex frameworks; shorter for focused utilities. Quality over length — don't pad sections where information is thin.

**Language:** Write the document in English, regardless of the language the user used to make the request.

## Output

Save the file as `<repo-name>-notebooklm.md` in the current working directory.

After saving, tell the user:
- The file path
- Which sections are included
- Any gaps (e.g., "no examples directory was found; examples were inferred from the README")
- One-line instruction for uploading to NotebookLM: drag the file into the Sources panel of a new or existing notebook
