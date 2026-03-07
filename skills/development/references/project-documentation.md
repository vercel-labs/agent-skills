# Project Documentation Templates

Every project should have these four files. Create if missing, update if stale.

## README.md

```markdown
# Project Name

One-paragraph description of what this project does.

## Features
- Feature 1: Brief description

## Architecture
High-level overview (components, data flow, key technologies).

## Usage
How to run and use the project. Key commands, endpoints, or UI entry points.

## Configuration
Environment variables, config files, and their purposes.
```

Focus on WHAT and WHY, not HOW to install (that's INSTALLATION.md).

## INSTALLATION.md

Always prefer `uv` for Python. Structure:

```markdown
# Installation

## Prerequisites
List exact versions required (Python 3.11+, Node 18+, etc.)

## Quick Start
\```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
git clone <repo-url>
cd <project-name>
uv venv --python 3.11
source .venv/bin/activate
uv pip install <dependencies>
\```

## All-in-one install (copy-paste)
Single block the user can paste to go from zero to running.

## Environment Variables
| Variable | Default | Description |
|----------|---------|-------------|

## Running Tests
Exact commands to run the test suite.

## Troubleshooting
Common issues and their fixes.
```

Rules: Use `uv pip install` not `pip install`. Use `uv venv` not `python -m venv`. Every dependency must be explicitly listed.

## METHODS.md

```markdown
# Methods & Algorithms

## Overview
Brief description of the technical approach.

## [Method Name]
### Purpose
### How It Works
Step-by-step with pseudocode or file:line references.
### Parameters / Configuration
### Trade-offs

## Key Design Decisions
| Decision | Chosen Approach | Alternatives | Rationale |
|----------|----------------|--------------|-----------|
```

Focus on NON-OBVIOUS decisions. Reference actual code locations. Explain the WHY.

## TODO.md

```markdown
# TODO

## High Priority
- [ ] Critical bug or feature

## Medium Priority
- [ ] Enhancement or improvement

## Low Priority
- [ ] Nice-to-have or cleanup
```

Keep current — remove completed items promptly.
