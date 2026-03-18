---
title: Include Detection Time in Context for Better Guidance
impact: HIGH
impactDescription: Calibrates response urgency and determines attacker dwell time window
tags: incident, timeline, detection, dwell-time, response
---

## Include Detection Time in Context for Better Guidance

**Impact: HIGH (calibrates response urgency and determines attacker dwell time window)**

Detection time is one of the most critical pieces of context during incident response. Whether an anomaly was detected 2 minutes ago or 3 days ago completely changes the recommended response: short dwell time favours immediate isolation, while extended dwell time requires forensic preservation and broader scope investigation. Always include when the incident was first detected.

**Incorrect (no timeline provided):**

```json
{
  "question": "Our database was compromised. What should we do?",
  "context": {
    "system_type": "PostgreSQL database",
    "environment": "production"
  }
}
```

**Correct (timeline included):**

```json
{
  "question": "Suspected database exfiltration incident. Provide response guidance.",
  "context": {
    "incident_type": "data_exfiltration",
    "detection_method": "SIEM alert on anomalous query volume",
    "detection_time": "15 minutes ago",
    "estimated_incident_start": "unknown — investigating logs",
    "affected_system_type": "PostgreSQL database (customer PII)",
    "observed_behaviour": "SELECT * queries on customer table, 50,000 rows exported in 8 minutes",
    "environment": "production",
    "compliance_requirements": ["GDPR", "PCI-DSS"]
  }
}
```

When the incident start time is unknown, state this explicitly. Cybercentry will advise on log forensics as part of the containment plan.

Reference: [CISA Incident Response Recommendations](https://www.cisa.gov/resources-tools/resources/federal-government-cybersecurity-incident-and-vulnerability-response-playbooks)
