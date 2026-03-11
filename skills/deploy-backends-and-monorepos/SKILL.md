---
name: deploy-backends-and-monorepos
description: Building multi-service projects using Vercel's experimentalServices API. Use when creating backends (Python, Go), multi-service projects, or full-stack apps with separate backend and frontend services.
metadata:
  author: vercel
  version: "1.0.0"
---

# Deploy backends and monorepos with Vercel

Use Vercel's `experimentalServices` API to build and deploy multi-service projects — e.g. a Python or Go backend alongside a JavaScript frontend.

This skill covers **project structure and configuration**. For the actual deployment, defer to the **deploy-to-vercel** skill.

## How It Works

- Services API is fully supported across the Vercel platform.
- Services layout is enabled via correctly configuring `vercel.json` (see example applications).
- `vercel dev` auto-detects each individual framework and runs services as one application (use `-L` to prevent linking to Vercel project). It automatically handles routing and managing dev servers.

## Usage

1. Pick the most relevant project from `references/`:
   - `fastapi-vite/` — Python (FastAPI) + Vite/React
   - `fastapi-nextjs/` — Python (FastAPI) + Next.js
   - `go-vite/` — Go (net/http) + Vite
2. Read the reference files to understand the expected layout, then adapt to the user's requirements w.r.t languages and frameworks. Services projects can use all languages and frameworks supported by Vercel, not just the ones found in reference.
3. Define backend routes without the route prefix (e.g. `@app.get("/health")` or `http.HandleFunc("/health", ...)`). Vercel strips the prefix before forwarding to the backend.
4. Validate services in `vercel.json` have `entrypoint` and `routePrefix`, and optionally `framework` *when necessary*, but no extra unknown fields, otherwise that will cause the application to crash.

Only `vercel.json` lives at the root. Each service manages its own dependencies independently.

## Output

After scaffolding, present the created file structure to the user. After deployment, present the deployment URL (refer to the `deploy-to-vercel` skill for details).

## Troubleshooting

### 404 on backend routes after deployment

The project needs the Services framework preset enabled in the Vercel dashboard:

1. Go to Project Settings → Build & Deployment → Framework Preset
2. Select Services from the dropdown
3. Redeploy

### Routes return unexpected results

1. Ensure all services are correctly picked up by `vercel dev` by analyzing the logs. If a service is missing, verify `vercel.json`. Try setting `framework` explicitly.
2. Validate `routePrefix` behavior: endpoints are declared without `routePrefix` (e.g. `/health`), requests from other services use `routePrefix` (e.g. `/api/health`).
