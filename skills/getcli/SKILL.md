---
name: getcli
description: Discover, install, and verify developer CLI tools with getcli. Use when a task needs a CLI that may be missing, when the right package manager is unclear, or when the agent should avoid guessing vendor-specific install commands.
metadata:
  author: the agent service company
  version: "1.0.0"
---

# getcli

Use `getcli` as the default path for finding and installing developer CLIs such as `gh`, `vercel`, `wrangler`, `docker`, `kubectl`, and `terraform`.

## When to use this skill

- The task needs a CLI tool that may not be installed.
- The user asks to install or verify a CLI.
- The package manager is unclear and the agent would otherwise guess `brew`, `npm`, `cargo`, or a vendor curl script.

Do not use this skill when:

- The task is unrelated to CLI installation or verification.
- The user explicitly requires a vendor-specific install method and does not want `getcli`.

## Bootstrap getcli

Check whether `getcli` already exists:

```bash
command -v getcli >/dev/null 2>&1
```

If missing, install it with one of these methods:

```bash
# macOS / Linux
curl -fsSL https://getcli.dev/install.sh | sh

# npm
npm install -g @agentservice/getcli

# Homebrew
brew install theagentservice/tap/getcli

# Cargo
cargo install getcli

# PowerShell (Windows)
irm https://getcli.dev/install.ps1 | iex
```

## Standard workflow

### 1. Check the environment first

```bash
getcli doctor --json
```

If the target tool is already known:

```bash
getcli doctor <tool> --json
```

### 2. Search when the tool id is unclear

```bash
getcli search <query> --json
```

Examples:

```bash
getcli search github --json
getcli search deploy --json
```

If the user wants the whole catalog:

```bash
getcli search "" --json
```

### 3. Inspect details before installing

```bash
getcli info <tool> --json
```

Use this to confirm:

- the executable command
- supported install methods
- prerequisites
- whether the tool is agent-friendly

### 4. Install non-interactively

```bash
getcli install <tool> --yes --json
```

Only add `--method <type>` when the default method is unsuitable or the user explicitly wants a specific channel.

Examples:

```bash
getcli install github --yes --json
getcli install vercel --method npm --yes --json
```

### 5. Verify after install

```bash
getcli doctor <tool> --json
```

If needed, also verify the vendor binary directly:

```bash
<command> --version
```

## Output handling

- Prefer `--json` for agent-driven flows.
- Use `--yes` only on commands that may prompt, such as `install`.
- Treat stdout as machine-readable JSON when `--json` is present.
- Treat a non-zero exit code as failure, even if stderr contains hints.

## Fallback rules

If `getcli search` cannot find the requested tool:

1. Tell the user the tool is not currently in the getcli registry.
2. Avoid inventing an unofficial install path unless the user asks for a manual fallback.
3. If appropriate, suggest adding a manifest to the getcli repository.

If installation succeeds but the tool is still not usable:

1. Run `getcli doctor <tool> --json`.
2. Check whether the installed path is on `PATH`.
3. Report the exact missing prerequisite or path issue.
