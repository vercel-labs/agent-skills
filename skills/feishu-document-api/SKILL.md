---
name: feishu-document-api
description: Create, write, and manage Feishu (Lark) documents programmatically via the Open API. Automates document creation, block-level content writing, ownership transfer, and in-place content sync for Feishu/Lark enterprise workspaces.
license: MIT
metadata:
  author: hermes-agent
  version: "2.5.0"
---

# Feishu Document API

Use when the user asks to create, write to, or manipulate Feishu (Lark) documents via the Open API. Best for automating document creation, syncing content to Feishu, and building document-based workflows.

## How It Works

Feishu documents are block-based — every element (text, heading, bullet, table, code block) is a typed block. The API reads and writes at the block level.

### 1. Get Tenant Access Token

```
POST /open-apis/auth/v3/tenant_access_token/internal
Body: {"app_id": "${FEISHU_APP_ID}", "app_secret": "${FEISHU_APP_SECRET}"}
```
Response → `tenant_access_token` (expires in 2h, always fetch fresh)

### 2. Create Document

```
POST /open-apis/docx/v1/documents
Body: {"title": "Document Title"}
```
Returns `document_id` — used as both doc identifier and root block ID.

### 3. Add Content Blocks

```
POST /open-apis/docx/v1/documents/{doc_id}/blocks/{doc_id}/children
Body: {"children": [block_objects], "index": N}
```

**Block type reference:**

| Type | Key | Purpose |
|------|-----|---------|
| 1 | `page` | Root block (the document itself) |
| 2 | `text` | Normal paragraph |
| 3-7 | `heading1-5` | Section headings |
| 12 | `bullet` | Unordered list item |
| 13 | `ordered` | Numbered list |
| 14 | `code` | Code/monospace block |
| 15 | `quote` | Block quote |
| 31 | `table` | Native table (skeleton only) |
| 32 | `table_cell` | Auto-created cell within a table |

**Critical constraints:**
- **50 blocks max per POST** — chunk larger batches
- **No mixed block types in one batch** — all blocks in a POST must share the same `block_type`
- **No heading blocks (3-7) at the document root** via API — use bold text (type 2) as workaround
- **Empty text blocks rejected** — use `" "` (single space) as content

### 4. Transfer Document Ownership

When sharing fails, transfer ownership instead:
```
POST /open-apis/drive/v1/permissions/{doc_id}/members/transfer_owner?type=docx
Body: {"member_type": "openid", "member_id": "<user_open_id>"}
```
⚠️ Transfer BEFORE revealing the URL to avoid permission leaks.

## Prerequisites

- Feishu app with `docx:document` scope enabled
- `FEISHU_APP_ID` and `FEISHU_APP_SECRET` credentials
- The app must be published after adding scopes
- For sharing: `docs:permission.member:create` scope needed

## Usage

When a user asks to create a Feishu document:

1. Authenticate with tenant credentials
2. Create the document with the requested title
3. Write content blocks (chunked by type, max 50 per POST)
4. Transfer ownership to the intended user
5. Verify success before sharing the URL

For existing documents, read raw content via:
```
GET /open-apis/docx/v1/documents/{doc_id}/raw_content
```

For in-place updates: batch-delete old blocks, then POST new content.

## Full Documentation

For complete details including table creation (block_type 31), async content syncing workflows, and all verified pitfalls, see the [source repository](https://github.com/duruonanni/hermes-skill-kit/blob/main/feishu-document-api/SKILL.md).
