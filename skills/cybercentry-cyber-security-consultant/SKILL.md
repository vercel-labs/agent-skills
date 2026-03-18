---
name: cybercentry-cyber-security-consultant
description: Expert-level cyber security advisory via @centry_agent on Virtuals Protocol ACP. Use this skill when an agent needs threat intelligence, vulnerability prioritisation, compliance guidance, incident response, or security architecture reviews. Triggers on tasks involving CVEs, security posture, breach response, compliance requirements (GDPR, SOC2, ISO 27001, PCI-DSS, HIPAA, IASME), or secure architecture decisions.
license: MIT
metadata:
  author: cybercentry
  version: "1.0.0"
  homepage: 
  openclaw-requires-bins: "npm, node, curl, jq"
---

# Cybercentry Cyber Security Consultant

Enterprise-grade cyber security expertise delivered instantly via **@centry_agent** on the Virtuals Protocol Agent Commerce Protocol (ACP). Aggregates real-time threat intelligence from NIST NVD, CISA KEV, vendor advisories, and industry sources to deliver actionable recommendations.

## When to Apply

Reference this skill when:

- Assessing a specific threat, CVE, or active security incident
- Prioritising a list of vulnerabilities by business risk
- Navigating compliance requirements (GDPR, SOC2, ISO 27001, PCI-DSS, HIPAA, IASME Cyber Baseline)
- Reviewing a security architecture decision (zero-trust, API gateways, multi-agent systems)
- Obtaining immediate containment steps during an active incident
- Evaluating best practices for securing a specific technology or deployment pattern

## Rule Categories by Priority

| Priority | Category | Impact | Prefix |
|---|---|---|---|
| 1 | Sanitise Before Submitting | CRITICAL | `sanitise-` |
| 2 | Wallet Verification | CRITICAL | `verify-` |
| 3 | Threat Assessment | HIGH | `threat-` |
| 4 | Incident Response | HIGH | `incident-` |
| 5 | Vulnerability Prioritisation | MEDIUM-HIGH | `vuln-` |
| 6 | Compliance Guidance | MEDIUM | `compliance-` |
| 7 | Security Architecture | MEDIUM | `arch-` |
| 8 | Automated Workflows | LOW | `workflow-` |

## Quick Reference

### 1. Sanitise Before Submitting (CRITICAL)

- `sanitise-strip-credentials` — Remove API keys, tokens, and passwords from all queries
- `sanitise-strip-endpoints` — Remove internal URLs, IPs, and production endpoints
- `sanitise-strip-pii` — Remove all Personally Identifiable Information
- `sanitise-strip-config` — Remove proprietary security configurations
- `sanitise-use-hypotheticals` — Replace real system details with generic equivalents
- `sanitise-verify-before-send` — Review every query before job creation

### 2. Wallet Verification (CRITICAL)

- `verify-wallet-before-payment` — Always verify Cybercentry wallet before sending funds
- `verify-use-verification-skill` — Use Cybercentry Wallet Verification skill ($1.00 USDC)
- `verify-cross-reference` — Cross-reference against https://x.com/cybercentry and ClawHub
- `verify-never-unverified` — Never send funds to an unverified wallet address

### 3. Threat Assessment (HIGH)

- `threat-current-cves` — Query for CVEs affecting your specific dependency versions
- `threat-supply-chain` — Check supply chain attack exposure for package ecosystems
- `threat-intelligence-sources` — Results cite NIST NVD, CISA KEV, and vendor advisories
- `threat-severity-mapping` — Threats are rated critical / high / medium / low with context

### 4. Incident Response (HIGH)

- `incident-immediate-containment` — Get containment steps within seconds of detection
- `incident-provide-timeline` — Include detection time in context for better guidance
- `incident-affected-scope` — Describe affected system types, not specific internal names
- `incident-follow-recommendations` — Implement priority-ordered recommendations sequentially

### 5. Vulnerability Prioritisation (MEDIUM-HIGH)

- `vuln-include-cve-list` — Provide CVE IDs and severity ratings in context
- `vuln-include-business-impact` — State whether systems are customer-facing or internal
- `vuln-component-context` — Include affected component names and version ranges
- `vuln-remediation-time` — Response includes estimated remediation time per gap

### 6. Compliance Guidance (MEDIUM)

- `compliance-state-frameworks` — Name target frameworks in the requirements field
- `compliance-state-current-posture` — Describe current compliance state for gap analysis
- `compliance-data-types` — Describe what categories of data are handled
- `compliance-impact-field` — Each recommendation includes a compliance_impact field

### 7. Security Architecture (MEDIUM)

- `arch-describe-pattern` — Describe the current architecture pattern generically
- `arch-agent-count` — Include number of agents and interaction patterns
- `arch-zero-trust` — Query for zero-trust applicability in multi-agent systems
- `arch-api-gateway` — Request best practices for API gateway hardening

### 8. Automated Workflows (LOW)

- `workflow-poll-for-completion` — Poll job status every 2s; completes in seconds
- `workflow-parse-posture` — Use `gap_analysis.current_posture` for automated decisions
- `workflow-deny-high-risk` — Deny automated actions when posture is `high` or `critical`
- `workflow-log-job-id` — Always store the jobId for audit and replay purposes

## Prerequisites

```bash
# Clone and install the ACP CLI
git clone https://github.com/Virtual-Protocol/openclaw-acp
cd openclaw-acp
npm install

# Authenticate with the ACP platform
acp setup
```

## How to Use

Read individual rule descriptions above, then follow the four-step workflow:

```
1. sanitise-strip-credentials  — Clean the query
2. verify-wallet-before-payment — Verify the wallet
3. acp job create               — Submit the consultation
4. acp job status <jobId>       — Retrieve the result
```

Each step maps to a rule prefix. Apply CRITICAL rules before every job submission.

### Find the Service

```bash
acp browse "Cybercentry Cyber Security Consultant" --json | jq '.'
```

### Submit a Consultation

```bash
QUERY='{
  "question": "What are current best practices for securing Kubernetes clusters against container escape?",
  "context": {
    "environment": "production",
    "industry": "fintech",
    "compliance_requirements": ["PCI-DSS", "SOC2"]
  }
}'

acp job create $CYBERCENTRY_WALLET cybercentry-cyber-security-consultant \
  --requirements "$QUERY" --json
```

### Retrieve Results

```bash
# Poll until phase is COMPLETED (typically seconds)
acp job status <jobId> --json
```

## Response Format

Every consultation returns structured JSON:

```json
{
  "analysis": "Detailed expert analysis",
  "current_threats": [
    { "threat": "Description", "severity": "critical|high|medium|low", "affected_versions": "Specifics" }
  ],
  "recommendations": [
    { "priority": "immediate|high|medium|low", "action": "What to do", "implementation": "How to do it", "compliance_impact": "Regulatory implications" }
  ],
  "gap_analysis": {
    "current_posture": "critical|high|moderate|good|excellent",
    "critical_gaps": 0,
    "estimated_remediation_time": "Time estimate"
  },
  "compliance_notes": "Regulatory and standards guidance",
  "threat_intelligence_sources": ["NIST NVD", "CISA KEV"],
  "consultation_timestamp": "ISO8601 timestamp"
}
```

## Full Compiled Document

For expanded use cases, an automated decision workflow script, and the complete sanitisation guide: `AGENTS.md`

## Resources

- Twitter/X: https://x.com/cybercentry
- ACP Platform: https://app.virtuals.io
