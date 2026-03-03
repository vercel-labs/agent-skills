---
name: gh-pr-creator
description: Create and update GitHub pull requests using gh CLI for turbiteam repositories. PRs are written in Brazilian Portuguese following the repo's pull_request_template.md with comment markers. Uses a .work/ staging directory for body files. Use when the user asks to create a PR, open a PR, update a PR description, or prepare a PR body.
compatibility:
  - gh CLI installed and authenticated (`gh auth status`)
  - git repository with a GitHub remote
  - write access to the target repository (scope `repo`)
---

# gh PR Creator (turbiteam / PT-BR)

## Principles

- All PR content is written in **Brazilian Portuguese**.
- The PR body must follow the repo's `.github/pull_request_template.md` exactly, preserving comment markers. A reference copy lives in [assets/pull_request_template.md](assets/pull_request_template.md).
- PR body files are staged in `.work/` before submission (never deleted — they serve as history).
- Use `gh pr create --body-file` / `gh pr edit --body-file` to avoid shell escaping issues.
- Commit titles follow Conventional Commits: `type(scope): description` (title in English is acceptable; body in PT-BR).

## What makes a good PR

These guidelines reduce reviewer burden and accelerate merge cycles.

### Focused scope

Keep PRs short. If a diff exceeds ~500 lines, consider splitting. Separate refactoring from behavioral changes — a reviewer should not have to untangle "no-brainer rename" from "new feature logic" in the same diff.

### Explain intent, not just mechanics

The **Por que?** section answers "why does this change exist?" so the reviewer understands the goal before reading code. Without it, the reviewer must reverse-engineer intent from the diff — slow and error-prone. A cryptic title and empty body is the fastest way to get a PR ignored.

### Organized commits

When a PR contains multiple logical changes, split them into separate commits within the PR. This lets the reviewer examine each piece in isolation. When addressing reviewer feedback, add new commits instead of squashing — the reviewer can quickly verify their comments were addressed.

### Tests as proof

Every PR should include tests or explain why not. Choose the right tier: unit test for isolated logic, integration/smoke for behavior changes. Include the test run output in the PR body ("Validação executada") or as a proof comment.

### Track follow-ups explicitly

When deferring work to a later PR, open an issue (or add a `TODO(<issue>)`) and reference it in the **Comentários** section. This gives reviewers confidence that follow-ups won't be forgotten.

## Workflow

### 1. Discover repo and template

```bash
REPO=$(gh repo view --json nameWithOwner -q .nameWithOwner)
```

Read `.github/pull_request_template.md`. The standard turbiteam template uses comment markers required by the CI pipeline:

```markdown
## Por que? <!-- why:init:required -->
<!-- why:end -->

## Como? <!-- how:init:required -->
<!-- how:end -->

## Comentários: <!-- comments:init -->
<!-- comments:end -->
```

Content goes **between** the opening marker line and its corresponding `<!-- ...:end -->`. Never remove or reorder the markers.

### 2. Gather context

Run in parallel to understand the full change set:

```bash
git log --oneline main..HEAD
git diff main..HEAD --stat
git diff main..HEAD
```

Adjust `main` to the actual base branch when stacking PRs.

### 3. Draft the body in `.work/`

```bash
mkdir -p .work
```

Name the file `body-pr-<slug>.md` — slug is a short descriptor (branch name, feature, or PR number for updates).

### 4. Section guidelines

#### Por que? (required)

**Why does this change exist?** Focus on the problem, motivation, or business need.

| PR size | Guideline |
|---------|-----------|
| Small / trivial | 1–3 sentences |
| Medium | 1 paragraph + optional context table |
| Complex / high-risk | Up to ~15 lines; include threat/impact tables, ADR references |

Good patterns:
- Lead with the core motivation in one sentence
- Include risk/impact context when relevant (threat tables, probability/impact matrices)
- Reference ADRs, issues, or prior art: `[ADR-0006](docs/ADR/ADR-0006-....md)`, `Fixes #123`
- If the PR addresses a tracked issue, link it here

#### Como? (required)

**How was it done?** This is the technical narrative.

