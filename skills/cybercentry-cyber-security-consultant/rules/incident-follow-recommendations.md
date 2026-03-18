---
title: Implement Priority-Ordered Recommendations Sequentially
impact: HIGH
impactDescription: Ensures highest-impact actions are taken first during active incidents
tags: incident, recommendations, priority, remediation, sequencing
---

## Implement Priority-Ordered Recommendations Sequentially

**Impact: HIGH (ensures highest-impact actions are taken first during active incidents)**

Cybercentry returns recommendations sorted by `priority` field: `immediate` → `high` → `medium` → `low`. During an active incident, parallel execution of all recommendations risks interfering with forensic evidence collection and can cause system instability. Execute in strict priority order and confirm each step before proceeding.

**Incorrect (parallel or out-of-order execution):**

```bash
# Simultaneously patching, notifying, and investigating — risks destroying evidence
npm audit fix --force &
notify_stakeholders &
check_logs &
```

**Correct (sequential execution by priority tier):**

```javascript
const response = await getConsultationResult(jobId);
const { recommendations } = response;

const priorityOrder = ['immediate', 'high', 'medium', 'low'];

for (const priority of priorityOrder) {
  const steps = recommendations.filter(r => r.priority === priority);
  for (const step of steps) {
    console.log(`[${priority.toUpperCase()}] ${step.action}`);
    console.log(`Implementation: ${step.implementation}`);
    // Await human confirmation before proceeding to next step in production
    await confirmAndExecute(step);
  }
}
```

Always preserve forensic evidence (logs, memory dumps, network captures) before executing any `immediate` remediation steps that modify system state.

Reference: [NIST SP 800-61 Rev 2 — Containment, Eradication, and Recovery](https://csrc.nist.gov/publications/detail/sp/800-61/rev-2/final)
