# AI Agent Skill Open Standards

This document defines the standard repository structure and requirements for open-source AI Agent Skills (compliant with `skills.sh`, Gemini CLI, and Vercel Agent Skills).

When auditing a repository that is intended to serve as an AI skill, enforce these guidelines:

## 1. Required Metadata (YAML Frontmatter)
Every skill **must** have a `SKILL.md` file wrapped in YAML frontmatter.
If the `SKILL.md` file lacks this, it will not be discoverable or executable by `npx skills add` or the Gemini CLI.

**Format required:**
```yaml
---
name: [unique-skill-id]
description: [Short description of what the skill does]
---
# Rest of the markdown...
```

## 2. Directory Structure and Bloat Prevention
AI skills are injected directly into the Large Language Model's context window. Therefore, they **must not** contain bloated files or disorganized folders that could dilute the context.

**Ideal Single-Skill Structure:**
```text
my-skill/
├── SKILL.md               // Core instructions and metadata
├── scripts/               // Executable tools (Python, Node.js, bash)
├── references/            // Essential reference docs or templates ONLY
├── assets/                // Images/media (ignored by text context)
└── README.md              // User instructions
```

**Bloat Warnings to Flag:**
- Root directory should NOT have massive text files (`.csv`, `.log`, 1000+ line text dumps).
- The `SKILL.md` itself should ideally be under 500 lines to preserve token context. If it is longer, warn the user to use "progressive disclosure" (loading external references only when needed).

## 3. Multi-Skill Repositories (The Vercel Labs Pattern)
If a repository contains multiple skills (e.g., `github.com/vercel-labs/skills`), it must follow the isolated directory pattern:

```text
skills-collection-repo/
├── README.md              // List of all skills in the repo
└── skills/
    ├── skill-alpha/
    │   └── SKILL.md       // Self-contained metadata for Alpha
    └── skill-beta/
        └── SKILL.md       // Self-contained metadata for Beta
```
**Rule**: Every directory inside the `skills/` folder MUST contain its own `SKILL.md`. It cannot rely on a root `SKILL.md`.

## 4. GitHub Best Practices (2026) Integration
Because skills are used to instruct AI agents, they must act as gold standards of project cleanliness. When auditing a skill repository, flag the absence of the following files as issues:

- **`AGENTS.md`**: Provides instruction to *other* AI agents interacting with the repository. 
- **`SECURITY.md`**: Essential for any open-source security tool or credential-handling skill.
- **`CODEOWNERS`**: Automates review cycles for the repo.
- **`.github/ISSUE_TEMPLATE` & `.github/PULL_REQUEST_TEMPLATE.md`**: Standardizes community contributions.
- **CI Workflows**: A `.github/workflows/` directory should exist to enforce validation (like YAML frontmatter syntax checks) before PRs are merged.
