---
name: agent-relay-api
description: Deliver files and reports to a human via the Agent Relay HTTP API (arelay.app). Use when sending deliverables outside chat, creating inbox sessions, uploading Markdown/HTML/images/PDFs, or when the user mentions Agent Relay, arelay, or agent inbox delivery.
license: MIT
metadata:
  author: mmmikael
  version: "1.0.0"
---

# Agent Relay API

Deliver artifacts to the human's private inbox instead of email or chat attachments. Each delivery is a **session** (one thread); files are **artifacts**.

## When to use

- HTML pages, Markdown reports, images, PDFs, or multiple related files from one task
- Human should preview/download in the web portal

Do **not** use for short chat replies or secrets the human did not ask you to store.

## Configuration

Set in the agent environment (never commit):

| Variable | Value |
| --- | --- |
| `AGENT_RELAY_URL` | `https://arelay.app` or self-hosted base URL (no trailing slash). For Railway, use exact `RAILWAY_PUBLIC_DOMAIN` — wrong host returns 404. |
| `AGENT_API_TOKEN` | Bearer token from the human's Agent Relay account → Agent tokens |

Every request:

```http
Authorization: Bearer <AGENT_API_TOKEN>
```

## Workflow

1. `POST /api/agent/sessions` with `title` and optional `summary`
2. `POST /api/agent/sessions/<session_id>/artifacts` for each file
3. Optionally `PATCH /api/agent/sessions/<session_id>` to update summary
4. Tell the human: *"Sent to Agent Relay — session: \<title\>"* (no UUID needed)

One session per logical delivery. Re-use the same `session_id` for all files in that delivery.

## Upload methods

| Content | Method | Content-Type |
| --- | --- | --- |
| Markdown, HTML, text, JSON | JSON body with `content` | `application/json` |
| Images, PDFs, binaries | `multipart/form-data` field `file` | `multipart/form-data` |

JSON artifact fields: `filename`, `content_type`, `content` (required).

Common `content_type`: `text/markdown`, `text/html`, `text/plain`, `application/json`, `image/png`, `application/pdf`.

## Storage limits

- **25 MB** per artifact → `413`
- **500 MB** per account → `507`

## Errors

| Status | Meaning |
| --- | --- |
| `401` | Invalid or revoked token |
| `404` | Unknown session or E2EE not configured |
| `413` | File too large |
| `507` | Account quota full |
| `503` | S3 not configured on server |

Read `{ "error": "..." }` and report to the human.

## Checklist before finishing

- [ ] `title` is plain language; `summary` says what to open first
- [ ] Sensible `filename` extensions (`.md`, `.html`, `.png`, …)
- [ ] Text/HTML via JSON; binaries via multipart
- [ ] Human notified (portal refreshes in ~5 seconds)

## Examples

See [references/examples.md](references/examples.md) for curl and Python.

## Encrypted deliveries

If content is sensitive, load the **agent-relay-e2ee** skill and check `GET /api/agent/e2ee/config` first.

## Full reference

Endpoint details: [references/api-reference.md](references/api-reference.md)
