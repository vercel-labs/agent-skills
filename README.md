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

### web-design-guidelines

Review UI code for compliance with web interface best practices. Audits your code for 100+ rules covering accessibility, performance, and UX.

**Use when:**
- "Review my UI"
- "Check accessibility"
- "Audit design"
- "Review UX"
- "Check my site against best practices"

**Categories covered:**
- Accessibility (aria-labels, semantic HTML, keyboard handlers)
- Focus States (visible focus, focus-visible patterns)
- Forms (autocomplete, validation, error handling)
- Animation (prefers-reduced-motion, compositor-friendly transforms)
- Typography (curly quotes, ellipsis, tabular-nums)
- Images (dimensions, lazy loading, alt text)
- Performance (virtualization, layout thrashing, preconnect)
- Navigation & State (URL reflects state, deep-linking)
- Dark Mode & Theming (color-scheme, theme-color meta)
- Touch & Interaction (touch-action, tap-highlight)
- Locale & i18n (Intl.DateTimeFormat, Intl.NumberFormat)

### react-native-guidelines

React Native best practices optimized for AI agents. Contains 16 rules across 7 sections covering performance, architecture, and platform-specific patterns.

**Use when:**
- Building React Native or Expo apps
- Optimizing mobile performance
- Implementing animations or gestures
- Working with native modules or platform APIs

**Categories covered:**
- Performance (Critical) - FlashList, memoization, heavy computation
- Layout (High) - flex patterns, safe areas, keyboard handling
- Animation (High) - Reanimated, gesture handling
- Images (Medium) - expo-image, caching, lazy loading
- State Management (Medium) - Zustand patterns, React Compiler
- Architecture (Medium) - monorepo structure, imports
- Platform (Medium) - iOS/Android specific patterns

### composition-patterns

React composition patterns that scale. Helps avoid boolean prop proliferation through compound components, state lifting, and internal composition.

**Use when:**
- Refactoring components with many boolean props
- Building reusable component libraries
- Designing flexible APIs
- Reviewing component architecture

**Patterns covered:**
- Extracting compound components
- Lifting state to reduce props
- Composing internals for flexibility
- Avoiding prop drilling

### vercel-deploy-claimable

Deploy applications and websites to Vercel instantly. Designed for use with claude.ai and Claude Desktop to enable deployments directly from conversations. Deployments are "claimable" - users can transfer ownership to their own Vercel account.

**Use when:**
- "Deploy my app"
- "Deploy this to production"
- "Push this live"
- "Deploy and give me the link"

**Features:**
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

### command-name (Plugin Structure)

Claude Code plugin directory layout, manifest (`.claude-plugin/plugin.json`), and component organization (commands, agents, skills, hooks).

**Use when:**
- "Create a plugin", "scaffold a plugin", "understand plugin structure"
- Organizing plugin components, setting up `plugin.json`
- Using `${CLAUDE_PLUGIN_ROOT}`, configuring auto-discovery
- Plugin architecture and file naming conventions

### copilot-sdk

Build agentic applications with the GitHub Copilot SDK. Embed Copilot's agent runtime in apps using Python, TypeScript, Go, or .NET.

**Use when:**
- Embedding AI agents in apps, creating custom tools
- Implementing streaming responses, managing sessions
- Connecting to MCP servers or creating custom agents
- "Copilot SDK", "agentic app", "programmable agent"

### create-pr

Creates GitHub pull requests with properly formatted titles using the project's PR template from `.github/`.

**Use when:**
- Creating PRs, submitting changes for review
- User says `/pr` or "create a pull request"
- Pushing branch and opening PR via `gh pr create`

### find-skills

Discover and install skills from the open agent skills ecosystem via the Skills CLI (`npx skills`).

**Use when:**
- "How do I do X", "find a skill for X", "is there a skill that can..."
- User wants to extend agent capabilities
- Searching for installable skills at skills.sh

### git-commit

Generate concise, descriptive git commit messages from staged changes (imperative mood, 50-char subject, 72-char body).

**Use when:**
- Creating commits from staged changes
- Crafting or reviewing commit message quality
- Following conventional commit style

### prompt-engineering

Guide for generating effective prompts for agentic systems: technique selection, decision tree, and canonical template.

**Use when:**
- Creating or designing prompts for AI agents
- Tool-using agents, planning agents, autonomous systems
- Choosing techniques (ReAct, CoT, CoVe, few-shot, etc.)

### refactor

Refactor code to simplify architecture and implementation using TDD; preserves functionality via tests (Red-Green-Refactor).

**Use when:**
- Code is complex or hard to understand
- Multiple responsibilities, code smells, duplication
- Improving maintainability without changing behavior
- Requires existing passing tests before starting

### skill-creator

Guide for creating effective skills: structure, SKILL.md format, bundled scripts and references, and context-efficient design.

**Use when:**
- Creating a new skill or updating an existing one
- Extending agent capabilities with workflows or tool integrations
- Designing skill metadata and progressive disclosure

### tdd

Test-Driven Development workflow (Red-Green-Refactor) for new features, bug fixes, and refactoring; pytest-focused.

**Use when:**
- Implementing new features or fixing bugs (test first)
- Adding tests to legacy code, improving test quality
- Following Red-Green-Refactor with pytest

## Installation

```bash
npx skills add mguinada/agent-skills
```

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
