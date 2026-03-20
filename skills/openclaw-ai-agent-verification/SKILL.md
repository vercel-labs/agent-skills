---
name: openclaw-ai-agent-verification
description: Use this skill when you need to audit OpenClaw AI agent configurations for security risks. User cases: validating agent tool access, checking agent permissions, assessing agent message safety, reviewing agent skills, gate-checking agents before deployment, detecting prompt injection vulnerabilities, or evaluating agent orchestration security.
license: MIT
metadata:
  author: Cybercentry
  version: "1.0.0"
---

# OpenClaw AI Agent Verification

Audit AI agent configurations for security risks via Cybercentry ACP. Returns Critical/High/Medium/Low risk level.

## Workflow

- [ ] Step 1: Verify ACP CLI is installed
- [ ] Step 2: Verify wallet has USDC balance
- [ ] Step 3: Gather agent config, tool, skills, and message data
- [ ] Step 4: Create job with verification payload
- [ ] Step 5: Pay for job
- [ ] Step 6: Poll status until COMPLETED
- [ ] Step 7: Return risk assessment to user

## 1. Environment Setup

If `acp` command is unavailable:

```bash
git clone https://github.com/Virtual-Protocol/openclaw-acp && cd openclaw-acp && npm install && npm link
```

## 2. Identity & Wallet

```bash
acp setup                      # Create Agent Wallet (one-time)
acp wallet balance --json      # Verify USDC balance
```

## 3. Job Execution

```bash
# Create job
acp job create 0x228F7097fB812828a2F08EE29bAC0c58f9e0Bb63 openclaw-ai-agent-verification --requirements '{"tool": {"name": "TOOL_NAME", "args": {}}, "config": {}, "skills": "SKILLS_CONTENT", "message": "MESSAGE", "sessionId": "SESSION_ID"}' --json

# Pay for job
acp job pay <jobId> --accept true --json

# Poll until status is COMPLETED
acp job status <jobId> --json
```

## Requirements Schema

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `tool` | Object | No | Tool to validate (contains `name` and `args`) |
| `tool.name` | String | Yes | Tool name |
| `tool.args` | Object | Yes | Tool arguments |
| `config` | Object | Yes | Configuration (filename: openclaw.json or JSON content) |
| `skills` | String | No | Skills content (filename: SKILL.md or JSON content) |
| `message` | String | No | Message to validate |
| `sessionId` | String | No | Session identifier for tracking conversation context |

## Gotchas

- `config` is required. Pass the openclaw.json content or an empty object `{}`.
- `tool.args` must be an object, even if empty. Use `{}` not `null`.
- Large skills content should be stringified JSON, not raw markdown.
- Always use `--json` flag for machine-readable output. Parse `jobId` from create response.
- Poll `job status` every 5 seconds. Job typically completes within 30 seconds.
- Only use wallet `0x228F7097fB812828a2F08EE29bAC0c58f9e0Bb63` — do not use `acp browse`.
