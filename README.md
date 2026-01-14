# Agent Skills

A collection of skills for AI coding agents. Skills are packaged instructions and scripts that extend agent capabilities.

Skills follow the [Agent Skills](https://agentskills.io/) format.

## Available Skills

### react-best-practices

React and Next.js performance optimization guidelines from Vercel Engineering. Contains 40+ rules across 8 categories, prioritized by impact.

**Use when:**
- Writing new React components or Next.js pages
- Implementing data fetching (client or server-side)
- Reviewing code for performance issues
- Optimizing bundle size or load times

**Categories covered:**
- Eliminating waterfalls (Critical)
- Bundle size optimization (Critical)
- Server-side performance (High)
- Client-side data fetching (Medium-High)
- Re-render optimization (Medium)
- Rendering performance (Medium)
- JavaScript micro-optimizations (Low-Medium)

### vercel-deploy-claimable

Deploy applications and websites to Vercel instantly. No authentication required. Deployments are "claimable" - users can transfer ownership to their own Vercel account.

**Use when:**
- "Deploy my app"
- "Deploy this to production"
- "Push this live"
- "Deploy and give me the link"

**Features:**
- No authentication required - works instantly
- Auto-detects 40+ frameworks from `package.json`
- Returns preview URL (live site) and claim URL (transfer ownership)
- Handles static HTML projects automatically
- Excludes `node_modules` and `.git` from uploads

**How it works:**
1. Packages your project into a tarball
2. Detects framework (Next.js, Vite, Astro, etc.)
3. Uploads to deployment service
4. Returns preview URL and claim URL

**Output:**
```
Deployment successful!

Preview URL: https://skill-deploy-abc123.vercel.app
Claim URL:   https://vercel.com/claim-deployment?code=...
```

## Installation

Install skills using the CLI:

```bash
npx add-skill vercel-labs/agent-skills
```

### Codex

Follow the [Codex skills guide](https://developers.openai.com/codex/skills/) and place the skill under `$CODEX_HOME/skills`:

```bash
# from the repo root
# defaults to ~/.codex if CODEX_HOME is unset
export CODEX_HOME="${CODEX_HOME:-$HOME/.codex}"
mkdir -p "$CODEX_HOME/skills"
cp -r skills/vercel-deploy "$CODEX_HOME/skills/"
```

Codex will auto-discover `SKILL.md` files in that directory on the next start.

### OpenCode

OpenCode discovers skills from `~/.claude/skills/<name>/SKILL.md` automatically. See [OpenCode Skills docs](https://opencode.ai/docs/skills/) for more details.

### Claude Code

Use the `/install-skill` slash command to install directly from GitHub:

```
/install-skill https://github.com/vercel-labs/claude-skills/tree/main/skills/<skill-name>
```

For example, to install `vercel-deploy`:

```
/install-skill https://github.com/vercel-labs/claude-skills/tree/main/skills/vercel-deploy
```

Add `--personal` to install to `~/.claude/skills/` (available across all projects) or `--project` for `.claude/skills/` (project-specific, default).

See the [Claude Code Skills docs](https://code.claude.com/docs/en/skills) for more details.

### claude.ai

Add the skill to your project knowledge or paste the contents of `SKILL.md` into your conversation.

For network-dependent skills (like vercel-deploy-claimable), you may need to allow domains:

1. Go to [claude.ai/admin-settings/capabilities](https://claude.ai/admin-settings/capabilities)
2. Add required domains (e.g., `*.vercel.com`)

## Usage

Skills are automatically available once installed. The agent will use them when relevant tasks are detected.

**Examples:**
```
Deploy my app
```
```
Review this React component for performance issues
```
```
Help me optimize this Next.js page
```

## Skill Structure

Each skill contains:
- `SKILL.md` - Instructions for the agent
- `scripts/` - Helper scripts for automation (optional)
- `references/` - Supporting documentation (optional)

## License

MIT
