---
name: hermes-memory-maintenance
description: Maintain and optimize AI agent memory files. Audits for redundancy, consolidation, capacity limits, contradiction detection, and hallucination prevention through structured memory design — for agents with persistent file-based memory systems.
license: MIT
metadata:
  author: hermes-agent
  version: "1.4.0"
---

# Hermes Memory Maintenance

Maintains agent memory files by auditing content quality, consolidating entries, managing capacity, and preventing hallucination through structured memory design.

## When to Use

- Memory utilization exceeds 80% and needs consolidation
- User reports the agent "forgot" previously saved information — memory may be silently truncating at capacity limits
- Rapid accumulation of fine-grained entries where many could be merged
- Stable procedural knowledge currently in memory that should be archived to skills
- After heavy configuration or setup activity (3+ tool installations, 5+ preference settings)

## Architecture

Agent memory systems often use flat file storage with delimiter-separated entries (e.g., `§`-separated markdown files). Two files are common:

1. **Memory file** — Environment facts, installed tools, configs, procedures
2. **User file** — User identity, preferences, communication style, workflow expectations

Both are typically injected into every session's system prompt with configurable character limits.

### Three-Layer Defense Against Injection

| Layer | Role |
|-------|------|
| **Write Filter** | Scans every write for threat patterns (injection, exfiltration, promptware) |
| **Load Filter** | Secondary scan at snapshot build time |
| **Snapshot Isolation** | Frozen snapshot prevents mid-session injection |

## Maintenance Workflow

### Step 1: Audit Current State

Check file sizes and configured limits:
```bash
wc -c memory_file.md user_file.md
```

Score each entry for quality (0-4 scale):
| Score | Criteria |
|-------|----------|
| +1 | Length > 80 chars (sufficient detail) |
| +1 | Structured/labelled format |
| +1 | Contains actionable directive |
| +1 | Contains verifiable facts |

- **3-4** 🟢 High quality
- **2** 🟡 Adequate
- **0-1** 🔴 Consolidate or remove

### Step 2: Identify Problems

| Signal | Action |
|--------|--------|
| Cross-file redundancy (same fact in both files) | Merge into one file only |
| Intra-file redundancy (same topic repeated) | Merge into one comprehensive entry |
| Overly fine-grained rules (9 rules that could be 5) | Consolidate related entries |
| Stable procedural knowledge | Archive to a skill (loaded on-demand) |
| Outdated ephemera (temporary configs, old pricing) | Delete entirely |
| Content drift (facts in wrong file) | Move to correct file |

### Step 3: Consolidate

Use the memory tool for entry-level edits (add/replace/remove) to avoid file desync issues. For major restructures:

1. Backup the files
2. Delete the drift file
3. Re-add entries one at a time
4. Verify roundtrip integrity

### Step 4: Archive Stable Knowledge to Skills

Move stable procedural knowledge out of memory into a skill:

| Memory entry type | To skill? | Keep in memory? |
|-------------------|-----------|-----------------|
| Numbered procedure steps | ✅ Yes | ❌ No |
| Multi-pitfall workflow | ✅ Yes | ❌ No |
| Quick fact (< 100 chars) | ❌ No | ✅ Yes |
| User identity/preferences | ❌ No | ✅ Yes |
| Session progress or state | ❌ No | ❌ Use session search |

## Stale Entry Detection

| Content type | TTL |
|-------------|-----|
| Behavioral rules | 90 days |
| Environment config | 30 days |
| User identity | 180 days |
| Error archive | 365 days |

## Contradiction Detection

Scan for:
- Duplicate user/platform IDs
- Duplicate topic headers
- Conflicting behavioral directives

## Full Documentation

For complete details including multi-user section-based structure, external evaluation pattern, concurrent write safety, and all verified pitfalls, see the [source repository](https://github.com/duruonanni/hermes-skill-kit/blob/main/hermes-memory-maintenance/SKILL.md).
