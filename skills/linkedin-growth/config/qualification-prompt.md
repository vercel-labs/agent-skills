# Lead Qualification Scaffolding

This file defines **how** to qualify a batch of leads and the **output format**. It is
deliberately product-agnostic. The actual filtering rules — who counts as a good lead and
who should be filtered out — come from the user's own ICP, stored in the `icp_definition`
setting and supplied to you at qualification time.

> If no ICP has been provided yet, do NOT guess. Stop and ask the user who they want to
> reach and who to exclude (see "Capturing the ICP" below), save it, then qualify.

## The task

You are given:
1. The user's **ICP definition** (their description of ideal leads and exclusions).
2. A **batch of candidate leads**, each with at minimum: `hashed_url`, `full_name`,
   `position`, `location` (some fields may be `null`).

For every candidate, decide whether it matches the ICP (`suitable: true`) or should be
filtered out (`suitable: false`), and give a short, honest reason grounded in the ICP.

## Capturing the ICP (when it is missing or the user wants to change it)

Interview the user with concrete questions, then save their answers. Cover at least:
- **Roles / seniority** to target (and any roles to exclude).
- **Industries / company types** that fit (and ones that don't).
- **Company size / stage**, if relevant.
- **Locations** to include or exclude (countries, regions).
- Any **hard exclusions** (e.g. competitors, students, specific titles).

Save the resulting definition straight into the database (it lives in the `settings` table,
not in a file) by piping it via stdin:

```bash
node scripts/settings.mjs set icp_definition --stdin <<'ICP'
Target: ...
Exclude: ...
ICP
# or, for a short one-liner:
node scripts/settings.mjs set icp_definition 'Target: ... | Exclude: ...'
```

## How to judge each lead

1. **Hard exclusions first.** If the lead hits an explicit exclusion (role, industry,
   location, etc.), it is `suitable: false` regardless of anything else.
2. **Role / use-case fit.** Does the person's position match a targeted role or buying
   context described in the ICP?
3. **Decision-making / seniority**, if the ICP cares about it.
4. **Industry / company context**, if the ICP specifies it.
5. When the ICP is silent on a dimension, do not invent a rule — judge on the dimensions
   the user actually gave you, and lean toward keeping borderline leads unless an
   exclusion applies.

Be consistent: the same kind of lead should get the same verdict across the batch.

## Output contract

Return a single JSON array. One element per input lead, matched by `hashed_url`:

```json
{
  "hashed_url": "<copied verbatim from the input>",
  "suitable": true,
  "reasoning": "1-2 sentences grounded in the ICP — why kept or filtered."
}
```

Rules:
- Output one element for **every** input lead. Do not skip any.
- Preserve each `hashed_url` exactly.
- No markdown fences, no commentary outside the JSON array.
- `reasoning` must reference the actual ICP criterion that drove the decision, so the user
  can see *why* each lead was kept or filtered.
