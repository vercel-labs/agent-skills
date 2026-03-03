## What

<!-- Brief description of what changed and why. -->

## Skills affected

<!-- List each skill touched, with version changes if applicable. -->
<!-- Delete this section if the PR doesn't touch any skill. -->

| Skill | Change | Version |
|-------|--------|---------|
| `skill-name` | added / updated / removed | X.Y.Z → A.B.C |

## Motivation

<!-- Why does this change exist? Link issues, ADRs, or prior discussion. -->

## Quality checklist

- [ ] `skill-registry.json` updated (if skills added/removed/versioned)
- [ ] `metadata.json` version matches registry
- [ ] SKILL.md frontmatter has valid `name` (matches folder) and `description` (WHAT + WHEN)
- [ ] SKILL.md is under 500 lines
- [ ] No empty directories in skill tree
- [ ] No secrets or credentials in skill content
- [ ] `bash scripts/skill-sync.sh --list` shows correct state (if applicable)

## Validation

<!-- Commands run and their output. Example: -->
<!-- - `bash scripts/skill-sync.sh --dry-run` → OK -->
<!-- - `bash skills/create-skill-from-refs/scripts/validate-skill.sh skills/<name>` → all checks pass -->

## Additional context

<!-- Anything else: accepted risks, follow-ups, stacking notes. Delete if empty. -->
