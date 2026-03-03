# AGENTS.md

Guidance for AI coding agents (Cursor, Claude Code, Copilot, Codex) working in this repository.

## Repository Overview

Central registry for versioned Agent Skills. Skills are authored here and
deployed to global (`~/.cursor/skills/`, `~/.agents/skills/`) or project-local
(`.cursor/skills/`) paths via `scripts/skill-sync.sh`.

## Structure

```
agent-skills/
├── skills/                       # All skill sources
│   ├── <name>/
│   │   ├── SKILL.md              # Required — agent instructions
│   │   ├── metadata.json         # Required — version, author, date, abstract
│   │   ├── README.md             # Optional — human docs (excluded from deploy)
│   │   ├── AGENTS.md             # Optional — compiled rules output
│   │   ├── references/           # Optional — on-demand reference docs
│   │   ├── assets/               # Optional — templates, checklists, quickref
│   │   ├── scripts/              # Optional — executable automation
│   │   └── rules/                # Optional — rule files (compiled → AGENTS.md)
│   └── claude.ai/                # Skills targeting claude.ai only
│       └── vercel-deploy-claimable/
├── skill-registry.json           # Central manifest (versions, targets, tags)
├── scripts/
│   ├── skill-sync.sh             # Deploy skills to target paths
│   ├── skill-version.sh          # Bump version (registry + metadata + SKILL.md)
│   └── skill-import.sh           # Import skill from external project
├── packages/
│   └── react-best-practices-build/  # Build tooling for rules-based skills
├── .cursor/
│   ├── rules/                    # Cursor rules for this repo
│   └── skills/skill-registry/    # Meta-skill for registry management
└── README.md
```

## Skill Archetypes

### Rules-based skills
Skills with a `rules/` directory containing individual rule files that compile
into `AGENTS.md`. Used by: `react-best-practices`, `composition-patterns`,
`react-native-skills`, `go-package-documentation`.

Build with: `pnpm build` in `packages/react-best-practices-build/`.

### Standard skills
Direct `SKILL.md` + supporting `references/`, `assets/`, `scripts/`. Edited in
place. Used by all other skills.

## Registry Workflow

### Import a skill from another project
```bash
bash scripts/skill-import.sh <project-path> <skill-name> --tags=tag1,tag2
```

### Deploy skills to target paths
```bash
bash scripts/skill-sync.sh              # Deploy all
bash scripts/skill-sync.sh --dry-run    # Preview
bash scripts/skill-sync.sh --skill=NAME # Single skill
bash scripts/skill-sync.sh --list       # Show versions and drift
```

### Bump a skill version
```bash
bash scripts/skill-version.sh <skill-name> patch|minor|major
```

## Commit Conventions

Conventional Commits with skill name as scope:

```
feat(<skill-name>): <description>
fix(<skill-name>): <description>
docs(<skill-name>): <description>
chore(registry): <description>
```

Separate skill content, registry/scripts, and build changes into distinct commits.

## Required Files per Skill

| File | Required | Notes |
|------|----------|-------|
| `SKILL.md` | Yes | Frontmatter: `name` (matches dir), `description` (WHAT + WHEN) |
| `metadata.json` | Yes | `version`, `author`, `date`, `abstract` |
| Entry in `skill-registry.json` | Yes | Version, scope, targets, tags |

## Installation

Skills are deployed via `skill-sync.sh` to these discovery paths:

| Target | Path | Scope |
|--------|------|-------|
| `cursor` | `~/.cursor/skills/<name>/` | Cursor IDE (global) |
| `agents` | `~/.agents/skills/<name>/` | Claude Code / generic agents |
| `claude` | `~/.claude/skills/<name>/` | Claude.ai projects |
