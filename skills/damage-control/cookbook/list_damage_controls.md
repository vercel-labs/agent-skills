---
model: opus
description: List all Damage Control permissions across global, project, and personal levels
---

# Purpose

Display a summary of all Damage Control security configurations across all settings levels (global, project, project personal).

## Variables

GLOBAL_SETTINGS: ~/.claude/settings.json
GLOBAL_PATTERNS: ~/.claude/hooks/damage-control/patterns.yaml
PROJECT_SETTINGS: .claude/settings.json
PROJECT_PATTERNS: .claude/hooks/damage-control/patterns.yaml
LOCAL_SETTINGS: .claude/settings.local.json

## Instructions

- Check each settings level for existence
- Read patterns.yaml at each level if it exists
- Present a consolidated view of all protections
- Clearly indicate which levels are active vs not configured

## Workflow

1. Check which levels have Damage Control installed:
   - Global: Check if `~/.claude/hooks/damage-control/patterns.yaml` exists
   - Project: Check if `.claude/hooks/damage-control/patterns.yaml` exists
   - Personal: Check if `.claude/settings.local.json` exists and references damage-control hooks

2. For each installed level, read the patterns.yaml and extract:
   - `bashToolPatterns` - blocked command patterns
   - `zeroAccessPaths` - no access paths
   - `readOnlyPaths` - read-only paths
   - `noDeletePaths` - no-delete paths

3. Present the consolidated report

## Report

Present the configuration in this format:

---

## Damage Control Configuration Summary

### Global Level (`~/.claude/`)

**Status**: [Installed / Not Configured]

[If installed:]
**Zero Access Paths** (no operations allowed):
- [list paths or "None configured"]

**Read Only Paths** (read allowed, no modifications):
- [list paths or "None configured"]

**No Delete Paths** (all operations except delete):
- [list paths or "None configured"]

**Blocked Command Patterns**: [count] patterns
- [list first 5 patterns with reasons, or "None configured"]
- [if more than 5: "... and [N] more"]

---

### Project Level (`.claude/`)

**Status**: [Installed / Not Configured]

[Same format as Global]

---

### Project Personal Level (`.claude/settings.local.json`)

**Status**: [Installed / Not Configured]

[Same format as Global]

---

### Protection Summary

| Level | Zero Access | Read Only | No Delete | Command Patterns |
|-------|-------------|-----------|-----------|------------------|
| Global | [count] | [count] | [count] | [count] |
| Project | [count] | [count] | [count] | [count] |
| Personal | [count] | [count] | [count] | [count] |

---

**Note**: Hooks at all levels run in parallel. If any level blocks an operation, it is blocked.
