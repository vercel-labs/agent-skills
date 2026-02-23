---
name: deploy-to-vercel
description: Deploy applications and websites to Vercel. Use when the user requests deployment actions like "deploy my app", "deploy and give me the link", "push this live", or "create a preview deployment".
metadata:
  author: vercel
  version: "2.0.0"
---

# Deploy to Vercel

Deploy any project to Vercel. **Always deploy as preview** (not production) unless the user explicitly asks for production.

Try these methods in order. Use the first one that works.

## Method 1: Git Push (Preferred)

If the project is already connected to Vercel via a Git repository, deploying is just a push. This is the best path because Vercel builds automatically from your repo.

1. **Detect if the project is connected to Vercel via git.** Check for ALL of:
   - A `.vercel/project.json` file exists (contains `projectId` and `orgId`)
   - The project is a git repo with a remote pointing to GitHub/GitLab/Bitbucket
   - The Vercel project is configured to deploy from that git repo (you can verify with `vercel inspect` or `vercel project ls` if the CLI is authenticated)

   If any of these are missing, skip to **Method 2**.

2. **Ask the user before pushing.** Never push without explicit approval. Prompt the user:
   ```
   This project is connected to Vercel via git. I can commit and push to trigger a deployment. Want me to proceed?
   ```

3. **Once the user approves**, commit and push:
   ```bash
   git add .
   git commit -m "deploy: <description of changes>"
   git push
   ```
   Vercel will automatically build and deploy from the push. A preview deployment is created for non-production branches; pushing to the production branch (usually `main`) creates a production deployment.

4. **If the project is NOT yet connected to Vercel via git**, you can link it:
   ```bash
   npm install -g vercel
   vercel login
   vercel link
   ```
   Then connect the Git repo in the Vercel dashboard, or use `vercel git connect`. Once linked, future pushes trigger automatic deploys.

**When to skip this method:** If there's no git repo, no `.vercel/project.json`, the user declines to push, or you're in a sandboxed environment without git push access.

## Method 2: Vercel CLI

If git-based deploy isn't available, use the Vercel CLI directly.

### 1. Install the CLI (if not already installed)

```bash
npm install -g vercel
```

### 2. Authenticate

```bash
vercel login
```

Follow the prompts to authenticate. If running in a non-interactive environment where login is not possible, skip to **Method 3**.

### 3. Deploy

```bash
vercel deploy [path] -y
```

**Important:** Use a 10 minute (600000ms) timeout for the deploy command since builds can take a while.

For production deploys (only if user explicitly asks):
```bash
vercel deploy [path] --prod -y
```

If the CLI fails with "No existing credentials found" or any auth error, use **Method 3**.

## Method 3: No-Auth Deploy Script (claude.ai / sandboxed environments)

Last resort when neither git push nor the Vercel CLI are available. This requires no authentication -- it returns a **Preview URL** (live site) and a **Claim URL** (transfer to your Vercel account).

```bash
bash /mnt/skills/user/deploy-to-vercel/resources/deploy.sh [path]
```

**Arguments:**
- `path` - Directory to deploy, or a `.tgz` file (defaults to current directory)

**Examples:**
```bash
# Deploy current directory
bash /mnt/skills/user/deploy-to-vercel/resources/deploy.sh

# Deploy specific project
bash /mnt/skills/user/deploy-to-vercel/resources/deploy.sh /path/to/project

# Deploy existing tarball
bash /mnt/skills/user/deploy-to-vercel/resources/deploy.sh /path/to/project.tgz
```

The script auto-detects the framework from `package.json`, packages the project (excluding `node_modules`, `.git`, `.env`), uploads it, and waits for the build to complete. It returns JSON with `previewUrl` and `claimUrl`.

**Tell the user:** "Your deployment is ready at [previewUrl]. Claim it at [claimUrl] to manage your deployment."

## Claude Code

If you are running inside **Claude Code** (i.e. you have direct terminal access and can run shell commands interactively), do NOT use the `/mnt/skills/` path. You have full shell access, so prefer the authenticated methods:

1. **Git push** (best): If the repo has a `.vercel/project.json` and a git remote, confirm with the user before pushing. Never push without their approval.

2. **Vercel CLI** (good): Install, login interactively (user completes auth in browser), and deploy:
   ```bash
   npm install -g vercel
   vercel login
   vercel deploy [path] -y
   ```

3. **No-auth fallback** (last resort): If both above fail, run the deploy script from the skill's installed location:
   ```bash
   bash ~/.claude/skills/deploy-to-vercel/resources/deploy.sh [path]
   ```
   The script path may vary depending on where the user installed the skill.

## Output

Show the user the deployment URL.

- **Git push:** Tell the user the push triggered a deploy and they can check the Vercel dashboard for the preview URL, or use `vercel inspect` to get it.
- **CLI deploy:** Show the URL returned by `vercel deploy`.
- **No-auth fallback:** Show both the preview URL and the claim URL:
  ```
  Deployment successful!

  Preview URL: https://my-app-abc123.vercel.app
  Claim URL:   https://vercel.com/claim-deployment?code=...

  View your site at the Preview URL.
  To transfer this deployment to your Vercel account, visit the Claim URL.
  ```

**Do not** curl or fetch the deployed URL to verify it works. Just return the link.

## Troubleshooting

### Network Egress Error (claude.ai)

If deployment fails due to network restrictions on claude.ai, tell the user:

```
Deployment failed due to network restrictions. To fix this:

1. Go to https://claude.ai/settings/capabilities
2. Add *.vercel.com to the allowed domains
3. Try deploying again
```

### Escalated Network Access (sandboxed environments)

If deployment fails due to network issues (timeouts, DNS errors, connection resets) in a sandboxed environment, rerun with escalated permissions (`sandbox_permissions=require_escalated`).

### CLI Auth Failure

If `vercel login` or `vercel deploy` fails with authentication errors, fall back to the no-auth deploy script (Method 3).
