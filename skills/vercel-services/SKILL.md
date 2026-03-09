---
name: vercel-services
description: Building multi-service projects using Vercel's experimentalServices API. Use when creating backends (Python, Go), multi-service projects, or full-stack apps with separate backend and frontend services.
metadata:
  author: vercel
  version: "1.0.0"
---

# Multi-Service Projects with Vercel

Build multi-service projects using Vercel's `experimentalServices` API with a backend (Python/FastAPI or Go) and (optional) JavaScript frontend.

## How It Works

1. Pick the most relevant project from `references/`:
   - `fastapi-vite/` — Python (FastAPI) + Vite/React
   - `fastapi-nextjs/` — Python (FastAPI) + Next.js
   - `go-vite/` — Go (net/http) + Vite
2. Define backend routes without the route prefix (e.g. `@app.get("/health")` or `http.HandleFunc("/health", ...)`). Vercel strips the prefix before forwarding to the backend.
3. Validate services in `vercel.json` have `entrypoint` and `routePrefix`, and optionally `framework` *when necessary*, but no extra unknown fields, otherwise that will cause preview to crash.

Only `vercel.json` lives at the root. Each service manages its own dependencies independently.

## Usage

- Use `vercel dev -L` from the project root to run all services as one application. The CLI will handle each individual service's routing and dev server and put the application on port 3000.
- Frontend calls `/api/...` — Vercel routes these to the backend, which sees only the path after the prefix. No localhost URLs, no proxy needed.

## Output

## Present Results to User

## Troubleshooting
