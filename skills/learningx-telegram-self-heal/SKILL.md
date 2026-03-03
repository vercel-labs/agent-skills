---
name: learningx-telegram-self-heal
description: Diagnose and fix lx-agent Telegram + LearningX regressions quickly. Use when users report getUpdates 409 conflicts, Codex Unauthorized/scope failures, missing course selector entries, or Railway deployment drift.
license: MIT
metadata:
  author: guzus
  version: "1.0.0"
  argument-hint: "[--api-check]"
---

# LearningX Telegram Self-Heal

Deterministic self-heal workflow for Telegram + LearningX bot incidents in the `lx-agent` stack.

## How It Works

1. Collect evidence from logs and code before editing.
2. Map symptoms to known failure signatures.
3. Apply minimal, targeted fixes.
4. Run production-readiness validation.
5. Deploy both services and verify post-deploy behavior.

## Usage

```bash
bash /mnt/skills/user/learningx-telegram-self-heal/scripts/verify-readiness.sh
```

With live API checks:

```bash
ADMIN_URL="https://admin-dashboard-production-da11.up.railway.app" \
ADMIN_BACKEND_BOT_TOKEN="<token>" \
bash /mnt/skills/user/learningx-telegram-self-heal/scripts/verify-readiness.sh --api-check
```

## Arguments

- `--api-check` - additionally verify `/api/codex/chat` auth behavior against production (`401` without token, `200` with token).

## Output

The script writes machine-readable JSON to stdout:

```json
{"ok":true,"steps":["go-test","admin-typecheck","admin-build"],"apiCheck":false}
```

On failure, it writes JSON with `ok:false` and exits non-zero.

## Present Results to User

Return:
1. Root cause (1-2 sentences)
2. Evidence (specific log/API lines)
3. Files changed
4. Validation results
5. Deployment IDs and status
6. Residual risk

## Troubleshooting

- `getUpdates ... 409 Conflict`: ensure only one polling instance and clear webhook if polling mode is used.
- `Codex 응답 실패: Unauthorized.`: verify `ADMIN_BACKEND_BOT_TOKEN` is set identically in `lx-agent` and `admin-dashboard`.
- `Missing scopes: model.request`: ensure backend fallback path to ChatGPT codex responses is active.
- Missing English courses in selectors: use term expansion via `enrollment_term_id` rather than name-only semester text matching.

## References

- `references/failure-signatures.md`
