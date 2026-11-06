# cloudscape-skill

An installable agent skill — compatible with [`vercel-labs/agent-skills`](https://github.com/vercel-labs/agent-skills) and any tool that understands the `SKILL.md` + frontmatter convention — that teaches an agent the AWS [Cloudscape Design System](https://cloudscape.design/).

The skill ships the full public Cloudscape documentation as markdown under `references/`, sourced from cloudscape.design's own `llms.txt` index (no scraping of SPA JavaScript required). Each page includes `source_url` frontmatter so the agent can cite the canonical location.

## Install

```bash
npx skills add <user>/cloudscape-skill
```

Or clone and symlink into `~/.claude/skills/` for local development:

```bash
git clone https://github.com/<user>/cloudscape-skill
ln -s "$PWD/cloudscape-skill" ~/.claude/skills/cloudscape-design-system
```

The skill auto-activates on Cloudscape-related prompts (see the `description` in `SKILL.md`).

## Layout

| Path | Purpose |
|------|---------|
| `SKILL.md` | Frontmatter + usage instructions for the agent. |
| `references/index.md` | Generated table of contents. |
| `references/components/*.md` | One file per component. |
| `references/patterns/*.md` | One file per design pattern. |
| `references/foundation/*.md` | Visual foundation (typography, color, layout, icons). |
| `references/get-started/*.md` | Onboarding, testing, i18n, CSP, responsive, state mgmt. |
| `references/guidelines/*.md` | Design principles, writing guidelines. |
| `references/examples/*.md` | Reference implementations. |
| `scripts/refresh.py` | Re-ingest from cloudscape.design (maintainer use). |

## Refreshing

```bash
# Using nix (no Python packaging):
nix-shell -p 'python313.withPackages (ps: with ps; [ httpx pyyaml ])' \
  --run "python scripts/refresh.py"

# Or a venv:
python -m venv .venv && source .venv/bin/activate
pip install -r scripts/requirements.txt
python scripts/refresh.py
```

The script fetches `https://cloudscape.design/llms.txt`, walks every `*/index.html.md` URL it lists, and overwrites `references/`. Commits are the diff review surface.

## License

Skill wrapper: MIT (see `LICENSE`). Content under `references/` is excerpted from the AWS-maintained Cloudscape documentation; see `NOTICE` for attribution.
