---
name: github-star-organizer
description: Automatically categorize and organize GitHub stars into native GitHub Star Lists using AI-powered classification. Make sure to use this skill whenever the user mentions organizing stars, cleaning up GitHub, managing starred repositories, or grouping stars by topic, even if they don't explicitly ask for "Lists".
author: luoage
version: 1.1.0
homepage: https://github.com/luoage/github-star-organizer
license: MIT
requires:
  - gh (GitHub CLI)
  - python3
  - GitHub token with 'user' scope
trigger_keywords:
  - organize stars
  - categorize my GitHub stars
  - manage starred repos
  - clean up GitHub stars
  - group stars by topic
---

## Purpose
Automatically classify your GitHub stars into meaningful categories (e.g., "AI", "DevOps", "Frontend") using AI inference, then create and populate **GitHub Star Lists**—a native GitHub feature for organizing stars.

> ✅ Ideal for managing hundreds or thousands of unorganized stars efficiently.

## Workflow

1. **Verify Authentication**  
   - Check status: `gh auth status`
   - Login if needed: `gh auth login`
   - Refresh scope if `user` permission is missing: `gh auth refresh -s user`

2. **Set User Preferences**  
   - Ask for the preferred language for category names (e.g., English or Chinese).
   - Determine if the user has specific categories in mind or wants the AI to suggest them.

3. **Fetch All Starred Repositories**  
   Execute the retrieval script:
   ```bash
   python3 github-star-organizer/scripts/get_all_stars.py
   ```
   - This retrieves all starred repositories via the GitHub CLI.

4. **Categorize Stars (AI-Powered)**
   - **For small lists (< 50 stars):** The AI can generate the `stars_with_category.json` directly.
   - **For large lists (> 50 stars):** To avoid truncation and ensure all stars are processed, **always use a Python script** to perform the categorization. Use keywords or a local LLM call to map each star to a `categorizeName`.
   - Ensure each category contains at least 4 projects to avoid cluttered lists.
   - The final output must be saved to `stars_with_category.json` in this format:
     ```json
     [
       {
         "id": "MDEwOlJlcG9zaXRvcnkxNDEzNDky",
         "nameWithOwner": "defunkt/jquery-pjax",
         "description": "pushState + ajax = pjax",
         "categorizeName": "Web Frontend"
       }
     ]
     ```

5. **Review and Refine**
   - Present the proposed categories and sample mappings to the user.
   - Allow the user to adjust category names or group assignments until satisfied.

6. **Sync to GitHub Star Lists**
   Execute the sync script:
   ```bash
   python3 scripts/organizer.py
   ```
   - Reads `stars_with_category.json`.
   - Creates new GitHub Star Lists as needed.
   - Adds repositories to their respective lists via the GitHub API.

## Files Included
1. `scripts/get_all_stars.py` – Fetches all starred repos using `gh api`.
2. `scripts/organizer.py` – Manages GitHub Lists via REST/GraphQL API.
3. `stars_with_category.json` – The intermediate classification file.

## Troubleshooting
- **Missing Stars?** If only a fraction of stars were processed, it was likely due to manual categorization hitting output limits. Re-run the categorization using a programmatic script as described in step 4.
- **Permission Errors?** Ensure your GitHub token has the `user` scope. Run `gh auth refresh -s user` to fix.
