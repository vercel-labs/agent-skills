---
model: opus
description: Test all Damage Control hooks by running the test script against patterns.yaml
---

# Purpose

Validate that all Damage Control hooks are working correctly by reading patterns.yaml and running test cases against each configured pattern and protected path.

## Variables

HOOKS_DIR: .claude/hooks/damage-control
PATTERNS_FILE: .claude/hooks/damage-control/patterns.yaml (if in project) or ~/.claude/hooks/damage-control/patterns.yaml (if global)

## Instructions

- Read the patterns.yaml file to get all configured patterns and paths
- For each pattern/path, call the test script with appropriate arguments
- The test script echoes JSON into the hooks - it does NOT run actual commands
- Track pass/fail counts and report summary at the end
- Use the Python test script (`uv run test-damage-control.py`) or TypeScript (`bun run test-damage-control.ts`)

**IMPORTANT**: You are testing the hooks by piping mock data into them. DO NOT run actual dangerous commands. No actual dangerous commands are executed.

## Workflow

### Step 0: See if you're in a project or global

1. Check if the current working directory is a project or global
   - If project → set PATTERNS_FILE to .claude/hooks/damage-control/patterns.yaml
   - If global → set PATTERNS_FILE to ~/.claude/hooks/damage-control/patterns.yaml

### Step 1: Determine Runtime

1. Check which runtime is installed by looking at the hooks directory:
   - If `.py` files exist → use `uv run test-damage-control.py`
   - If `.ts` files exist → use `bun run test-damage-control.ts`

2. Set TEST_CMD to the appropriate command

### Step 2: Read Configuration

3. Read the patterns.yaml file from HOOKS_DIR

4. Extract the following sections:
   - `bashToolPatterns` - command patterns to block
   - `zeroAccessPaths` - paths with no access allowed
   - `readOnlyPaths` - paths with read-only access
   - `noDeletePaths` - paths that cannot be deleted

### Step 3: Test bashToolPatterns

5. For each pattern in `bashToolPatterns`, generate a test command that matches the pattern:

| Pattern                    | Test Command                      |
| -------------------------- | --------------------------------- |
| `\brm\s+-[rRf]`            | `rm -rf /tmp/test`                |
| `\bgit\s+reset\s+--hard`   | `git reset --hard HEAD`           |
| `\bgit\s+push\s+.*--force` | `git push --force origin main`    |
| `\bchmod\s+.*777`          | `chmod 777 /tmp/test`             |
| `\bDELETE\s+FROM`          | `sqlite3 db 'DELETE FROM users;'` |

6. Run each test:
```bash
uv run [HOOKS_DIR]/test-damage-control.py bash Bash "[test_command]" --expect-blocked
```

7. Also test that safe commands are allowed:
```bash
uv run [HOOKS_DIR]/test-damage-control.py bash Bash "ls -la" --expect-allowed
uv run [HOOKS_DIR]/test-damage-control.py bash Bash "git status" --expect-allowed
```

### Step 4: Test zeroAccessPaths

8. For each path in `zeroAccessPaths`, test that ALL access is blocked:

```bash
# Test bash access (read)
uv run [HOOKS_DIR]/test-damage-control.py bash Bash "cat [path]/test" --expect-blocked

# Test edit access
uv run [HOOKS_DIR]/test-damage-control.py edit Edit "[path]/test.txt" --expect-blocked

# Test write access
uv run [HOOKS_DIR]/test-damage-control.py write Write "[path]/test.txt" --expect-blocked
```

### Step 5: Test readOnlyPaths

9. For each path in `readOnlyPaths`, test that reads are allowed but writes are blocked:

```bash
# Test bash read - should be ALLOWED
uv run [HOOKS_DIR]/test-damage-control.py bash Bash "cat [path]" --expect-allowed

# Test bash write - should be BLOCKED
uv run [HOOKS_DIR]/test-damage-control.py bash Bash "echo test > [path]/test" --expect-blocked

# Test edit - should be BLOCKED
uv run [HOOKS_DIR]/test-damage-control.py edit Edit "[path]/test.txt" --expect-blocked

# Test write - should be BLOCKED
uv run [HOOKS_DIR]/test-damage-control.py write Write "[path]/test.txt" --expect-blocked
```

### Step 6: Test noDeletePaths

10. For each path in `noDeletePaths`, test that deletes are blocked but writes are allowed:

```bash
# Test bash delete - should be BLOCKED
uv run [HOOKS_DIR]/test-damage-control.py bash Bash "rm [path]/test.txt" --expect-blocked

# Test bash write - should be ALLOWED (noDeletePaths allows writes)
uv run [HOOKS_DIR]/test-damage-control.py bash Bash "echo test > [path]/test.txt" --expect-allowed
```

