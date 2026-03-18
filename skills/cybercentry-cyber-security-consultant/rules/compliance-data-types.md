---
title: Describe What Categories of Data Are Handled
impact: MEDIUM
impactDescription: Determines applicable compliance obligations and data protection requirements
tags: compliance, data-types, pii, phi, pci, classification
---

## Describe What Categories of Data Are Handled

**Impact: MEDIUM (determines applicable compliance obligations and data protection requirements)**

Different data categories trigger different regulatory obligations. GDPR applies to personal data of EU residents; HIPAA applies to protected health information; PCI-DSS applies when payment card data is stored, processed, or transmitted. Describing your data categories enables Cybercentry to map recommendations to the correct compliance obligations.

**Incorrect (data types not specified):**

```json
{
  "question": "What compliance requirements apply to our platform?",
  "context": {
    "industry": "healthcare",
    "environment": "production"
  }
}
```

**Correct (data categories described without including actual records):**

```json
{
  "question": "What compliance obligations apply to our platform and what are the key control requirements?",
  "context": {
    "data_categories": [
      {
        "type": "protected_health_information",
        "description": "Patient diagnoses, prescriptions, treatment records",
        "storage": "encrypted database",
        "geographic_scope": "US and EU patients"
      },
      {
        "type": "payment_card_data",
        "description": "Card numbers tokenised at point of entry; token stored, not PAN",
        "pci_scope": "SAQ A-EP (tokenisation via third-party)"
      },
      {
        "type": "general_user_pii",
        "description": "Name, email, date of birth",
        "geographic_scope": "EU users — GDPR applicable"
      }
    ],
    "industry": "health-tech",
    "environment": "production"
  }
}
```

Reference: [ICO Guide to GDPR](https://ico.org.uk/for-organisations/guide-to-data-protection/guide-to-the-general-data-protection-regulation-gdpr/)
