---
model: opus
description: Interactive workflow to modify existing Damage Control security settings
---

# Purpose

Guide the user through modifying their Damage Control security configuration. Allows adding/removing protected paths, blocking new commands, and adjusting protection levels.

## Variables

SKILL_DIR: .claude/skills/damage-control
GLOBAL_SETTINGS: ~/.claude/settings.json
GLOBAL_PATTERNS: ~/.claude/hooks/damage-control/patterns.yaml
PROJECT_SETTINGS: .claude/settings.json
PROJECT_PATTERNS: .claude/hooks/damage-control/patterns.yaml
LOCAL_SETTINGS: .claude/settings.local.json

## Instructions

- Use the AskUserQuestion tool at each decision point
- Always verify settings exist before attempting modifications
- If no settings found, redirect to install workflow
- Backup patterns.yaml before making changes
- Validate YAML syntax after modifications
- Show before/after comparison for user confirmation

## Workflow

### Step 1: Determine Settings Level

1. Use AskUserQuestion:

```
Question: "Which settings level do you want to modify?"
Options:
- Global (all projects) - ~/.claude/
- Project (shared with team) - .claude/
- Project Personal - .claude/settings.local.json
```

2. Store choice and set paths:
   - **Global**: SETTINGS=`~/.claude/settings.json`, PATTERNS=`~/.claude/hooks/damage-control/patterns.yaml`
   - **Project**: SETTINGS=`.claude/settings.json`, PATTERNS=`.claude/hooks/damage-control/patterns.yaml`
   - **Local**: SETTINGS=`.claude/settings.local.json`, PATTERNS=`.claude/hooks/damage-control/patterns.yaml`

### Step 2: Verify Installation Exists

3. Use Read tool to check if SETTINGS and PATTERNS files exist

4. **If either file doesn't exist**:
   - Report: "Damage Control is not installed at this level."
   - Use AskUserQuestion:
   ```
   Question: "Would you like to install Damage Control now?"
   Options:
   - Yes, install it
   - No, cancel
   ```
   - If Yes: Read and execute [install_damage_control_ag_workflow.md](install_damage_control_ag_workflow.md)
   - If No: Exit workflow

5. **If both files exist**: Continue to Step 3

### Step 3: Determine Modification Type

6. Use AskUserQuestion:

```
Question: "What would you like to modify?"
Options:
- Add/Remove Protected Paths (restrict file/directory access)
- Add/Remove Blocked Commands (block specific bash commands)
- View Current Configuration
```

### Branch A: Modify Protected Paths

7. **If "Add/Remove Protected Paths"**: Use AskUserQuestion:

```
Question: "What action would you like to take?"
Options:
- Add a new protected path
- Remove an existing protected path
- List all protected paths
```

8. **Add new protected path**:
   a. Use AskUserQuestion:
   ```
   Question: "What protection level should this path have?"
   Options:
   - Zero Access (no operations allowed - for secrets/credentials)
   - Read Only (can read, cannot modify - for configs)
   - No Delete (can read/write/edit, cannot delete - for important files)
   ```

   b. Use AskUserQuestion (text input expected via "Other"):
   ```
   Question: "Enter the path to protect (e.g., ~/.aws/, /etc/passwd, ./config/):"
   Options:
   - ~/.ssh/ (common secrets directory)
   - ~/.aws/ (cloud credentials)
   - Other (enter custom path)
   ```

   c. Read current patterns.yaml

   d. Add path to appropriate section:
      - Zero Access → `zeroAccessPaths`
      - Read Only → `readOnlyPaths`
      - No Delete → `noDeletePaths`

   e. Write updated patterns.yaml

   f. Show confirmation with before/after

9. **Remove protected path**:
   a. Read patterns.yaml and list all protected paths
   b. Use AskUserQuestion to select path to remove
   c. Remove path from appropriate section
   d. Write updated patterns.yaml

10. **List protected paths**:
    a. Read patterns.yaml
    b. Display formatted list of all paths by category

### Branch B: Modify Blocked Commands

11. **If "Add/Remove Blocked Commands"**: Use AskUserQuestion:

```
Question: "What action would you like to take?"
Options:
- Add a new blocked command pattern
- Remove an existing pattern
- List all blocked patterns
```

12. **Add new blocked pattern**:
    a. Use AskUserQuestion:
    ```
    Question: "How would you like to specify the command to block?"
    Options:
    - Enter exact command (e.g., "npm publish")
    - Describe in natural language (I'll create the regex)
    ```

    b. **If exact command**:
       - Escape special regex characters
       - Create pattern: `\b[escaped_command]\b`
       - Ask for reason/description

    c. **If natural language**:
       - Parse description
       - Generate appropriate regex pattern
       - Show pattern to user for confirmation

    d. Read patterns.yaml

    e. Add to `bashToolPatterns`:
    ```yaml
    - pattern: '[generated_pattern]'
      reason: '[user_reason]'
    ```

    f. Write updated patterns.yaml

13. **Remove pattern**:
    a. Read patterns.yaml and list all patterns
    b. Use AskUserQuestion to select pattern to remove
    c. Remove pattern
    d. Write updated patterns.yaml

### Branch C: View Configuration

14. **If "View Current Configuration"**:
    a. Read patterns.yaml
    b. Read settings.json
    c. Display formatted configuration

### Step 4: Confirm and Apply Changes

15. After any modification, show the change:

```
## Proposed Change

**File**: [PATTERNS or SETTINGS]

**Before**:
[relevant section before]

**After**:
[relevant section after]
```

16. Use AskUserQuestion:
```
Question: "Apply this change?"
Options:
- Yes, apply
- No, cancel
```

17. **If Yes**: Write the changes
18. **If No**: Discard changes and report cancellation

### Step 5: Restart Reminder

19. **IMPORTANT**: After any modifications are applied, you MUST tell the user:

> **Restart your agent for these changes to take effect.**

This is critical - hooks and patterns are only loaded at agent startup.

## Report

Present the modification summary:

## Damage Control Configuration Updated

**Settings Level**: [Global/Project/Project Personal]
**Modification Type**: [Path Protection/Command Blocking/View]

### Changes Made

[For Path Protection]
**Action**: Added/Removed path
**Path**: `[path]`
**Protection Level**: [Zero Access/Read Only/No Delete]

[For Command Blocking]
**Action**: Added/Removed pattern
**Pattern**: `[pattern]`
**Reason**: [reason]

### Current Configuration Summary

**Zero Access Paths** (no operations):
- [list paths]

**Read Only Paths** (read only):
- [list paths]

**No Delete Paths** (no delete):
- [list paths]

**Blocked Command Patterns**: [count] patterns

### IMPORTANT

**Restart your agent for these changes to take effect.**

### Verification
The changes have been written to:
- `[PATTERNS file path]`

Run `/hooks` after restart to verify the changes are active.
