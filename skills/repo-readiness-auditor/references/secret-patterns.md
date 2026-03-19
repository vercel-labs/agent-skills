# Secret Detection Patterns Reference

This file contains regex patterns for detecting hardcoded secrets in source code.
The repo-readiness-auditor skill uses these with `grep_search` (IsRegex=true).

Source: Perplexity research (gitleaks, truffleHog, detect-secrets, Snyk), 2026.

---

## How to Use

For each pattern category below, run `grep_search` with:
- `IsRegex: true`
- `MatchPerLine: true`
- Exclude: `node_modules/`, `.venv/`, `.git/`, `__pycache__/`, binary files

Classify each finding by severity:
- 🔴 **CRITICAL**: Live/production keys in source code files (`.py`, `.js`, `.ts`, `.cs`, etc.)
- 🟡 **WARNING**: Test/sandbox keys, or keys in `.env` files (should still be gitignored)
- ℹ️ **INFO**: Example/placeholder patterns (e.g., `YOUR_API_KEY_HERE`)

---

## Pattern Categories

### 1. AWS Credentials
```
Query: AKIA[0-9A-Z]{16}
Description: AWS Access Key ID
Severity: 🔴 CRITICAL
```
```
Query: aws_secret_access_key\s*[=:]\s*\S+
Description: AWS Secret Access Key assignment
Severity: 🔴 CRITICAL
```

### 2. GitHub Tokens
```
Query: gh[pousr]_[0-9A-Za-z]{36,}
Description: GitHub Personal Access Token (classic)
Severity: 🔴 CRITICAL
```
```
Query: github_pat_[0-9A-Za-z_]{80,}
Description: GitHub Fine-Grained Token
Severity: 🔴 CRITICAL
```

### 3. Google / GCP
```
Query: AIza[0-9A-Za-z\-_]{35}
Description: Google API Key
Severity: 🔴 CRITICAL
```
```
Query: -----BEGIN (RSA |EC )?PRIVATE KEY-----
Description: Private key block (Google service account or SSH)
Severity: 🔴 CRITICAL
```

### 4. Stripe
```
Query: sk_live_[0-9a-zA-Z]{24,}
Description: Stripe Live Secret Key
Severity: 🔴 CRITICAL
```
```
Query: sk_test_[0-9a-zA-Z]{24,}
Description: Stripe Test Secret Key
Severity: 🟡 WARNING
```
```
Query: pk_live_[0-9a-zA-Z]{24,}
Description: Stripe Live Publishable Key
Severity: 🟡 WARNING (publishable, but still worth flagging)
```

### 5. AI Provider Keys
```
Query: sk-[0-9a-zA-Z]{20,}
Description: OpenAI API Key
Severity: 🔴 CRITICAL
```
```
Query: sk-ant-[0-9a-zA-Z\-]{20,}
Description: Anthropic API Key
Severity: 🔴 CRITICAL
```

### 6. Database Connection Strings
```
Query: (postgres|mysql|mongodb(\+srv)?|redis|amqp)://[^\s'"]+:[^\s'"]+@
Description: Database URI with embedded password
Severity: 🔴 CRITICAL
```
```
Query: (Password|password|pwd)\s*[=:]\s*[^\s'"]{8,}
Description: Password assignment in config (non-empty, 8+ chars)
Severity: 🔴 CRITICAL
```

### 7. JWT Tokens
```
Query: eyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}
Description: JWT token (3 base64url segments)
Severity: 🟡 WARNING (could be example data, but flag it)
```

### 8. Generic Secret Assignments
```
Query: (API_KEY|SECRET_KEY|ACCESS_TOKEN|AUTH_TOKEN|PRIVATE_KEY)\s*[=:]\s*['"][A-Za-z0-9+/=\-_]{16,}['"]
Description: Generic secret variable with hardcoded value
Severity: 🔴 CRITICAL
```
```
Query: (password|secret|token|api_key|apikey)\s*[=:]\s*['"][^'"]{8,}['"]
Description: Common secret variable names with inline values
Severity: 🟡 WARNING (verify if real or placeholder)
```

### 9. SSH Private Keys
```
Query: -----BEGIN (RSA |DSA |EC |OPENSSH )?PRIVATE KEY-----
Description: SSH/TLS private key
Severity: 🔴 CRITICAL
```

### 10. Supabase
```
Query: sbp_[0-9a-f]{40,}
Description: Supabase service role key
Severity: 🔴 CRITICAL
```
```
Query: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+
Description: Supabase anon/service JWT (specific header)
Severity: 🟡 WARNING
```

### 11. Firebase
```
Query: AIza[0-9A-Za-z\-_]{35}
Description: Firebase API Key (same pattern as Google API Key)
Severity: 🟡 WARNING (Firebase keys are meant to be public, but flag for review)
```

### 12. Slack
```
Query: xox[baprs]-[0-9A-Za-z\-]{10,48}
Description: Slack Bot/User/App token
Severity: 🔴 CRITICAL
```
```
Query: hooks\.slack\.com/services/T[a-zA-Z0-9_]+/B[a-zA-Z0-9_]+/[a-zA-Z0-9_]+
Description: Slack Webhook URL
Severity: 🔴 CRITICAL
```

### 13. Azure
```
Query: AccountKey=[A-Za-z0-9+/=]{44,}
Description: Azure Storage Account Key
Severity: 🔴 CRITICAL
```

### 14. Heroku
```
Query: [hH]eroku.*[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}
Description: Heroku API Key (UUID format)
Severity: 🔴 CRITICAL
```

### 15. SendGrid / Mailgun / Twilio
```
Query: SG\.[0-9A-Za-z\-_]{22}\.[0-9A-Za-z\-_]{43}
Description: SendGrid API Key
Severity: 🔴 CRITICAL
```
```
Query: key-[0-9a-zA-Z]{32}
Description: Mailgun API Key
Severity: 🔴 CRITICAL
```
```
Query: SK[0-9a-fA-F]{32}
Description: Twilio API Key
Severity: 🔴 CRITICAL
```

---

## Production Config Anti-Patterns

These patterns indicate production misconfigurations, not secrets per se,
but they are dangerous if committed:

```
Query: DEBUG\s*=\s*(True|true|1|on)
Description: Debug mode enabled (Django, Flask, etc.)
Severity: 🟡 WARNING
```
```
Query: ALLOWED_HOSTS\s*=\s*\[['"]?\*['"]?\]
Description: Django ALLOWED_HOSTS set to wildcard
Severity: 🟡 WARNING
```
```
Query: CORS_ALLOW_ALL_ORIGINS\s*=\s*(True|true)
Description: CORS allowing all origins
Severity: 🟡 WARNING
```

---

## Files to ALWAYS Exclude from Scanning

These directories/files will generate false positives:
- `node_modules/`
- `.venv/`, `venv/`, `env/`
- `__pycache__/`
- `.git/`
- `*.min.js`, `*.min.css` (minified vendor files)
- `*.lock` (package lock files)
- `*.svg`, `*.png`, `*.jpg` (binary/image files)
- Documentation files that show example patterns
