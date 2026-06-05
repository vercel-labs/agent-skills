# Agent Relay API examples

Set `AGENT_RELAY_URL` and `AGENT_API_TOKEN` in the agent environment before running these examples.

## curl — Markdown + image

```bash
BASE="$AGENT_RELAY_URL"
TOKEN="$AGENT_API_TOKEN"

SESSION=$(curl -s -X POST "$BASE/api/agent/sessions" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Weekly report","summary":"Metrics and chart"}' \
  | jq -r '.session.id')

curl -s -X POST "$BASE/api/agent/sessions/$SESSION/artifacts" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"filename":"report.md","content_type":"text/markdown","content":"# Weekly report\n\nAll good."}'

curl -s -X POST "$BASE/api/agent/sessions/$SESSION/artifacts" \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@./chart.png"
```

## Python

Use the same two environment variables. Example with explicit values (substitute from your host env):

```python
import requests

relay_url = "https://arelay.app"  # AGENT_RELAY_URL
api_token = "ar_your_token_here"  # AGENT_API_TOKEN

BASE = relay_url.rstrip("/")
HEADERS = {"Authorization": f"Bearer {api_token}"}

r = requests.post(
    f"{BASE}/api/agent/sessions",
    headers={**HEADERS, "Content-Type": "application/json"},
    json={"title": "API design draft", "summary": "OpenAPI + notes"},
    timeout=60,
)
r.raise_for_status()
session_id = r.json()["session"]["id"]

requests.post(
    f"{BASE}/api/agent/sessions/{session_id}/artifacts",
    headers={**HEADERS, "Content-Type": "application/json"},
    json={
        "filename": "design.md",
        "content_type": "text/markdown",
        "content": "# API design\n\n...",
    },
    timeout=60,
).raise_for_status()

with open("diagram.png", "rb") as f:
    requests.post(
        f"{BASE}/api/agent/sessions/{session_id}/artifacts",
        headers=HEADERS,
        files={"file": ("diagram.png", f, "image/png")},
        timeout=120,
    ).raise_for_status()
```
