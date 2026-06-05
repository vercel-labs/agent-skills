---
name: bitbucket-mcp-server
description: Full reference for @aashari/mcp-server-atlassian-bitbucket MCP server that connects AI assistants to Bitbucket Cloud REST API 2.0. Covers bb_get, bb_post, bb_put, bb_patch, bb_delete, bb_clone pass-through tools, authentication, common API paths (PRs, repos, branches, commits, pipelines), inline PR comments, cost optimization with jq/TOON, and CLI via npx. Use when interacting with Bitbucket Cloud — list PRs, create/merge/approve/decline PRs, add inline code-level comments, list branches, create repos, clone repos, or perform any Bitbucket API operation.
license: MIT
metadata:
  author: shafiqimtiaz
  version: "1.0.0"
---

# Bitbucket MCP Server (`@aashari/mcp-server-atlassian-bitbucket`)

## Overview

This MCP server connects AI assistants to **Bitbucket Cloud** via the REST API 2.0. It exposes 6 generic HTTP pass-through tools (`bb_get`, `bb_post`, `bb_put`, `bb_patch`, `bb_delete`, `bb_clone`) that map directly to Bitbucket API endpoints — no wrapper abstractions, full API surface available.

**Package:** `@aashari/mcp-server-atlassian-bitbucket`  
**API base:** `https://api.bitbucket.org/2.0` (the `/2.0` prefix is added automatically)  
**API reference:** `https://developer.atlassian.com/cloud/bitbucket/rest/`

## Prerequisites

The MCP server must be configured in the agent's MCP settings pointing to `@aashari/mcp-server-atlassian-bitbucket`.

### Authentication

Set one of these credential pairs:

**Option A — Scoped API Token (recommended):**
```
ATLASSIAN_USER_EMAIL=your.email@company.com
ATLASSIAN_API_TOKEN=ATATT...
```

**Option B — App Password (deprecated June 2026):**
```
ATLASSIAN_BITBUCKET_USERNAME=your_username
ATLASSIAN_BITBUCKET_APP_PASSWORD=your_app_password
```

Required Bitbucket scopes: `repository`, `workspace`, `pullrequest:write`, `pullrequest`

## Tools Reference

### `bb_get` — Read any Bitbucket resource

| Param | Required | Description |
|---|---|---|
| `path` | yes | API endpoint path (e.g. `/workspaces`) |
| `queryParams` | no | Key-value query params (`{"pagelen": "10", "q": "state=\"OPEN\""}`) |
| `jq` | no | JMESPath filter to extract/reshape fields |
| `outputFormat` | no | `"toon"` (default, 30-60% fewer tokens) or `"json"` |

### `bb_post` — Create resources

Same as `bb_get` plus:

| Param | Required | Description |
|---|---|---|
| `body` | yes | JSON request body |

### `bb_put` — Full replace of a resource

Same as `bb_post`.

### `bb_patch` — Partial update of a resource

Same as `bb_post`.

### `bb_delete` — Delete a resource

Same as `bb_get` (no body). Most return 204 No Content.

### `bb_clone` — Clone a repository locally

| Param | Required | Description |
|---|---|---|
| `repoSlug` | yes | Repository slug |
| `targetPath` | yes | Absolute path to clone into |

Clones into `targetPath/repoSlug`. Uses SSH (preferred), falls back to HTTPS.

## Common API Paths

### Workspaces & Repositories

| Path | Methods | Purpose |
|---|---|---|
| `/workspaces` | GET | List workspaces |
| `/repositories/{workspace}` | GET | List repos in workspace |
| `/repositories/{workspace}/{repo}` | GET / PUT | Get / update repo details |
| `/repositories/{workspace}/{repo}/refs/branches` | GET | List branches |
| `/repositories/{workspace}/{repo}/refs/branches/{name}` | GET / DELETE | Get / delete a branch |
| `/repositories/{workspace}/{repo}/commits` | GET | List commits |
| `/repositories/{workspace}/{repo}/commits/{commit}` | GET | Get a commit |
| `/repositories/{workspace}/{repo}/src/{commit}/{filepath}` | GET | Get file content at commit |
| `/repositories/{workspace}/{repo}/diff/{source}..{destination}` | GET | Compare branches/commits |

