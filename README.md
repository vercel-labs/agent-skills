# Agent Skills

Personal registry of versioned Agent Skills used across Cursor, generic agents, and Claude environments.

This repository is the source of truth for skill content, metadata, and deployment targets.

## Repository Purpose

- Maintain skills under `skills/<name>/`
- Track versions and targets in `skill-registry.json`
- Import skills from local repositories/projects
- Sync skills to discovery paths (for example `~/.cursor/skills/`)

## Current Workflow

### 1) Import a skill

```bash
bash scripts/skill-import.sh <project-path> <skill-name> --tags=tag1,tag2
```

### 2) Validate registry and deploy plan

```bash
bash scripts/skill-sync.sh --list
bash scripts/skill-sync.sh --dry-run
```

### 3) Validate a skill package (recommended for PRs)

```bash
bash skills/create-skill-from-refs/scripts/validate-skill.sh skills/<skill-name>
```

### 4) Sync skills to targets

```bash
bash scripts/skill-sync.sh
```

## PR Quality Standard

Use focused PRs and keep content in English:

- Follow `.github/pull_request_template.md`
- Keep commit/PR titles in Conventional Commits format
- Include explicit validation commands and outcomes
- Separate unrelated concerns (skill content vs registry/scripts vs build)

## Privacy and Naming Policy

When describing imported skills in commits/PRs/docs:

- Use generic wording such as `local repository` or `local project`
- Do not reference private repository names

## Skill Layout

Each skill directory should include:

- `SKILL.md` (required)
- `metadata.json` (required)
- Optional: `references/`, `assets/`, `scripts/`

## Selected Skills

This repository currently contains skills including:

- `commit-hygiene`
- `create-skill-from-refs`
- `firebase-functions-node`
- `gcloud-logging`
- `gh-pr-creator`
- `go-package-documentation`
- `nx-monorepo`
- `tdd-classicist`
- `test-verifier`
- `typescript-quality`
- `typescript-testing-organization`
- `vitest-monorepo`
- `react-best-practices`
- `react-native-skills`
- `web-design-guidelines`

## License

MIT
