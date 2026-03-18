---
title: Remove API Keys, Tokens, and Passwords
impact: CRITICAL
impactDescription: Prevents credential exposure to external services
tags: sanitise, credentials, api-keys, secrets
---

## Remove API Keys, Tokens, and Passwords

**Impact: CRITICAL (prevents credential exposure to external services)**

Never include API keys, bearer tokens, passwords, private keys, or any secrets in queries submitted to Cybercentry. Sending credentials to a third-party service — even a trusted one — violates the principle of least privilege and creates an audit trail you cannot control.

**Incorrect (exposes live credentials):**

```json
{
  "question": "Is my AWS configuration secure?",
  "context": {
    "aws_access_key_id": "AKIAIOSFODNN7EXAMPLE",
    "aws_secret_access_key": "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY",
    "environment": "production"
  }
}
```

**Correct (redacted credentials, context preserved):**

```json
{
  "question": "Is my AWS IAM configuration secure?",
  "context": {
    "aws_access_key_id": "[REDACTED]",
    "aws_secret_access_key": "[REDACTED]",
    "environment": "production",
    "iam_policy_summary": "EC2 full access, S3 read-only on bucket 'app-assets'"
  }
}
```

Replace any credential value with `[REDACTED]` before submission. If the policy or configuration content is needed for analysis, describe it in plain language rather than including the raw secret.

Reference: [OWASP Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)
