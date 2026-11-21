# Agent Relay API reference

Base: `{AGENT_RELAY_URL}`

## Create session

```http
POST /api/agent/sessions
Content-Type: application/json

{
  "title": "Short human-readable title",
  "summary": "Optional one-line description"
}
```

**201:** `{ "session": { "id", "title", "summary", "created_at", "updated_at" } }`

## Upload artifact (JSON)

```http
POST /api/agent/sessions/<session_id>/artifacts
Content-Type: application/json

{
  "filename": "report.md",
  "content_type": "text/markdown",
  "content": "# Title\n\nBody..."
}
```

**201:** `{ "artifact": { "id", "session_id", "filename", "content_type", "size_bytes", "created_at" } }`

## Upload artifact (multipart)

```http
POST /api/agent/sessions/<session_id>/artifacts
Content-Type: multipart/form-data

file=<binary>
filename=optional-override.png
```

## Update session

```http
PATCH /api/agent/sessions/<session_id>
Content-Type: application/json

{ "title": "...", "summary": "..." }
```

## List sessions

```http
GET /api/agent/sessions
```

Returns `{ "sessions": [ ... ] }` by `updated_at` descending.