Good patterns:
- Lead with branch/stacking info if relevant: `**Branch:** \`patch/12-foo\` stacked on \`patch/11-bar\``
- Use tables for file inventory:
  ```markdown
  | Arquivo | Mudança |
  |---------|---------|
  | `path/file.js` | Descrição curta |
  ```
- Group changes by theme when the diff spans multiple areas: "Infraestrutura", "Código", "Testes", "Documentação"
- Include a **Validação executada** subsection with actual commands and their results:
  ```markdown
  ### Validação executada
  - `npx jest --passWithNoTests` → **30 suites pass, 0 fail**
  - `make lint` → exit 0
  ```
- End with a **Safe to merge** bullet list summarizing why merge is safe (scope containment, no regressions, feature-flagged, etc.)

#### Comentários (optional)

Anything that doesn't fit above:
- Accepted risks (with justification)
- Follow-ups with issue references: `TODO: #45 — adicionar guard equivalente para MongoDB`
- Stacking notes / merge order dependencies
- WIP disclaimers if using draft PRs for early feedback

### 5. Create or update the PR

**Create:**

```bash
gh pr create \
  --title "type(scope): concise description" \
  --body-file .work/body-pr-<slug>.md \
  --base main
```

**Draft PR for early feedback** (prefix title with `WIP:` or use `--draft`):

```bash
gh pr create \
  --draft \
  --title "WIP: type(scope): concise description" \
  --body-file .work/body-pr-<slug>.md \
  --base main
```

**Update existing:**

```bash
gh pr edit <NUMBER> --body-file .work/body-pr-<slug>.md
```

Add `-R turbiteam/<repo>` when running from outside the repo or from a different clone.

### 6. Add proof comments

After PR creation, attach test evidence as a PR comment:

```bash
gh pr comment <NUMBER> --body "$(cat <<'EOF'
### Proof: test run

```
<paste test output>
```
EOF
)"
```

## Body file example

File: `.work/body-pr-seed-safety.md`

```markdown
## Por que? <!-- why:init:required -->

**PRIORIDADE MÁXIMA — Proteção contra destruição acidental de dados em produção.**

Os scripts de seed contêm operações destrutivas (`DROP DATABASE`, `TRUNCATE TABLE`)
que, se executados contra produção, causariam parada imediata da análise de risco.

Referência: [ADR-0006](docs/ADR/ADR-0006-seed-safety-guardrails.md)

<!-- why:end -->

## Como? <!-- how:init:required -->

Defesa em profundidade com 4 camadas independentes:

| Arquivo | Mudança |
|---------|---------|
| `Makefile` | Guard targets `_require-local-mysql` / `_require-local-mongo` |
| `functions/db/schema/guard.schema.sql` | Banner WARNING + stored procedure `_assert_local_env` |
| `functions/db/seed/guard.seed.sql` | Banner WARNING + `CALL _assert_local_env()` |

### Validação executada
- `npx jest --passWithNoTests` → **30 suites pass, 0 fail**
- `make lint` → exit 0

### Safe to merge
- Escopo focado em DX/dev tooling + docs
- Sem regressão nos testes
- Código de produção inalterado

<!-- how:end -->

## Comentários: <!-- comments:init -->

**Riscos aceitos:**
- `DROP DATABASE` no `make mysql-seed` roda inline — protegido por L1 + L2.

**Follow-ups:**
- TODO: renomear config key confusa no `.runtimeconfig.dev.json`

<!-- comments:end -->
```

## Quick reference

| Action | Command |
|--------|---------|
| List open PRs | `gh pr list --base main --state open` |
| View PR body | `gh pr view <N> --json body -q .body` |
| Create PR | `gh pr create --title "..." --body-file .work/body-pr-<slug>.md` |
| Create draft PR | `gh pr create --draft --title "WIP: ..." --body-file .work/body-pr-<slug>.md` |
| Update PR body | `gh pr edit <N> --body-file .work/body-pr-<slug>.md` |
| Add comment | `gh pr comment <N> --body "..."` |
| Check CI status | `gh pr checks <N>` |
| Cross-repo | Add `-R turbiteam/<repo>` to any command |
