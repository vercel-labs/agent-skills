---
description: Import leads from a LinkedIn / Sales Navigator search into the pipeline — search, qualify against the ICP, dedupe, and store with round-robin assignment.
argument-hint: "[search URL or filters] [list name]"
---

Use the **linkedin-growth** skill to run a Phase A import. Arguments: $ARGUMENTS

Drive the full import flow:

1. Determine the inputs. If I gave a search URL, detect the type (URL containing
   `/sales/` → `nv`, otherwise `st`). If I gave filters instead, use them. Ask me for
   anything missing: which account should run the search (`--searcher`), and a list name
   (`--list`). If I have more than one account, confirm the searcher with me.
2. **Always ask me the limit** — how many of the found leads to take. I can give a number or
   say "max" for the maximum (Sales Navigator caps at 2500, standard search at 1000). Do not
   assume a default; this question is required every time.
4. Run `node scripts/import.mjs prepare --searcher <acct> --list "<name>" --type <nv|st>
   --limit <N|max>` with either `--search-url "<url>"` or the filter flags. (`--limit` is
   required; a number above the cap is clamped and reported as `limit_capped_to_max`.)
5. **Settle the ICP before qualifying** (this is the filtering step — make it explicit, not
   silent). The `prepare` output tells you whether an ICP is configured:
   - If none is configured, interview me: which roles/seniority to target, which
     industries/company types fit, company size/stage if relevant, locations to include or
     exclude, and any hard exclusions. Summarize what you heard, then save it with
     `node scripts/settings.mjs set icp_definition --stdin` (pipe the text via a heredoc — it
     is stored in the database, not a file; do not leave stray ICP files in the repo or tmp).
   - If one is configured, show it to me in plain language and ask whether to use it as-is or
     adjust it for this list (re-save if I change it).
6. Read the returned candidate file and qualify every candidate **against my ICP**, using the
   output contract in `config/qualification-prompt.md`. For more than ~25 candidates, chunk
   the work and delegate each chunk to a sub-agent. **Use a cheap/fast model for these
   qualification sub-agents** — it's simple classification, not deep reasoning (in Claude
   Code, spawn them with `model: "haiku"`; in other hosts use their small/fast model). Keep
   orchestration on the main model. Produce a JSON array
   `[{hashed_url, suitable, reasoning}]` covering every candidate (reasoning must cite the ICP
   criterion that drove the decision), and write it to the expected result file path.
7. Run `node scripts/import.mjs commit --batch <id> --results <file>`.
8. Report transparently: how many were found, skipped as duplicates, kept vs filtered, a few
   concrete sample reasons from both sides, and how the new leads were distributed across
   accounts.

Never send invites here — import only stores leads as `not_connected`.
