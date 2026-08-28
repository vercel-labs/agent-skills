---
name: hol-guard-vercel
description: Use when an AI coding agent is about to deploy, promote, roll back, remove, or otherwise mutate Vercel resources and you want HOL Guard to inspect the exact Vercel CLI command before it executes.
---

# HOL Guard for Vercel CLI safety

Use HOL Guard as a pre-execution safety layer for Vercel CLI operations.

HOL Guard release/3.0 includes `command.platform.vercel` coverage for production-impacting Vercel operations such as removing deployments or projects and deploying, promoting, or rolling back production. It preserves safe inspection/help counterparts such as help, project inspection, and promotion status.

## Install

The Vercel command coverage currently lives in the HOL Guard 3.x prerelease channel:

```bash
pipx install --pip-args="--pre" hol-guard
hol-guard --version
```

If `pipx` is unavailable, do not silently install into the project's Python environment. Explain that an isolated CLI install is recommended.

## Prefer a protected agent runtime

Use HOL Guard's own detection result rather than maintaining a hand-written list of supported harness identifiers:

```bash
hol-guard detect --json
```

If detection reports a supported local coding-agent harness, use the exact identifier it returns when installing and launching the protected session so review/approval decisions can happen at the actual tool boundary:

```bash
hol-guard install <detected-harness>
hol-guard run <detected-harness> --dry-run
hol-guard run <detected-harness>
```

If detection reports no supported harness, do not claim the current session is protected and do not guess an adapter name.

## Preflight an exact Vercel command

Before a production-impacting Vercel CLI operation:

1. Build the exact `vercel` command that would otherwise run.
2. Do **not** execute it yet.
3. Inspect that exact command with HOL Guard:

```bash
hol-guard command test '<exact vercel command>' --json
```

4. Read the JSON result.
5. If the result is explicitly benign with minimum action `allow`, the command passed this command-safety preflight.
6. If the result requires `review` or `block`, or output is unknown/malformed, the CLI errors, or the check times out, do not bypass the decision. When running through a Guard-protected harness, let the Guard runtime own the review/approval flow. Otherwise stop and surface the exact command and Guard result to the user.

`hol-guard command test` is side-effect free. It classifies the command; it does not execute the Vercel command, create a final approval, evaluate the complete runtime policy, or record a receipt.

## Operations to inspect

Always inspect production-impacting operations, including:

- production deploys
- production promotion
- production rollback
- deployment removal
- project removal

Also inspect any Vercel command whose effect or target is unclear.

HOL Guard recognizes safe counterparts such as help, project inspection, and promotion status, but still use the exact command rather than paraphrasing it.

## Example

Before running:

```bash
vercel promote my-deployment.vercel.app
```

inspect it:

```bash
hol-guard command test 'vercel promote my-deployment.vercel.app' --json
```

If Guard requires review, do not rewrite or split the command to evade the result. Use the protected runtime's review path or stop for user review.

## Safety rules

- Never transform a blocked command just to make it pass.
- Never split one risky command into multiple commands to bypass a Guard decision.
- Never treat scanner or CLI failure as approval.
- Never read `.env` files to satisfy Guard.
- Do not claim HOL Guard is a native Vercel runtime integration. This skill applies HOL Guard's command-safety engine before Vercel CLI execution.
- Guard Cloud is optional for this workflow.
- Preserve the user's target project, team, scope, and CLI flags exactly when inspecting the command.

## Install this skill

```bash
npx skills add vercel-labs/agent-skills --skill hol-guard-vercel
```

HOL Guard: https://hol.org/guard
Source: https://github.com/hashgraph-online/hol-guard
