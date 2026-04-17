# PR Description Template

Use this template verbatim. Replace all `{{ }}` placeholders with real content.

---

## Issue / Context

**Linked issue**: {{ #issue-number or "N/A" }}

**Problem being solved**:
{{ 2-4 sentences describing the bug, gap, or requirement this PR addresses. Be specific about
the symptom and root cause. }}

---

## What Changed

### Impacted Areas

| Area | Files | Nature of Change |
|------|-------|-----------------|
| {{ e.g. API layer }} | {{ file1.ts, file2.ts }} | {{ e.g. Added endpoint, modified validation }} |
| {{ e.g. Service layer }} | {{ service.ts }} | {{ e.g. Refactored business logic }} |
| {{ e.g. Database }} | {{ migration.sql }} | {{ e.g. Added index }} |
| {{ e.g. Tests }} | {{ *.spec.ts }} | {{ e.g. Added unit tests for new logic }} |

### Data Flow

**Before**:
```
{{ ASCII or text description of how data flowed before this change.
   Example:
   Client -> API -> Service -> DB (no caching)
   or describe a state machine transition, event pipeline, etc. }}
```

**After**:
```
{{ ASCII or text description of how data flows after this change.
   Highlight what is different. }}
```

---

## Scores

| Dimension | Score | Rationale |
|-----------|-------|-----------|
| Code Quality | {{ x }}/10 | {{ one sentence }} |
| Architecture | {{ x }}/10 | {{ one sentence }} |
| Test Coverage | {{ x }}/10 | {{ one sentence }} |

---

## Testing Scenarios

List the scenarios a reviewer or QA should verify:

- [ ] {{ Happy path: describe the expected behavior under normal conditions }}
- [ ] {{ Edge case: describe a boundary or unusual input }}
- [ ] {{ Error case: describe what happens when something goes wrong }}
- [ ] {{ Regression: describe a previously working behavior that should still work }}

*(Add or remove rows as needed.)*

---

## Suggestions (Out of Scope)

Improvements noticed during this review that are not part of this PR:

| Priority | Location | Suggestion |
|----------|----------|------------|
| {{ High/Medium/Low }} | {{ file:line }} | {{ Specific, actionable improvement }} |

*(Leave table empty if no suggestions.)*
