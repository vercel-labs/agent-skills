---
model: opus
description: Provide manual guidance for configuring Damage Control without automated workflows
---

# Purpose

Explain how to manually configure the Damage Control security hooks system. Provides documentation and guidance without executing automated workflows - for users who prefer direct control.

## Variables

None (informational only)

## Instructions

- First ask what the user wants to learn about
- Provide clear, detailed explanations
- Show exact file paths and formats
- Include copy-paste examples
- Do NOT execute any installation or modification commands
- This is purely educational/documentation

## Workflow

### Step 1: Understand User's Goal

1. Use AskUserQuestion:

```
Question: "What would you like to learn about Damage Control?"
Options:
- Understand the system architecture
- Learn how to edit patterns.yaml
- Learn how to edit settings.json
- Learn how to test the hooks
- See all file locations
```

### Branch A: System Architecture

2. **If "Understand the system architecture"**:

Explain the following:

---

## Damage Control Architecture

### Overview

Damage Control uses Claude Code's **hook system** to intercept tool calls before execution. It provides three layers of protection:

```
┌─────────────────────────────────────────────┐
│           Claude Code Tool Call              │
└─────────────────────────────────────────────┘
                      │
    ┌─────────────────┼─────────────────┐
    ▼                 ▼                 ▼
┌─────────┐     ┌─────────┐     ┌─────────┐
│  Bash   │     │  Edit   │     │  Write  │
│  Tool   │     │  Tool   │     │  Tool   │
└────┬────┘     └────┬────┘     └────┬────┘
     │               │               │
     ▼               ▼               ▼
┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│ PreToolUse  │ │ PreToolUse  │ │ PreToolUse  │
│    Hook     │ │    Hook     │ │    Hook     │
└──────┬──────┘ └──────┬──────┘ └──────┬──────┘
       │               │               │
       ▼               ▼               ▼
  Exit 0 = Allow  Exit 0 = Allow  Exit 0 = Allow
  Exit 2 = BLOCK  Exit 2 = BLOCK  Exit 2 = BLOCK
```

### Hook Types

1. **PreToolUse Hooks**: Run before a tool executes
   - `bash-tool-damage-control` - Checks bash commands against patterns
   - `edit-tool-damage-control` - Checks edit paths
   - `write-tool-damage-control` - Checks write paths

2. **PermissionRequest Hooks**: Run when user confirmation is needed
   - `permission-request-damage-control` - Forces confirmation for DELETE operations

### Exit Codes

| Code | Meaning | Behavior |
|------|---------|----------|
| 0 | Allow | Tool call proceeds |
| 2 | Block | Tool call blocked, stderr shown to Claude |

### Configuration Files

| File | Purpose |
|------|---------|
| `settings.json` | Registers hooks with Claude Code |
| `patterns.yaml` | Defines blocked patterns and protected paths |

---

### Branch B: Editing patterns.yaml

3. **If "Learn how to edit patterns.yaml"**:

---

## Editing patterns.yaml

### File Location

The `patterns.yaml` file is in your hooks directory:

- **Global**: `~/.claude/hooks/damage-control/patterns.yaml`
- **Project**: `.claude/hooks/damage-control/patterns.yaml`

### File Structure

```yaml
# Dangerous bash command patterns
bashToolPatterns:
  - pattern: '\brm\s+-[rRf]'
    reason: rm with recursive or force flags
  - pattern: '\bgit\s+reset\s+--hard\b'
    reason: git reset --hard

# No access at all (secrets/credentials)
zeroAccessPaths:
  - ~/.ssh/
  - ~/.aws/
  - ~/.gnupg/

# Read allowed, modifications blocked
readOnlyPaths:
  - /etc/
  - ~/.bashrc
  - ~/.zshrc

# All operations except delete
noDeletePaths:
  - .claude/hooks/
  - .claude/commands/

# Audit log location
logFile: .claude/security-audit.log
```

### Adding a Blocked Pattern

To block a new command, add to `bashToolPatterns`:

```yaml
bashToolPatterns:
  # ... existing patterns ...
  - pattern: '\bnpm\s+publish\b'
    reason: npm publish blocked for safety
```

**Pattern Tips**:
- Use `\b` for word boundaries
- Use `\s+` for whitespace
- Escape special characters: `.` becomes `\.`
- Patterns are case-insensitive

### Adding a Protected Path

