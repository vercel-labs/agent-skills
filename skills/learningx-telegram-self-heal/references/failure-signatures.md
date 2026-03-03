# Failure Signatures

## Telegram polling conflict (409)

Symptom:
- `getUpdates error 409: Conflict: terminated by other getUpdates request`

Fix direction:
- Ensure a single long-polling bot instance.
- Clear webhook if polling is active.
- Verify Railway replica count is 1 for polling bot path.

## Unauthorized Codex replies

Symptom:
- Telegram shows `Codex 응답 실패: Unauthorized.`

Fix direction:
- Keep dashboard password gate.
- Allow server-to-server auth only for `/api/codex/chat`.
- Set same `ADMIN_BACKEND_BOT_TOKEN` in `lx-agent` and `admin-dashboard`.

## Missing `model.request` scope

Symptom:
- Upstream error includes `Missing scopes: model.request`.

Fix direction:
- Retry through ChatGPT codex responses endpoint as fallback.

## English courses missing from selectors

Symptom:
- `/assignments` selector omits English course names in the same term.

Fix direction:
- Infer target term with semester text, then expand by dominant `enrollment_term_id`.
