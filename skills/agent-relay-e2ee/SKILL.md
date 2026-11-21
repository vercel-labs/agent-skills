---
name: agent-relay-e2ee
description: Upload end-to-end encrypted sessions and artifacts to Agent Relay using P-256 ECDH and AES-256-GCM. Use when deliverables are sensitive, when GET /api/agent/e2ee/config returns configured, or when the human requires encrypted agent delivery to arelay.app.
license: MIT
metadata:
  author: mmmikael
  version: "1.0.0"
---

# Agent Relay E2EE uploads

The server stores only ciphertext. Decryption happens in the human's browser after they unlock their encryption key.

## Prerequisites

1. Human has set up encryption in the Agent Relay portal (passkey + recovery key).
2. Agent has `AGENT_RELAY_URL` and `AGENT_API_TOKEN` (same as plaintext API).

## Check encryption status

```http
GET /api/agent/e2ee/config
Authorization: Bearer <AGENT_API_TOKEN>
```

- **200** `{ "configured": true, "publicKeyJwk": { ... } }` → encrypt locally before upload
- **404** → ask human to enable encryption before sending sensitive content

## Envelope format

Each encrypted string or file uses:

```json
{
  "v": 1,
  "alg": "P-256-ECDH-A256GCM",
  "epk": { "kty": "EC", "crv": "P-256", "x": "...", "y": "..." },
  "iv": "base64url-no-padding",
  "ciphertext": "base64url-no-padding"
}
```

Use P-256 ECDH with the relay `publicKeyJwk`, derive AES-256-GCM key, fresh ephemeral key + IV per field/file.

**Important:** The browser uses Web Crypto `deriveKey(ECDH → AES-GCM)`. Hand-rolled Python `cryptography` ECDH/HKDF often produces incompatible ciphertext. Prefer the bundled reference script:

```bash
AGENT_RELAY_URL=https://arelay.app AGENT_API_TOKEN=ar_... \
  node scripts/e2ee-upload.mjs "Delivery title" "report.md" "# Report body"
```

(`scripts/e2ee-upload.mjs` ships with this skill.)

## Create encrypted session

```http
POST /api/agent/sessions
Content-Type: application/json

{
  "encrypted": true,
  "encrypted_title": { "...": "title envelope" },
  "encrypted_summary": { "...": "optional summary envelope" }
}
```

## Upload encrypted artifact

```http
POST /api/agent/sessions/<session_id>/artifacts
Content-Type: application/json

{
  "encrypted": true,
  "encrypted_filename": { "...": "filename envelope" },
  "encrypted_content_type": { "...": "content-type envelope" },
  "encrypted_payload": {
    "v": 1,
    "alg": "P-256-ECDH-A256GCM",
    "epk": { "...": "ephemeral public JWK" },
    "iv": "base64url-no-padding"
  },
  "ciphertext_base64": "base64url-no-padding",
  "size_bytes": 12345
}
```

`encrypted_payload` is the file envelope **without** `ciphertext`; file bytes go in `ciphertext_base64`.

## Storage limits

Same as plaintext: **25 MB** per artifact, **500 MB** per account.

## Plaintext fallback

If E2EE is not configured and content is not sensitive, use **agent-relay-api** for standard uploads.

## Reference

API endpoints: [agent-relay-api/references/api-reference.md](../agent-relay-api/references/api-reference.md)
