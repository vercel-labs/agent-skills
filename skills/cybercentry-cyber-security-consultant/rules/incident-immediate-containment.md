---
title: Get Containment Steps Within Seconds of Detection
impact: HIGH
impactDescription: Minimises breach window by delivering immediate, actionable containment
tags: incident, containment, response, breach, immediate
---

## Get Containment Steps Within Seconds of Detection

**Impact: HIGH (minimises breach window by delivering immediate, actionable containment)**

During an active incident, every minute of delay increases attacker dwell time and data exfiltration risk. Cybercentry returns priority-ordered containment steps within seconds. The first step in your playbook during any security event should be to submit a containment query — before conducting full investigation or notifying stakeholders.

**Incorrect (delays query for investigation first):**

```json
{
  "question": "We think we had a breach last week. Can you tell us what happened?",
  "context": {
    "systems": "web application"
  }
}
```

**Correct (immediate containment query with current incident context):**

```json
{
  "question": "ACTIVE INCIDENT: Provide immediate containment steps. Do not wait for full investigation context.",
  "context": {
    "incident_type": "suspected_api_compromise",
    "detection_time": "2 minutes ago",
    "affected_system_type": "public REST API",
    "observed_behaviour": "Anomalous data export requests from authenticated session, volume 10x normal",
    "current_actions_taken": "None yet",
    "environment": "production",
    "industry": "fintech"
  }
}
```

Containment recommendations are returned in `recommendations` sorted by `priority: immediate` first. Execute these steps before investigating root cause.

Reference: [NIST SP 800-61 Computer Security Incident Handling Guide](https://csrc.nist.gov/publications/detail/sp/800-61/rev-2/final)
