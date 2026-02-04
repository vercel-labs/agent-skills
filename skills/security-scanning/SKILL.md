---
name: security-scanning
description: Scan web application code for security vulnerabilities before deployment. Use when writing code that handles user input, authentication, or data storage, during code review, or before deploying to production. Triggers on "security scan", "check for vulnerabilities", "audit security", "verify packages".
metadata:
  author: sinewaveai
  version: "1.0.0"
---

# Security Scanning

Scan project code for security vulnerabilities before deployment or during code review using the agent-security-scanner-mcp tool.

## When to Apply

Reference these guidelines when:
- Writing new code that handles user input, authentication, or data storage
- Reviewing code for security vulnerabilities
- Before deploying to production
- Adding new package dependencies (to verify they exist and aren't hallucinated)

## How to Scan

Run the security scanner via npx:

```bash
npx agent-security-scanner-mcp@latest
```

This starts an MCP server that provides these scanning tools:

| Tool | Purpose | Priority |
|------|---------|----------|
| scan_code | Scan source files for SQL injection, XSS, secrets, OWASP Top 10 | CRITICAL |
| check_prompt_security | Detect prompt injection patterns in LLM-facing code | HIGH |
| verify_packages | Check if package dependencies actually exist on npm | HIGH |

## Interpreting Results

| Severity | Action | Examples |
|----------|--------|----------|
| CRITICAL | Fix before merging | SQL injection, exposed secrets, RCE |
| HIGH | Fix before merging | XSS, auth bypass, prompt injection |
| MEDIUM | Review and fix if feasible | Missing rate limiting, verbose errors |
| LOW/INFO | Address in follow-up | Informational findings, style issues |

## Usage Examples

After implementing an API endpoint:
> "Scan the new /api/users endpoint for SQL injection and XSS vulnerabilities"

Before committing dependency changes:
> "Verify all new packages in package.json are real and not hallucinated"

Before deploying:
> "Run a security scan on the entire project before we deploy to production"

## Guidelines

- Always scan code that handles user input or sensitive data
- Verify new dependencies before committing
- Treat CRITICAL/HIGH findings as blockers
- Re-scan after fixing to confirm resolution