### Pull Requests

| Path | Methods | Purpose |
|---|---|---|
| `/repositories/{ws}/{repo}/pullrequests` | GET / POST | List / create PRs |
| `/repositories/{ws}/{repo}/pullrequests/{id}` | GET / PATCH / DELETE | Get / update / delete PR |
| `/repositories/{ws}/{repo}/pullrequests/{id}/diff` | GET | Get PR diff |
| `/repositories/{ws}/{repo}/pullrequests/{id}/comments` | GET / POST | List / add PR comments |
| `/repositories/{ws}/{repo}/pullrequests/{id}/comments/{cid}` | PATCH / DELETE | Edit / delete a comment |
| `/repositories/{ws}/{repo}/pullrequests/{id}/approve` | POST / DELETE | Approve / remove approval |
| `/repositories/{ws}/{repo}/pullrequests/{id}/request-changes` | POST | Request changes |
| `/repositories/{ws}/{repo}/pullrequests/{id}/merge` | POST | Merge PR |
| `/repositories/{ws}/{repo}/pullrequests/{id}/decline` | POST | Decline PR |
| `/repositories/{ws}/{repo}/pullrequests/{id}/activity` | GET | Activity log |

### Other

| Path | Methods | Purpose |
|---|---|---|
| `/repositories/{ws}/{repo}/issues` | GET / POST | List / create issues |
| `/repositories/{ws}/{repo}/pipelines` | GET / POST | List / trigger pipelines |
| `/repositories/{ws}/{repo}/deployments` | GET | List deployments |

## Request Body Reference

### Create a PR
```json
{
  "title": "My feature",
  "source": {"branch": {"name": "feature-branch"}},
  "destination": {"branch": {"name": "main"}},
  "description": "Optional description",
  "reviewers": [{"uuid": "{user-uuid}"}],
  "close_source_branch": true,
  "draft": false
}
```

### Add a general PR comment
```json
{"content": {"raw": "Looks good to me!"}}
```

### Add an inline (code-level) PR comment

Anchored to a specific file and line in the PR diff:

```json
{
  "content": {"raw": "This variable name is unclear."},
  "inline": {
    "path": "src/auth/login.ts",
    "to": 37
  }
}
```

**`inline` field rules:**

| Field | When to Use |
|---|---|
| `path` | File path relative to repo root (must match diff exactly) |
| `to` | Line number in the **new** (destination) file — for added/changed code |
| `from` | Line number in the **old** (source) file — for deleted/removed code |

> **CRITICAL: Never use `from` and `to` together.** The Bitbucket API silently ignores `to` when `from` is present. Pick one:
> - Added/changed line → `to`
> - Removed line → `from`

To find the correct file paths and line numbers, first fetch the PR diff:
```
bb_get → /repositories/{workspace}/{repo}/pullrequests/{id}/diff
```

### Approve a PR
```json
{}
```

### Request changes on a PR
```json
{}
```

### Merge a PR
```json
{"merge_strategy": "squash"}
```

Merge strategies: `merge_commit`, `squash`, `fast_forward`

### Decline a PR
```json
{}
```

### Update PR title / description
```json
{"title": "New title", "description": "Updated description"}
```

### Update PR reviewers
```json
{"reviewers": [{"uuid": "{user-uuid}"}]}
```

### Edit a PR comment
```json
{"content": {"raw": "Updated text"}}
```

## Output Format

Default is **TOON** (Token-Oriented Object Notation) — 30–60% fewer tokens than JSON.

```
TOON example:
values:
  name  | slug
  repo1 | repo-1
  repo2 | repo-2
```

Pass `outputFormat: "json"` to get standard JSON.

## JMESPath Filtering (`jq`)

**Always use `jq`** to extract only the fields you need — unfiltered responses are expensive.

| Pattern | Effect |
|---|---|
| `values[*].slug` | Extract one field from all items |
| `values[*].{id: id, title: title}` | Custom object with selected fields |
| `values[0]` | First item only |
| `values[:5]` | First 5 items |
| `values[?state=='OPEN']` | Filter by condition |
| `{id: id, content: content.raw}` | Single object reshape |