### Step 7: Test PermissionRequest Hook

11. Test the PermissionRequest hook which forces user confirmation for risky operations.

The permission hook uses different output:
- `--expect-ask` = hook returns `{"decision": "ask"}` (forces user confirmation)
- `--expect-allow` = hook returns `{"decision": "allow"}` (auto-approves)

**SQL DELETE operations** - should force user confirmation:

```bash
# SQL DELETE with WHERE - should ASK for confirmation
uv run [HOOKS_DIR]/test-damage-control.py permission Bash "DELETE FROM users WHERE id=1" --expect-ask

# SQL DELETE FROM - should ASK
uv run [HOOKS_DIR]/test-damage-control.py permission Bash "sqlite3 test.db 'DELETE FROM users WHERE active=0'" --expect-ask
```

**MongoDB delete operations** - should force user confirmation:

```bash
# MongoDB deleteOne - should ASK
uv run [HOOKS_DIR]/test-damage-control.py permission Bash "db.users.deleteOne({id: 1})" --expect-ask

# MongoDB deleteMany - should ASK
uv run [HOOKS_DIR]/test-damage-control.py permission Bash "db.users.deleteMany({active: false})" --expect-ask
```

**Redis delete operations** - should force user confirmation:

```bash
# Redis DEL - should ASK
uv run [HOOKS_DIR]/test-damage-control.py permission Bash "redis-cli DEL mykey" --expect-ask

# Redis FLUSHDB - should ASK
uv run [HOOKS_DIR]/test-damage-control.py permission Bash "redis-cli FLUSHDB" --expect-ask
```

**Safe operations** - should auto-allow:

```bash
# SELECT query - should ALLOW
uv run [HOOKS_DIR]/test-damage-control.py permission Bash "SELECT * FROM users" --expect-allow

# Regular bash command - should ALLOW
uv run [HOOKS_DIR]/test-damage-control.py permission Bash "ls -la" --expect-allow

# Git command - should ALLOW
uv run [HOOKS_DIR]/test-damage-control.py permission Bash "git status" --expect-allow
```

### Step 8: Compile Results

12. Count total passed and failed tests
13. Present the summary report

## Report

Present results in this format:

---

## Damage Control Test Results

### bashToolPatterns
| Test | Command            | Expected | Result    |
| ---- | ------------------ | -------- | --------- |
| 1    | `rm -rf /tmp`      | BLOCKED  | PASS/FAIL |
| 2    | `git reset --hard` | BLOCKED  | PASS/FAIL |
| ...  | ...                | ...      | ...       |

### zeroAccessPaths
| Path    | Tool        | Expected | Result    |
| ------- | ----------- | -------- | --------- |
| ~/.ssh/ | Bash (read) | BLOCKED  | PASS/FAIL |
| ~/.ssh/ | Edit        | BLOCKED  | PASS/FAIL |
| ~/.ssh/ | Write       | BLOCKED  | PASS/FAIL |

### readOnlyPaths
| Path  | Tool         | Expected | Result    |
| ----- | ------------ | -------- | --------- |
| /etc/ | Bash (read)  | ALLOWED  | PASS/FAIL |
| /etc/ | Bash (write) | BLOCKED  | PASS/FAIL |
| /etc/ | Edit         | BLOCKED  | PASS/FAIL |

### noDeletePaths
| Path           | Tool          | Expected | Result    |
| -------------- | ------------- | -------- | --------- |
| .claude/hooks/ | Bash (delete) | BLOCKED  | PASS/FAIL |
| .claude/hooks/ | Bash (write)  | ALLOWED  | PASS/FAIL |

### PermissionRequest Hook
| Category | Command                      | Expected | Result    |
| -------- | ---------------------------- | -------- | --------- |
| SQL      | `DELETE FROM users WHERE...` | ASK      | PASS/FAIL |
| MongoDB  | `.deleteOne({...})`          | ASK      | PASS/FAIL |
| MongoDB  | `.deleteMany({...})`         | ASK      | PASS/FAIL |
| Redis    | `DEL mykey`                  | ASK      | PASS/FAIL |
| Redis    | `FLUSHDB`                    | ASK      | PASS/FAIL |
| Safe     | `SELECT * FROM users`        | ALLOW    | PASS/FAIL |
| Safe     | `ls -la`                     | ALLOW    | PASS/FAIL |

---

### Summary

**Total Tests**: [count]
**Passed**: [count]
**Failed**: [count]

[If all passed]
All Damage Control hooks are working correctly.

[If any failed]
Some tests failed. Review the failed tests above and check the hook implementations.
