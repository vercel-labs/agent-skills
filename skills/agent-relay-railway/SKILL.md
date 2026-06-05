---
name: agent-relay-railway
description: Deploy and operate a self-hosted Agent Relay instance on Railway with PostgreSQL and S3. Use when self-hosting arelay, deploying mmmikael/arelay to Railway, configuring WEBAUTHN_ORIGIN, DATABASE_URL, S3, or troubleshooting Agent Relay production on Railway.
license: MIT
metadata:
  author: mmmikael
  version: "1.0.0"
---

# Agent Relay on Railway

Deploy [Agent Relay](https://github.com/mmmikael/arelay) — SvelteKit inbox + agent HTTP API.

## Prerequisites

- Railway CLI authenticated (`railway login`, `railway whoami`)
- GitHub repo linked or `railway up` from clone
- PostgreSQL plugin on the project
- S3-compatible storage (AWS S3 or compatible)

## Railway setup

1. Create service from `github.com/mmmikael/arelay`
2. Add PostgreSQL → link `DATABASE_URL`
3. Set required variables (see below)
4. Build: `npm run build` — Start: `npm start`
5. Attach custom domain or use `RAILWAY_PUBLIC_DOMAIN` for `AGENT_RELAY_URL`

## Required environment variables

| Variable | Notes |
| --- | --- |
| `SESSION_SECRET` | `openssl rand -hex 32` |
| `DATABASE_URL` | From Railway PostgreSQL |
| `NODE_ENV` | `production` |
| `WEBAUTHN_RP_ID` | Apex domain, e.g. `arelay.app` |
| `WEBAUTHN_ORIGIN` | `https://arelay.app` (must match browser origin) |
| `S3_BUCKET`, `S3_REGION`, `S3_ACCESS_KEY`, `S3_SECRET_KEY` | Artifact storage |
| `S3_ENDPOINT` | e.g. `https://s3.ap-southeast-1.amazonaws.com` for that region |
| `S3_PREFIX` | Default `agent-relay` |
| `EMAIL_FROM` + Cloudflare or SMTP | Account verification in production |

Optional: `SESSION_VERSION` to invalidate sessions after secret rotation.

## S3 region pitfall

Bucket region must match `S3_REGION` and `S3_ENDPOINT`. Wrong region causes `PermanentRedirect` on artifact upload.

## Agent URL for deliverables

Set agents to:

```
AGENT_RELAY_URL=https://<your-domain>
```

Use the **exact** Railway public domain until custom domain is live. Do not guess Railway hostnames.

## Verify deployment

```bash
railway status --json
railway logs --lines 100
curl -s -o /dev/null -w "%{http_code}" "$AGENT_RELAY_URL/"
```

Human: create passkey at `/`, generate agent token in account menu.

## Database

Schema is applied on boot (`ensureSchema`). For local setup pattern:

```bash
npm run db:setup
```

## IAM

Minimal S3 policy scoped to prefix: `scripts/iam-agent-relay-s3-policy.json` in the arelay repo.

## Operations

```bash
railway variable list --json
railway logs --lines 200
railway up --detach -m "deploy"
```

## Reference

- App README: [github.com/mmmikael/arelay](https://github.com/mmmikael/arelay)
- Hosted alternative: [arelay.app](https://arelay.app)
