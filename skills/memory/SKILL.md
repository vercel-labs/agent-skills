---
name: memory
description: Semantic memory management integrating SimpleMem with Claude Code's CLAUDE.md memory system. Use when storing long-term memories, querying past conversations, syncing memories to CLAUDE.md, or managing memory across sessions. Triggers on "remember this", "what do you remember about", "sync memories", "memory search".
license: MIT
metadata:
  author: community
  version: "1.0.0"
---

# Memory Skill

Intelligent long-term memory management that combines SimpleMem's semantic compression with Claude Code's native CLAUDE.md memory system. Stores conversations as compressed atomic facts, enables semantic search, and syncs important memories to CLAUDE.md files.

## How It Works

1. **Semantic Compression**: Converts dialogues into atomic, self-contained facts with resolved references and absolute timestamps
2. **Multi-View Indexing**: Indexes memories across semantic (vector), lexical (keyword), and symbolic (metadata) dimensions
3. **Adaptive Retrieval**: Dynamically adjusts search depth based on query complexity
4. **CLAUDE.md Sync**: Exports important memories to Claude Code's native memory files

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Memory Skill                              │
├─────────────────────────────────────────────────────────────┤
│  SimpleMem Engine                                           │
│  ├── Semantic Compression (dialogue → atomic facts)         │
│  ├── Vector Store (LanceDB)                                 │
│  └── Hybrid Retrieval (semantic + lexical + metadata)       │
├─────────────────────────────────────────────────────────────┤
│  Claude Code Integration                                    │
│  ├── ~/.claude/CLAUDE.md (user-level memories)              │
│  ├── ./CLAUDE.md (project-level memories)                   │
│  └── ./.claude/rules/*.md (topic-specific memories)         │
└─────────────────────────────────────────────────────────────┘
```

## Setup

Before using the memory skill, run the setup script:

```bash
bash /mnt/skills/user/memory/scripts/setup.sh
```

This will:
- Clone SimpleMem repository
- Install Python dependencies via uv
- Create config.py from template
- Initialize the vector database

**Requirements:**
- Python 3.10+
- uv (Python package manager)
- OpenAI API key or compatible endpoint

After setup, configure your API key:
```bash
# Edit ~/.claude/memory/config.py
OPENAI_API_KEY = "your-api-key"
```

## Usage

### Add Memory

Store a dialogue or fact in memory:

```bash
bash /mnt/skills/user/memory/scripts/add.sh "speaker" "content" ["timestamp"]
```

**Arguments:**
- `speaker` - Who said it (e.g., "user", "assistant", person's name)
- `content` - The message content to remember
- `timestamp` - Optional ISO timestamp (defaults to now)

**Examples:**
```bash
# Remember a user preference
bash /mnt/skills/user/memory/scripts/add.sh "user" "I prefer TypeScript over JavaScript"

# Remember a project decision with timestamp
bash /mnt/skills/user/memory/scripts/add.sh "team" "We decided to use PostgreSQL for the database" "2025-01-15T14:30:00"

# Remember a meeting detail
bash /mnt/skills/user/memory/scripts/add.sh "alice" "The quarterly review is scheduled for next Friday at 3pm"
```

### Query Memory

Search memories semantically:

```bash
bash /mnt/skills/user/memory/scripts/query.sh "question"
```

**Examples:**
```bash
# Find preferences
bash /mnt/skills/user/memory/scripts/query.sh "What programming language does the user prefer?"

# Find decisions
bash /mnt/skills/user/memory/scripts/query.sh "What database are we using?"

# Find meeting info
bash /mnt/skills/user/memory/scripts/query.sh "When is the quarterly review?"
```

### Sync to CLAUDE.md

Export important memories to Claude Code's native memory system:

```bash
bash /mnt/skills/user/memory/scripts/sync.sh [target] [category]
```

**Arguments:**
- `target` - Where to sync: "user" (~/.claude/CLAUDE.md), "project" (./CLAUDE.md), or "rules" (./.claude/rules/)
- `category` - Optional category filter (e.g., "preferences", "decisions", "people")

**Examples:**
```bash
# Sync all memories to user-level CLAUDE.md
bash /mnt/skills/user/memory/scripts/sync.sh user

# Sync project decisions to project CLAUDE.md
bash /mnt/skills/user/memory/scripts/sync.sh project decisions

# Create topic-specific rules files
bash /mnt/skills/user/memory/scripts/sync.sh rules preferences
```

### List Memories

View all stored memories:

```bash
bash /mnt/skills/user/memory/scripts/list.sh [limit] [category]
```

### Clear Memories

Remove memories (use with caution):

```bash
bash /mnt/skills/user/memory/scripts/clear.sh [--confirm]
```

## Memory Categories

Memories are automatically categorized:

| Category | Description | Examples |
|----------|-------------|----------|
| `preferences` | User preferences and settings | "I prefer dark mode", "Use 2-space indentation" |
| `decisions` | Technical or project decisions | "We chose React for the frontend" |
| `people` | Information about people | "Bob is the project manager" |
| `events` | Meetings, deadlines, schedules | "Demo is on Friday at 2pm" |
| `facts` | General knowledge and facts | "The API endpoint is /api/v2" |
| `context` | Project context and background | "This is a healthcare app" |

## Integration with Claude Code Memory

### How Sync Works

The sync command exports memories to Claude Code's native system:

1. **User-level** (`~/.claude/CLAUDE.md`): Personal preferences that apply across all projects
2. **Project-level** (`./CLAUDE.md`): Project-specific memories, checked into git
3. **Rules** (`./.claude/rules/*.md`): Topic-organized memories for modular loading

### Automatic Memory Suggestions

When you use this skill, Claude will suggest syncing memories that seem important:

```
I noticed some key information in our conversation:
- User prefers TypeScript
- Project uses PostgreSQL
- API follows REST conventions

Would you like me to sync these to your CLAUDE.md? (user/project/both)
```

### Memory File Format

Synced memories appear in CLAUDE.md as:

```markdown
# Memories (Synced from SimpleMem)

## Preferences
- User prefers TypeScript over JavaScript
- Use 4-space indentation for Python files

## Decisions
- Database: PostgreSQL with Prisma ORM
- Frontend: React with TypeScript

## Context
- This is a healthcare compliance application
- Must support HIPAA requirements
```

## Output Examples

### Adding Memory
```
Adding memory...
Speaker: user
Content: I prefer TypeScript over JavaScript
Timestamp: 2025-01-18T10:30:00

Compressed to atomic fact:
"User prefers TypeScript programming language over JavaScript"

Memory stored successfully.
Category: preferences
ID: mem_abc123
```

### Querying Memory
```
Searching memories for: "What programming language does the user prefer?"

Found 2 relevant memories:

1. [preferences] User prefers TypeScript programming language over JavaScript
   Stored: 2025-01-18T10:30:00
   Confidence: 0.95

2. [decisions] Project uses TypeScript with strict mode enabled
   Stored: 2025-01-17T14:00:00
   Confidence: 0.82

Answer: The user prefers TypeScript over JavaScript.
```

### Syncing Memory
```
Syncing memories to: ~/.claude/CLAUDE.md

Memories to sync:
- [preferences] User prefers TypeScript (NEW)
- [preferences] Use 2-space indentation (NEW)
- [decisions] Database is PostgreSQL (UPDATE)

Synced 3 memories successfully.
Backup saved to: ~/.claude/CLAUDE.md.bak
```

## Present Results to User

### After Adding Memory
```
Stored memory: "{content}"
Category: {category}
ID: {memory_id}

This memory will be available for semantic search across sessions.
```

### After Query
```
Based on your memories:

{answer}

Sources:
- {memory_1} (stored {date})
- {memory_2} (stored {date})
```

### After Sync
```
Synced {count} memories to {target}:

Added:
- {new_memory_1}
- {new_memory_2}

Updated:
- {updated_memory_1}

Your CLAUDE.md has been updated. Claude Code will now remember these across sessions.
```

## Troubleshooting

### Setup Fails - Python Version
```
Error: Python 3.10+ required

Fix: Install Python 3.10 or later:
  brew install python@3.10  # macOS
  sudo apt install python3.10  # Ubuntu
```

### API Key Not Set
```
Error: OPENAI_API_KEY not configured

Fix: Edit ~/.claude/memory/config.py and add your API key:
  OPENAI_API_KEY = "sk-..."

Supported providers:
- OpenAI
- Azure OpenAI
- Qwen (via OPENAI_BASE_URL)
```

### Memory Query Returns No Results
```
No memories found for: "{query}"

Suggestions:
1. Try rephrasing your question
2. Use broader search terms
3. Check if memories have been added with: bash .../list.sh
```

### Sync Conflicts
```
Warning: CLAUDE.md has local changes not in SimpleMem

Options:
1. Overwrite with SimpleMem memories: --force
2. Merge memories: --merge
3. Skip conflicting entries: --skip-conflicts
```

### Database Corruption
```
Error: Vector database corrupted

Fix: Rebuild the database:
  bash /mnt/skills/user/memory/scripts/setup.sh --rebuild
```

## Advanced Configuration

Edit `~/.claude/memory/config.py`:

```python
# Model settings
LLM_MODEL = "gpt-4.1-mini"  # Or your preferred model
EMBEDDING_MODEL = "Qwen/Qwen3-Embedding-0.6B"

# Memory settings
WINDOW_SIZE = 40  # Dialogues per compression window
OVERLAP = 2       # Overlap between windows

# Retrieval settings
SEMANTIC_SEARCH_LIMIT = 25
KEYWORD_SEARCH_LIMIT = 5
STRUCTURED_SEARCH_LIMIT = 5

# Parallel processing
ENABLE_PARALLEL_PROCESSING = True
MAX_PARALLEL_WORKERS = 8
```

## Best Practices

1. **Be Specific**: "User prefers tabs" is better than "formatting preference"
2. **Include Context**: "For Python files, use black formatter" is better than "use black"
3. **Sync Regularly**: Run sync after significant conversations
4. **Categorize**: Use categories to organize related memories
5. **Review Synced Files**: Check CLAUDE.md after sync to ensure accuracy
