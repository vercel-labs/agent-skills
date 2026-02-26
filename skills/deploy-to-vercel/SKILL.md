---
name: deploy-to-vercel
description: Deploy applications and websites to Vercel. Use when the user requests deployment actions like "deploy my app", "deploy and give me the link", "push this live", or "create a preview deployment".
metadata:
  author: vercel
  version: "3.0.0"
---

# Deploy to Vercel

Deploy any project to Vercel. **Always deploy as preview** (not production) unless the user explicitly asks for production.

The goal is to get the user into the best long-term setup: their project linked to Vercel with git-push deploys. Every method below tries to move the user closer to that state.

## Step 1: Gather Project State

Run all three checks before deciding which method to use:

```bash
# 1. Check for a git remote
git remote get-url origin 2>/dev/null

# 2. Check if locally linked to a Vercel project (either file means linked)
cat .vercel/project.json 2>/dev/null || cat .vercel/repo.json 2>/dev/null

# 3. Check if the Vercel CLI is installed and authenticated
vercel whoami 2>/dev/null
```

**About the `.vercel/` directory:** A linked project has either:
- `.vercel/project.json` — created by `vercel link` (single project linking). Contains `projectId` and `orgId`.
- `.vercel/repo.json` — created by `vercel link --repo` (repo-based linking). Contains `orgId`, `remoteName`, and a `projects` array mapping directories to Vercel project IDs.

Either file means the project is linked. Check for both.

**Do NOT** use `vercel project inspect`, `vercel ls`, or `vercel link` to detect state in an unlinked directory — without a `.vercel/` config, they will interactively prompt (or with `--yes`, silently link as a side-effect). Only `vercel whoami` is safe to run anywhere.

## Step 2: Choose a Deploy Method

### Linked (`.vercel/` exists) + has git remote → Git Push

This is the ideal state. The project is linked and has git integration.

1. **Ask the user before pushing.** Never push without explicit approval:
   ```
   This project is connected to Vercel via git. I can commit and push to
   trigger a deployment. Want me to proceed?
   ```

2. **Commit and push:**
   ```bash
   git add .
   git commit -m "deploy: <description of changes>"
   git push
   ```
   Vercel automatically builds from the push. Non-production branches get preview deployments; the production branch (usually `main`) gets a production deployment.

3. **Retrieve the preview URL.** If the CLI is authenticated:
   ```bash
   sleep 5
   vercel ls --format json
   ```
   The JSON output has a `deployments` array. Find the latest entry — its `url` field is the preview URL.

   If the CLI is not authenticated, tell the user to check the Vercel dashboard or the commit status checks on their git provider for the preview URL.

---

### Linked (`.vercel/` exists) + no git remote → `vercel deploy`

The project is linked but there's no git repo. Deploy directly with the CLI.

```bash
vercel deploy [path] -y
```

Use a **10-minute timeout** (600000ms) since builds can take a while. The CLI returns the deployment URL directly.

For production deploys (only if user explicitly asks):
```bash
vercel deploy [path] --prod -y
```

---

### Not linked + CLI is authenticated → Link first, then deploy

The CLI is working but the project isn't linked yet. This is the opportunity to get the user into the best state.

1. **Ask the user before linking:**
   ```
   This project isn't linked to Vercel yet. I can link it now, which will
   enable automatic deployments when you push to git. Want me to set that up?
   ```

2. **If the user agrees and a git remote exists**, use repo-based linking:
   ```bash
   vercel link --repo
   ```
   This reads the git remote URL and matches it to existing Vercel projects that deploy from that repo. It creates `.vercel/repo.json`. This is much more reliable than `vercel link` (without `--repo`), which tries to match by directory name and often fails when the local folder and Vercel project are named differently.

   **If there is no git remote**, fall back to standard linking:
   ```bash
   vercel link
   ```
   This prompts the user to select or create a project. It creates `.vercel/project.json`.

3. **Then deploy using the best available method:**
   - If a git remote exists → commit and push (see git push method above)
   - If no git remote → `vercel deploy [path] -y`

4. **If the user declines linking**, do a one-off deploy without linking:
   ```bash
   vercel deploy [path] -y
   ```
   This still works — it will prompt for project setup inline. Use `-y` to accept defaults.

---

### Not linked + CLI not authenticated → Install, auth, link, deploy

The Vercel CLI isn't set up at all.

1. **Install the CLI (if not already installed):**
   ```bash
   npm install -g vercel
   ```

2. **Authenticate:**
   ```bash
   vercel login
   ```
   The user completes auth in their browser. If running in a non-interactive environment where login is not possible, skip to the **no-auth fallback** below.

3. **Link the project** (use `--repo` if a git remote exists, plain `vercel link` otherwise):
   ```bash
   vercel link --repo   # if git remote exists
   vercel link          # if no git remote
   ```

4. **Deploy** using the best available method (git push if remote exists, otherwise `vercel deploy -y`).

---

### No-Auth Fallback (sandboxed environments only)

**When to use:** Last resort when the CLI can't be installed or authenticated (e.g. sandboxed environments). This requires no authentication — it returns a **Preview URL** (live site) and a **Claim URL** (transfer to your Vercel account).

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

The script auto-detects the framework from `package.json`, packages the project (excluding `node_modules`, `.git`, `.env`), uploads it, and waits for the build to complete.

**Tell the user:** "Your deployment is ready at [previewUrl]. Claim it at [claimUrl] to manage your deployment."

---

## Agent-Specific Notes

### Claude Code / terminal-based agents

You have full shell access. Do NOT use the `/mnt/skills/` path. Follow the decision flow above using the CLI directly.

For the no-auth fallback, run the deploy script from the skill's installed location:
```bash
bash ~/.claude/skills/deploy-to-vercel/resources/deploy.sh [path]
```
The path may vary depending on where the user installed the skill.

### Sandboxed environments (claude.ai)

You likely cannot run `vercel login` or `git push`. Go directly to the **no-auth fallback**.

---

## Output

Always show the user the deployment URL.

- **Git push:** Use `vercel ls --format json` to find the preview URL. If the CLI isn't authenticated, tell the user to check the Vercel dashboard or commit status checks.
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

---

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

If `vercel login` or `vercel deploy` fails with authentication errors, fall back to the no-auth deploy script.
