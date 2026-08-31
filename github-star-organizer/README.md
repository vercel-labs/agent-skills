# GitHub Star Organizer (Agent Skill)

An AI-powered agent skill designed to automatically categorize and organize your GitHub stars into native **GitHub Star Lists**.

## 🌟 Key Features

- **AI-Powered Classification**: Automatically identifies the purpose of repositories (e.g., AI, Frontend, DevOps) and groups them logically.
- **Native Integration**: Uses the official GitHub GraphQL API to create and manage Star Lists directly on your account.
- **Scalable**: Handles both small collections and large sets of stars (hundreds or thousands) with optimized workflows.
- **Permission Auto-fix**: Includes built-in logic to detect and help refresh missing GitHub CLI scopes.

## 📋 Prerequisites

1. **GitHub CLI (`gh`)**: Must be installed and authenticated.
2. **Required Scopes**: Your GitHub token must have the `user` scope (required for Star Lists).
   - Check status: `gh auth status`
   - Refresh scope: `gh auth refresh -s user`
3. **Python 3**: Required to run the background processing scripts.

## 🚀 Workflow

When you activate this skill in Gemini CLI or a compatible agent, it follows these steps:

### 1. Verification
The agent checks if you are logged in via `gh` and ensures you have the correct permissions.

### 2. Fetching Stars
The agent runs a script to retrieve all your starred repositories:
```bash
python3 scripts/get_all_stars.py
```

### 3. Categorization
- **Small Sets**: For fewer than 50 stars, the agent can propose categories directly in the chat.
- **Large Sets (>50)**: To avoid context limits, the agent uses a programmatic approach to map stars to categories in `stars_with_category.json`.
- **Customization**: You can specify preferred languages for category names or request specific topics.

### 4. Syncing to GitHub
Once you approve the categorization, the agent executes the sync script:
```bash
python3 scripts/organizer.py
```
This script creates the necessary Star Lists on GitHub and adds the repositories to them.

## 📂 File Structure

- `SKILL.md`: The core definition file that instructs the AI on how to handle the organization process.
- `scripts/get_all_stars.py`: Fetches starred repo data using GitHub GraphQL.
- `scripts/organizer.py`: Creates Star Lists and performs the final synchronization.
- `scripts/util.py`: Shared utilities including GraphQL wrappers and permission handlers.
- `stars_with_category.json`: The intermediate data file stores classifications before syncing.

## 💡 Tips

- **Review Before Sync**: You can manually edit `stars_with_category.json` if you want to fine-tune the AI's suggestions before they are pushed to GitHub.
- **Clean Lists**: The skill defaults to ensuring categories have enough projects to keep your Star Lists tidy.
- **Incremental Updates**: The sync script detects existing lists and avoids duplicates.

---
*Developed for use with Gemini CLI and compatible AI Agents.*
