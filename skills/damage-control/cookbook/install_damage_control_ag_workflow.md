---
model: opus
description: Interactive workflow to install the Damage Control security hooks system
---

# Purpose

Guide the user through installing the Damage Control security hooks system at their chosen settings level (global, project, or project personal). Uses interactive prompts to determine runtime preference and handle conflicts.

## Variables

SKILL_DIR: .claude/skills/damage-control
PATTERNS_FILE: SKILL_DIR/patterns.yaml
GLOBAL_SETTINGS: ~/.claude/settings.json
PROJECT_SETTINGS: .claude/settings.json
LOCAL_SETTINGS: .claude/settings.local.json

## Instructions

- Use the AskUserQuestion tool at each decision point to guide the user
- Check for existing settings before installation
- Handle merge/overwrite conflicts gracefully
- Copy the appropriate hook implementation (Python or TypeScript)
- Ensure the patterns.yaml file is included with the hooks
- Verify installation by checking file existence after copy

## Workflow

### Step 1: Determine Installation Level

1. Use AskUserQuestion to ask the user where they want to install:

```
Question: "Where would you like to install Damage Control?"
Options:
- Global (affects all projects) - ~/.claude/settings.json
- Project (shared with team) - .claude/settings.json
- Project Personal (just for you) - .claude/settings.local.json
```

2. Store the chosen path as TARGET_SETTINGS

### Step 2: Check for Existing Settings

3. Use the Read tool to check if TARGET_SETTINGS exists

4. **If settings file does NOT exist**: Proceed to Step 3 (Fresh Install)

5. **If settings file EXISTS**: Use AskUserQuestion:

```
Question: "Existing settings found at [TARGET_SETTINGS]. How would you like to proceed?"
Options:
- Merge (combine existing hooks with damage-control)
- Overwrite (replace with damage-control settings)
- Stop (cancel installation)
```

6. Handle the response:
   - **Merge**: Read existing file, merge hooks arrays, write combined result
   - **Overwrite**: Proceed to Step 3 (Fresh Install)
   - **Stop**: Report "Installation cancelled" and exit workflow

### Step 3: Choose Runtime

7. Use AskUserQuestion:

```
Question: "Which runtime would you like to use?"
Options:
- Python with UV (Recommended) - Lightweight, fast startup
- TypeScript with Bun - If you prefer TypeScript
```

8. Store choice as RUNTIME ("python" or "typescript")

### Step 4: Install Hook Files

9. Based on RUNTIME, determine source directory:
   - Python: `${SKILL_DIR}/hooks/damage-control-python/`
   - TypeScript: `${SKILL_DIR}/hooks/damage-control-typescript/`

10. Determine target hooks directory based on TARGET_SETTINGS:
    - Global: `~/.claude/hooks/damage-control/`
    - Project/Local: `.claude/hooks/damage-control/`

11. Create target hooks directory if it doesn't exist:
```bash
mkdir -p [TARGET_HOOKS_DIR]
```

12. Copy hook scripts from runtime-specific directory:
```bash
cp [SOURCE_DIR]/*.py [TARGET_HOOKS_DIR]/   # For Python
# OR
cp [SOURCE_DIR]/*.ts [TARGET_HOOKS_DIR]/   # For TypeScript
```

13. Copy the shared patterns.yaml from skill root:
```bash
cp SKILL_DIR/patterns.yaml [TARGET_HOOKS_DIR]/
```

### Step 5: Install Settings Configuration

14. Read the appropriate settings template:
    - Python: `${SKILL_DIR}/hooks/damage-control-python/python-settings.json`
    - TypeScript: `${SKILL_DIR}/hooks/damage-control-typescript/typescript-settings.json`

15. **For Fresh Install or Overwrite**:
    - Write the settings template to TARGET_SETTINGS
    - Update paths in settings.json to match TARGET_HOOKS_DIR

16. **For Merge**:
    - Parse existing settings JSON
    - Parse template settings JSON
    - Merge hooks.PreToolUse arrays (append damage-control hooks)
    - Merge hooks.PermissionRequest arrays
    - Merge permissions.deny and permissions.ask arrays
    - Write merged result to TARGET_SETTINGS

### Step 6: Verify Installation

17. Verify all files exist:
```bash
ls -la [TARGET_HOOKS_DIR]/
```

18. Verify settings file was created/updated:
```bash
cat [TARGET_SETTINGS] | head -20
```

19. Make hook scripts executable:
```bash
chmod +x [TARGET_HOOKS_DIR]/*.py [TARGET_HOOKS_DIR]/*.ts 2>/dev/null || true
```

### Step 7: Display Runtime Install Instructions

20. Based on RUNTIME, display install command:

**Python (UV)**:
```
# macOS/Linux
curl -LsSf https://astral.sh/uv/install.sh | sh

# Windows (PowerShell)
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
```

**TypeScript (Bun)**:
```
# macOS/Linux
curl -fsSL https://bun.sh/install | bash
bun add yaml

# Windows (PowerShell)
powershell -c "irm bun.sh/install.ps1 | iex"
bun add yaml
```

### Step 8: Restart Reminder

21. **IMPORTANT**: After all installation steps are complete, you MUST tell the user:

> **Restart your agent for these changes to take effect.**

This is critical - hooks are only loaded at agent startup.

### Step 9: Show Configuration Summary

22. Read and execute [list_damage_controls.md](list_damage_controls.md) to display all active Damage Control configurations across all levels.

## Report

Present the installation summary:

## Damage Control Installation Complete

**Installation Level**: [Global/Project/Project Personal]
**Settings File**: `[TARGET_SETTINGS]`
**Hooks Directory**: `[TARGET_HOOKS_DIR]`
**Runtime**: [Python/UV or TypeScript/Bun]

### Files Installed
- `bash-tool-damage-control.[py|ts]` - Command pattern blocking
- `edit-tool-damage-control.[py|ts]` - Edit path protection
- `write-tool-damage-control.[py|ts]` - Write path protection
- `permission-request-damage-control.[py|ts]` - SQL DELETE confirmation
- `patterns.yaml` - Security patterns and protected paths

### Runtime Setup
[Display appropriate install command based on runtime]

### IMPORTANT

**Restart your agent for these changes to take effect.**

### Next Steps
1. Run `/hooks` to verify hooks are registered
2. Customize `patterns.yaml` to add your own protected paths

### Test the Installation
```
Try running: rm -rf /tmp/test
Expected: Command should be blocked by damage-control hooks
```
