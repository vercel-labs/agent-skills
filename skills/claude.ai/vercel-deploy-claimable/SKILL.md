---
name: vercel-deploy
description: Build and deploy web UI projects (React, Vue, Svelte, Next.js, etc.) to Vercel cloud or locally. Supports framework auto-detection, cloud deployment with shareable URLs, local development serving, and portable uv packages. Use when building web apps, deploying to production, running locally, or packaging for distribution.
metadata:
  author: vercel
  version: "2.0.0"
---

# Deploy

Deploy any project to Vercel or run locally. Supports Vercel cloud deployment (no auth required) and local development serving.

## How It Works

1. **Ask the user** which deployment option they prefer:
   - **Vercel** - Deploy to cloud, get preview URL and claim link
   - **Local** - Build and serve locally via FastAPI
   - **Package for uv** - Create portable package runnable with `uv`

2. Execute the appropriate script based on user choice

3. Return deployment URL or local server information

## Deployment Options

### Option 1: Vercel (Cloud Deployment)

Packages project and deploys to Vercel. No authentication required.

```bash
bash /mnt/skills/user/vercel-deploy/scripts/deploy.sh [path]
```

**Returns:** Preview URL (live site) and Claim URL (transfer to your Vercel account)

### Option 2: Local Deployment

Builds the npm project and serves the static output via FastAPI.

```bash
bash /mnt/skills/user/vercel-deploy/scripts/deploy-local.sh [path] [port]
```

**Arguments:**
- `path` - Directory to deploy (defaults to current directory)
- `port` - Port to serve on (defaults to 8000)

**Returns:** Local URL (e.g., http://localhost:8000)

### Option 3: Package for uv

Creates a portable package with a run script that uses `uv` to serve the built project.

```bash
bash /mnt/skills/user/vercel-deploy/scripts/package-uv.sh [path] [output-dir]
```

**Arguments:**
- `path` - Directory to package (defaults to current directory)
- `output-dir` - Where to create the package (defaults to `./deploy-package`)

**Returns:** Path to the generated package with instructions

## Usage Flow

When a user asks to deploy, **always ask which option they prefer**:

```
How would you like to deploy this project?

1. **Vercel** - Deploy to cloud (get shareable URL)
2. **Local** - Run locally on your machine
3. **Package for uv** - Create portable package to run anywhere
```

## Output Examples

### Vercel Deployment
```
Preparing deployment...
Detected framework: nextjs
Creating deployment package...
Deploying...
Deployment successful!

Preview URL: https://skill-deploy-abc123.vercel.app
Claim URL:   https://vercel.com/claim-deployment?code=...
```

### Local Deployment
```
Building project...
npm install completed
npm run build completed
Starting local server...

Local server running at: http://localhost:8000
Press Ctrl+C to stop the server
```

### Package for uv
```
Building project...
Creating uv package...
Package created at: ./deploy-package

To run the package:
  cd ./deploy-package
  ./run.sh

Or with uv directly:
  cd ./deploy-package
  uv run server.py
```

## Framework Detection

Auto-detects frameworks from `package.json`. Supported frameworks include:

- **React**: Next.js, Gatsby, Create React App, Remix, React Router
- **Vue**: Nuxt, Vitepress, Vuepress, Gridsome
- **Svelte**: SvelteKit, Svelte, Sapper
- **Other Frontend**: Astro, Solid Start, Angular, Ember, Preact, Docusaurus
- **Build Tools**: Vite, Parcel
- **And more**: Blitz, Hydrogen, RedwoodJS, Storybook, Sanity, etc.

For static HTML projects (no `package.json`), framework is set to `null`.

## Present Results to User

### For Vercel:
```
Deployment successful!

Preview URL: https://skill-deploy-abc123.vercel.app
Claim URL:   https://vercel.com/claim-deployment?code=...

View your site at the Preview URL.
To transfer this deployment to your Vercel account, visit the Claim URL.
```

### For Local:
```
Local server is running!

URL: http://localhost:8000

The server will keep running until you stop it with Ctrl+C.
```

### For uv Package:
```
Package created successfully!

Location: ./deploy-package

To run anywhere with uv installed:
  cd ./deploy-package
  ./run.sh

Requirements: uv (https://github.com/astral-sh/uv), Python 3.11+
```

## Troubleshooting

### Vercel Network Egress Error

If deployment fails due to network restrictions (common on claude.ai):

```
Deployment failed due to network restrictions. To fix this:

1. Go to https://claude.ai/settings/capabilities
2. Add *.vercel.com to the allowed domains
3. Try deploying again
```

### Local Deployment - npm not found

```
npm is required for building the project. Please install Node.js:
https://nodejs.org/
```

### Local Deployment - Build failed

Check the build output for errors. Common issues:
- Missing dependencies: Run `npm install` first
- Build script missing: Ensure `package.json` has a `build` script

### Package for uv - uv not found

The generated package requires `uv` to run. Install it:
```
curl -LsSf https://astral.sh/uv/install.sh | sh
```
