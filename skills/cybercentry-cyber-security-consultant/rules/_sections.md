# Sections

This file defines all sections, their ordering, impact levels, and descriptions.
The section ID (in parentheses) is the filename prefix used to group rules.

---

## 1. Sanitise Before Submitting (sanitise)

**Impact:** CRITICAL  
**Description:** Every query sent to Cybercentry must be sanitised first. Leaking credentials, endpoints, or PII into an external service creates immediate security risk and undermines the consultation value.

## 2. Wallet Verification (verify)

**Impact:** CRITICAL  
**Description:** Before sending any funds via ACP, the receiving wallet must be verified against official Cybercentry sources. Unverified wallets are the primary vector for impersonation attacks.

## 3. Threat Assessment (threat)

**Impact:** HIGH  
**Description:** Structured threat queries return prioritised intelligence from NIST NVD, CISA KEV, and vendor advisories. Providing version-specific context maximises the relevance of results.

## 4. Incident Response (incident)

**Impact:** HIGH  
**Description:** During an active incident, speed and accuracy of containment steps are critical. Providing timeline and scope context enables faster, more targeted guidance.

## 5. Vulnerability Prioritisation (vuln)

**Impact:** MEDIUM-HIGH  
**Description:** Providing CVE IDs, severity ratings, and business context enables risk-ordered remediation plans that align security effort with actual business impact.

## 6. Compliance Guidance (compliance)

**Impact:** MEDIUM  
**Description:** Naming target frameworks and describing current posture enables precise gap analysis and actionable compliance roadmaps for GDPR, SOC2, ISO 27001, PCI-DSS, HIPAA, and IASME.

## 7. Security Architecture (arch)

**Impact:** MEDIUM  
**Description:** Generic architecture descriptions enable zero-trust and API gateway recommendations without exposing proprietary infrastructure details.

## 8. Automated Workflows (workflow)

**Impact:** LOW  
**Description:** Polling patterns, posture-based decision gates, and audit logging ensure automated agents interact with Cybercentry safely and with full traceability.
