---
model: opus
description: Convert Damage Control patterns for Windows (PowerShell/cmd) compatibility
---

# Purpose

Update an existing Damage Control installation to work on Windows machines by converting Unix patterns to Windows PowerShell and cmd equivalents.

## Variables

GLOBAL_PATTERNS: ~/.claude/hooks/damage-control/patterns.yaml
PROJECT_PATTERNS: .claude/hooks/damage-control/patterns.yaml

## Instructions

- Check for existing damage control installation
- If not installed, ask user if they want to install first
- Convert Unix command patterns to Windows equivalents
- Add Windows-specific dangerous patterns
- Preserve existing path protections (paths work cross-platform)
- DO NOT remove Unix patterns - ADD Windows patterns alongside them

**IMPORTANT**: This creates a cross-platform patterns.yaml that works on both Unix and Windows.

## Windows Command Equivalents

| Unix Command | Windows PowerShell | Windows cmd |
|--------------|-------------------|-------------|
| `rm -rf` | `Remove-Item -Recurse -Force` | `rd /s /q`, `del /f /s /q` |
| `rm -r` | `Remove-Item -Recurse` | `rd /s` |
| `chmod 777` | `icacls * /grant Everyone:F` | `icacls` |
| `chown` | `takeown`, `icacls` | `takeown` |
| `sudo rm` | `Start-Process -Verb RunAs` | N/A |
| `git reset --hard` | Same | Same |
| `git push --force` | Same | Same |
| `mkfs` | `Format-Volume` | `format` |
| `dd` | N/A | N/A |
| `kill -9` | `Stop-Process -Force` | `taskkill /F` |
| `history -c` | `Clear-History` | `doskey /reinstall` |

## Workflow

### Step 1: Determine Installation Level

1. Use AskUserQuestion:

```
Question: "Which Damage Control installation do you want to update for Windows?"
Options:
- Global (~/.claude/hooks/damage-control/)
- Project (.claude/hooks/damage-control/)
- Project Personal (same location, different settings file)
```

2. Set PATTERNS_FILE based on selection

### Step 2: Check Installation Exists

3. Read PATTERNS_FILE to check if it exists

4. **If not found**: Use AskUserQuestion:
```
Question: "Damage Control is not installed at this level. Would you like to install it first?"
Options:
- Yes, install first (then run Windows conversion)
- No, cancel
```

5. If Yes → Read and execute [install_damage_control_ag_workflow.md](install_damage_control_ag_workflow.md), then continue

### Step 3: Read Current Patterns

6. Read the existing patterns.yaml file
7. Parse the `bashToolPatterns` section

### Step 4: Add Windows Patterns

8. Add the following Windows-specific patterns to `bashToolPatterns`:

```yaml
# ---------------------------------------------------------------------------
# WINDOWS DESTRUCTIVE FILE OPERATIONS (PowerShell)
# ---------------------------------------------------------------------------
- pattern: '\bRemove-Item\s+.*-Recurse'
  reason: Remove-Item with -Recurse flag (PowerShell rm -rf equivalent)

- pattern: '\bRemove-Item\s+.*-Force'
  reason: Remove-Item with -Force flag (PowerShell rm -f equivalent)

- pattern: '\bri\s+.*-Recurse'
  reason: ri (Remove-Item alias) with -Recurse

- pattern: '\bdel\s+.*-Recurse'
  reason: del (Remove-Item alias) with -Recurse

- pattern: '\bRemove-Item\s+-Path\s+[''"]?[\\/\*]'
  reason: Remove-Item targeting root paths

# ---------------------------------------------------------------------------
# WINDOWS DESTRUCTIVE FILE OPERATIONS (cmd)
# ---------------------------------------------------------------------------
- pattern: '\brd\s+/s'
  reason: rd /s (recursive directory delete)

- pattern: '\brmdir\s+/s'
  reason: rmdir /s (recursive directory delete)

- pattern: '\bdel\s+/[fF]'
  reason: del /f (force delete)

- pattern: '\bdel\s+/[sS]'
  reason: del /s (recursive delete)

- pattern: '\berase\s+/[fFsS]'
  reason: erase with force/recursive flags

# ---------------------------------------------------------------------------
# WINDOWS PERMISSION CHANGES
# ---------------------------------------------------------------------------
- pattern: '\bicacls\s+.*Everyone:F'
  reason: icacls granting Everyone full control

- pattern: '\bicacls\s+.*\*:F'
  reason: icacls granting full control

- pattern: '\btakeown\s+/[rR]'
  reason: takeown with recursive flag

- pattern: '\battrib\s+.*-[rRhHsS]'
  reason: attrib removing protection attributes

# ---------------------------------------------------------------------------
# WINDOWS PROCESS DESTRUCTION
# ---------------------------------------------------------------------------
- pattern: '\bStop-Process\s+.*-Force'
  reason: Stop-Process -Force (PowerShell kill -9)

- pattern: '\btaskkill\s+/[fF]'
  reason: taskkill /F (force kill)

- pattern: '\btaskkill\s+.*\/IM\s+\*'
  reason: taskkill targeting all processes

- pattern: '\bkill\s+.*-Force'
  reason: kill alias with -Force

# ---------------------------------------------------------------------------
# WINDOWS SYSTEM OPERATIONS
# ---------------------------------------------------------------------------
- pattern: '\bFormat-Volume'
  reason: Format-Volume (disk format)

- pattern: '\bformat\s+[a-zA-Z]:'
  reason: format command targeting drive

- pattern: '\bClear-Disk'
  reason: Clear-Disk (wipe disk)

- pattern: '\bInitialize-Disk'
  reason: Initialize-Disk (can destroy partitions)

# ---------------------------------------------------------------------------
# WINDOWS HISTORY/SHELL MANIPULATION
# ---------------------------------------------------------------------------
- pattern: '\bClear-History'
  reason: Clear-History (PowerShell history clear)

- pattern: '\bdoskey\s+/reinstall'
  reason: doskey /reinstall (cmd history clear)

# ---------------------------------------------------------------------------
# WINDOWS REGISTRY (dangerous)
# ---------------------------------------------------------------------------
- pattern: '\bRemove-ItemProperty\s+.*HKLM:'
  reason: Removing HKEY_LOCAL_MACHINE registry keys

- pattern: '\bRemove-Item\s+.*HKLM:'
  reason: Removing HKEY_LOCAL_MACHINE registry paths

- pattern: '\breg\s+delete\s+HKLM'
  reason: reg delete on HKEY_LOCAL_MACHINE

- pattern: '\breg\s+delete\s+.*\/f'
  reason: reg delete with force flag
```

### Step 5: Write Updated Patterns

9. Write the updated patterns.yaml with Windows patterns added

10. Show the user what was added

### Step 6: Restart Reminder

11. **IMPORTANT**: Tell the user:

> **Restart your agent for these changes to take effect.**

## Report

Present the update summary:

---

## Damage Control Updated for Windows

**Installation Level**: [Global/Project/Project Personal]
**Patterns File**: `[PATTERNS_FILE]`

### Windows Patterns Added

**PowerShell Destructive Operations**:
- `Remove-Item -Recurse/-Force`
- `ri`, `del` aliases with recursive flags

**cmd Destructive Operations**:
- `rd /s`, `rmdir /s`
- `del /f /s`, `erase`

**Permission Changes**:
- `icacls` granting full control
- `takeown` with recursive flag

**Process Destruction**:
- `Stop-Process -Force`
- `taskkill /F`

**System Operations**:
- `Format-Volume`, `format`
- `Clear-Disk`, `Initialize-Disk`

**Registry Protection**:
- `Remove-ItemProperty` on HKLM
- `reg delete` on HKLM

### Existing Unix Patterns

All existing Unix patterns have been preserved. Your patterns.yaml now works on both Unix and Windows.

### IMPORTANT

**Restart your agent for these changes to take effect.**

### Next Steps

1. Review the updated patterns.yaml
2. Add any additional Windows-specific paths to protect
3. Test with: "test damage control"