Choose the appropriate section based on protection level:

```yaml
# For secrets (block ALL access including reads)
zeroAccessPaths:
  - ~/.my-secrets/

# For configs (allow reads, block writes)
readOnlyPaths:
  - /my/config/dir/

# For important files (allow everything except delete)
noDeletePaths:
  - ./important-data/
```

### Validation

After editing, validate YAML syntax:
```bash
python -c "import yaml; yaml.safe_load(open('patterns.yaml'))"
```

---

### Branch C: Editing settings.json

4. **If "Learn how to edit settings.json"**:

---

## Editing settings.json

### File Locations

| Level | Path |
|-------|------|
| Global | `~/.claude/settings.json` |
| Project | `.claude/settings.json` |
| Project Personal | `.claude/settings.local.json` |

### Minimal Configuration

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/damage-control/bash-tool-damage-control.py",
            "timeout": 5
          }
        ]
      }
    ]
  }
}
```

### Full Configuration

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/damage-control/bash-tool-damage-control.py",
            "timeout": 5
          }
        ]
      },
      {
        "matcher": "Edit",
        "hooks": [
          {
            "type": "command",
            "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/damage-control/edit-tool-damage-control.py",
            "timeout": 5
          }
        ]
      },
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/damage-control/write-tool-damage-control.py",
            "timeout": 5
          }
        ]
      }
    ],
    "PermissionRequest": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/damage-control/permission-request-damage-control.py",
            "timeout": 5
          }
        ]
      }
    ]
  },
  "permissions": {
    "deny": [
      "Bash(rm -rf /*:*)",
      "Bash(rm -rf ~/*:*)",
      "Bash(sudo rm -rf:*)"
    ],
    "ask": [
      "Bash(git push --force:*)",
      "Bash(git reset --hard:*)"
    ]
  }
}
```

### Key Points

- `$CLAUDE_PROJECT_DIR` resolves to the project root
- Use `.py` extension for Python, `.ts` for TypeScript
- `timeout` is in seconds
- `matcher` supports regex: `"Edit|Write"` matches both

---

### Branch D: Testing Hooks

5. **If "Learn how to test the hooks"**:

---

## Testing Damage Control Hooks

### Verify Hooks are Registered

In Claude Code, run:
```
/hooks
```

You should see your PreToolUse and PermissionRequest hooks listed.

### Manual Hook Testing

Test a hook directly from the command line:

```bash
echo '{"tool_name":"Bash","tool_input":{"command":"rm -rf /"}}' | \
  .claude/hooks/damage-control/bash-tool-damage-control.py

echo $?  # Should print 2 (blocked)
```

### Test in Claude Code

Try these commands (they should be blocked):

```bash
# Test bashToolPatterns blocking
rm -rf /tmp/test

# Test noDeletePaths
rm .claude/hooks/test.txt

# Test zeroAccessPaths
cat ~/.ssh/id_rsa
```

### Interactive Tester

If available, use the pattern tester:

```bash
cd .claude/hooks/damage-control
./tester.py
```

### Debug Mode

Run Claude Code with debug logging:

```bash
claude --debug
```

This shows hook execution details.

---

### Branch E: File Locations

6. **If "See all file locations"**:

---

## File Locations Reference

### Global Installation

```
~/.claude/
├── settings.json                    # Hook configuration
└── hooks/
    └── damage-control/
        ├── bash-tool-damage-control.py
        ├── edit-tool-damage-control.py
        ├── write-tool-damage-control.py
        ├── permission-request-damage-control.py
        └── patterns.yaml
```

### Project Installation

```
your-project/
└── .claude/
    ├── settings.json                # Hook configuration
    ├── settings.local.json          # Personal overrides (gitignored)
    └── hooks/
        └── damage-control/
            ├── bash-tool-damage-control.py
            ├── edit-tool-damage-control.py
            ├── write-tool-damage-control.py
            ├── permission-request-damage-control.py
            └── patterns.yaml
```

### Settings Precedence

1. **Managed settings** (Enterprise) - highest
2. **Local project** (`.claude/settings.local.json`)
3. **Shared project** (`.claude/settings.json`)
4. **User global** (`~/.claude/settings.json`) - lowest

---

## Report

Present the requested information in a clear, well-formatted manner. Include code blocks for copy-paste convenience and tables for quick reference.

**Note**: This workflow provides documentation only. No files are modified during this workflow.