## Query Parameters (`queryParams`)

| Param | Description |
|---|---|
| `pagelen` | Page size (e.g. `"10"`) |
| `page` | Page number |
| `q` | Server-side filter (`state="OPEN"`, `title~"bug"`) |
| `sort` | Sort field (`-updated_on` for descending) |
| `fields` | Sparse fieldset (`values.id,values.title`) |

## Schema Discovery

When unsure what fields are available:

1. Fetch **one item** with no `jq`: `queryParams: {"pagelen": "1"}`
2. Inspect the response fields
3. Re-fetch with `jq` targeting the fields you need

## Cost Optimization

1. **Always use `jq`** — unfiltered responses burn tokens
2. **Set `pagelen`** — default page sizes can be large
3. **Use server-side `q` filtering** — reduces payload before it reaches the tool
4. **Use `fields` sparse fieldsets** — reduces payload at the API level
5. **TOON is default** — don't switch to JSON unless you need the full schema

## Example Workflows

### List open PRs
```
bb_get → path: /repositories/myworkspace/myrepo/pullrequests
         queryParams: {"pagelen": "10"}
         jq: values[*].{id: id, title: title, state: state, author: author.display_name}
```

### Get PR diff (for inline comment line numbers)
```
bb_get → path: /repositories/myworkspace/myrepo/pullrequests/42/diff
```

### Create a PR
```
bb_post → path: /repositories/myworkspace/myrepo/pullrequests
          body: {"title": "Add login feature", "source": {"branch": {"name": "feature-login"}}, "destination": {"branch": {"name": "main"}}}
          jq: {id: id, title: title}
```

### Add an inline comment on a PR
```
bb_post → path: /repositories/myworkspace/myrepo/pullrequests/42/comments
          body: {"content": {"raw": "This should use a constant instead of magic number."}, "inline": {"path": "src/auth/login.ts", "to": 37}}
          jq: {id: id, content: content.raw}
```

### Add a general PR comment
```
bb_post → path: /repositories/myworkspace/myrepo/pullrequests/42/comments
          body: {"content": {"raw": "Overall this PR looks good."}}
          jq: {id: id}
```

### Approve a PR
```
bb_post → path: /repositories/myworkspace/myrepo/pullrequests/42/approve
          body: {}
```

### Merge a PR
```
bb_post → path: /repositories/myworkspace/myrepo/pullrequests/42/merge
          body: {"merge_strategy": "squash"}
          jq: {state: state, merge_commit: merge_commit.hash}
```

### List branches
```
bb_get → path: /repositories/myworkspace/myrepo/refs/branches
         jq: values[*].{name: name, target: target.hash}
```

### Delete a branch
```
bb_delete → path: /repositories/myworkspace/myrepo/refs/branches/old-feature-branch
```

### Clone a repo locally
```
bb_clone → repoSlug: myrepo
           targetPath: /home/user/projects
```

### Get repository details
```
bb_get → path: /repositories/myworkspace/myrepo
         jq: {name: name, slug: slug, is_private: is_private, mainbranch: mainbranch.name}
```

## CLI Usage (npx)

All tools available via CLI without an MCP client:

```bash
# GET
npx -y @aashari/mcp-server-atlassian-bitbucket get \
  --path "/repositories/myworkspace/myrepo/pullrequests" \
  --jq "values[*].{id: id, title: title}"

# POST (create PR)
npx -y @aashari/mcp-server-atlassian-bitbucket post \
  --path "/repositories/myworkspace/myrepo/pullrequests" \
  --body '{"title": "My PR", "source": {"branch": {"name": "feature"}}, "destination": {"branch": {"name": "main"}}}'

# POST with query params
npx -y @aashari/mcp-server-atlassian-bitbucket post \
  --path "/repositories/myworkspace/myrepo/pullrequests/42/comments" \
  --body '{"content": {"raw": "Looks good!"}}' \
  --query-params '{"fields": "id,content"}' \
  --jq "{id: id, content: content.raw}"
```
