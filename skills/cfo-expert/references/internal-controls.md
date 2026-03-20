# Internal Controls & Compliance Reference

## Table of Contents
1. Control Frameworks Overview
2. Segregation of Duties
3. SOC Reports
4. SOX Compliance
5. IT General Controls
6. Fraud Prevention
7. Controls by Company Stage

---

## 1. Control Frameworks Overview

### COSO Framework
The Committee of Sponsoring Organizations (COSO) framework is the gold standard for internal controls. Five components:

1. **Control Environment:** Tone at the top, organizational structure, accountability, ethical values. This is the foundation — weak culture undermines every other control.
2. **Risk Assessment:** Identify and analyze risks that could prevent achieving objectives. Includes financial reporting risks, fraud risks, and operational risks.
3. **Control Activities:** The policies and procedures that address risks. Includes approvals, authorizations, verifications, reconciliations, and physical safeguards.
4. **Information & Communication:** Relevant information flows up, down, and across the organization. Financial reporting systems must produce accurate, timely data.
5. **Monitoring:** Ongoing evaluations and separate assessments of whether controls are operating effectively. Includes internal audit, management testing, and deficiency reporting.

### Right-Sizing Controls
Not every company needs the same level of controls. The key question: **What could go wrong, and what's the impact?**

- A $2M seed-stage company needs basic controls (approval workflows, bank reconciliations, access controls)
- A $50M Series C needs formal policies, documented processes, and regular testing
- A pre-IPO company needs SOX-ready controls with evidence of operating effectiveness

---

## 2. Segregation of Duties

The principle: No single person should control all phases of a transaction (authorization, custody, recording, reconciliation).

### Critical Segregation Points

**Cash/Banking:**
- Person who initiates payments ≠ person who approves payments
- Person who records transactions ≠ person who reconciles bank accounts
- Signatories on bank accounts should require dual approval above a threshold

**Accounts Payable:**
- Person who creates vendors ≠ person who approves invoices ≠ person who processes payments
- At minimum: separate the person who sets up a new vendor from the person who pays them (prevents ghost vendor fraud)

**Payroll:**
- Person who adds/modifies employees ≠ person who approves payroll
- Regular review of payroll register by someone outside the payroll process

**Revenue/AR:**
- Person who creates invoices ≠ person who applies cash receipts
- Credit memos and write-offs require approval from someone outside AR

**Journal Entries:**
- Non-standard journal entries require approval
- Set a materiality threshold — entries above the threshold require manager/controller sign-off

### When You're Too Small to Segregate
For small teams where one person wears many hats:
- Implement compensating controls: management review, independent reconciliations, board-level oversight of bank statements
- Require dual signatures on checks/wires above a threshold
- Have the CEO or board member review bank statements directly (not through the bookkeeper)

---

## 3. SOC Reports

### SOC 1 (SSAE 18)
**Purpose:** Evaluate controls at a service organization that are relevant to user entities' financial reporting.
**Who needs it:** Companies whose services affect their customers' financial statements (payroll processors, SaaS platforms handling financial data, payment processors).
**Types:**
- Type I: Design of controls at a point in time
- Type II: Design AND operating effectiveness over a period (typically 12 months). This is what customers and auditors want.

### SOC 2
**Purpose:** Evaluate controls related to security, availability, processing integrity, confidentiality, and/or privacy (the Trust Services Criteria).
**Who needs it:** Any technology company that stores, processes, or transmits customer data. Increasingly a sales requirement — enterprise customers won't sign without it.
**Types:**
- Type I: Design at a point in time (faster, cheaper — good for first report)
- Type II: Design and operating effectiveness over a period (the real standard)

### SOC 2 Readiness
Before engaging an auditor for a full SOC 2:
1. **Gap assessment:** Map current controls to the Trust Services Criteria
2. **Remediate gaps:** Implement missing controls and let them operate for the observation period
3. **Evidence collection:** Set up systems to automatically capture evidence (access logs, change management tickets, approval workflows)
4. **Type I first:** Consider a Type I as a stepping stone — proves design, buys time to build operating history

### SOC 3
**Purpose:** A general-use version of the SOC 2 report. Contains the auditor's opinion but not the detailed description of tests and results.
**Who needs it:** Companies that want to publicly display their compliance posture (e.g., a trust page on their website). SOC 2 reports are restricted-use and cannot be freely shared; SOC 3 fills that gap.
**When to get one:** Only after you have a SOC 2 Type II. The SOC 3 is derived from the SOC 2 engagement — it's not a separate audit.

### Cost and Timeline
- SOC 2 Type I: 2-4 months, $30K-$80K (varies by complexity and auditor)
- SOC 2 Type II: 6-12 months (includes observation period), $50K-$150K
- SOC 3: Marginal additional cost when produced alongside SOC 2
- Annual recurrence: Plan for this — SOC 2 is not one-and-done

---

## 4. SOX Compliance

### Who's Subject to SOX
Public companies (SEC registrants). Also relevant for pre-IPO companies preparing for an offering.

### Key Requirements

**Section 302 — CEO/CFO Certification:**
- CEO and CFO personally certify that they have reviewed the report, that it does not contain material misstatements or omissions, that the financial statements fairly present the company's financial condition and results, and that they are responsible for establishing and maintaining disclosure controls and procedures
- Also requires disclosure of any significant changes in internal controls
- Effective from day one of being public

**Section 404 — Internal Control Over Financial Reporting (ICFR):**
- Management must assess and report on the effectiveness of ICFR
- External auditor must attest to management's assessment (for accelerated filers)
- This is where the heavy lift is — requires documenting, testing, and remediating controls

**Deficiency Classifications:**
- **Control deficiency:** Design or operation of a control does not allow timely detection/prevention of misstatements. May not require disclosure but should be communicated to management.
- **Significant deficiency:** A deficiency (or combination) that is less severe than a material weakness but important enough to merit attention by those responsible for financial reporting oversight. Communicated to the audit committee.
- **Material weakness:** A deficiency (or combination) such that there is a reasonable possibility that a material misstatement will not be prevented or detected on a timely basis. Must be disclosed publicly. A material weakness means ICFR is *not* effective — this is the outcome companies must avoid.

### SOX Readiness Timeline
Start at least 18-24 months before IPO:

**Phase 1 (18-24 months out):** Scoping and risk assessment. Identify significant accounts and processes. Document as-is processes.

**Phase 2 (12-18 months out):** Gap remediation. Implement missing controls. Deploy GRC (governance, risk, compliance) tooling. Begin control documentation (narratives, flowcharts, risk-control matrices).

**Phase 3 (6-12 months out):** Testing. Management tests controls for operating effectiveness. Remediate any deficiencies found. Dry-run with external auditor.

**Phase 4 (0-6 months out):** Finalize. Address any remaining deficiencies. Prepare management's assessment. External auditor performs ICFR audit.

---

## 5. IT General Controls (ITGCs)

ITGCs underpin the reliability of financial reporting systems. Auditors will test these.

### Key ITGC Areas

**Access Controls:**
- User provisioning and deprovisioning (joiners/movers/leavers process)
- Role-based access with least-privilege principle
- Privileged access management (admin accounts)
- Regular access reviews (quarterly for critical systems)
- Multi-factor authentication on financial systems

**Change Management:**
- Formal change request and approval process for production systems
- Segregation between development and production environments
- Testing and approval before deployment
- Emergency change procedures with after-the-fact review

**Computer Operations:**
- Backup and recovery procedures (tested regularly)
- Job scheduling and monitoring
- Incident management and escalation

**System Development:**
- SDLC policies for new systems and major changes
- Testing requirements before go-live
- Data migration controls

---

## 6. Fraud Prevention

### The Fraud Triangle
Fraud occurs when three elements converge:
1. **Pressure:** Financial need, performance targets, personal problems
2. **Opportunity:** Weak controls, lack of oversight, access
3. **Rationalization:** "I'll pay it back," "I deserve it," "everyone does it"

Controls primarily address opportunity. Culture addresses rationalization.

### Red Flags
- Employee living beyond apparent means
- Reluctance to take vacation or share duties
- Unusual vendor relationships or sole-source contracts
- Revenue or expense patterns that don't match operations
- Missing documentation or excessive manual journal entries
- Resistance to implementing controls or audits

### Anti-Fraud Controls
- Mandatory vacation policies (fraud often surfaces when the perpetrator is away)
- Whistleblower hotline (anonymous reporting mechanism)
- Regular rotation of duties in sensitive roles
- Surprise audits on high-risk areas
- Background checks for employees in financial roles
- Vendor master file reviews (look for duplicate addresses, PO boxes, employee matches)

---

## 7. Controls by Company Stage

### Seed / Early Stage (< 20 employees)
Essential controls only:
- [ ] Dual approval on payments above threshold (e.g., $5K)
- [ ] Monthly bank reconciliation reviewed by founder/CEO
- [ ] Access controls on financial systems (unique logins, no shared passwords)
- [ ] Expense policy with approval workflow
- [ ] Basic vendor approval process
- [ ] Backup of financial data

### Growth Stage (20-100 employees)
Add structure:
- [ ] Documented accounting policies
- [ ] Formal close checklist with review sign-offs
- [ ] Segregation of duties (or compensating controls where not possible)
- [ ] Quarterly access reviews on financial systems
- [ ] Formal expense and procurement policies
- [ ] Annual financial audit (may be required by investors)
- [ ] Documented revenue recognition policy

### Scale Stage (100+ employees, pre-IPO track)
Formalize everything:
- [ ] COSO-aligned control framework
- [ ] Risk-control matrices for significant processes
- [ ] Regular management testing of key controls
- [ ] SOC 2 Type II (if applicable to business model)
- [ ] IT general controls formalized and tested
- [ ] Internal audit function (or outsourced)
- [ ] Whistleblower and ethics reporting mechanism
- [ ] SOX readiness project if IPO is on the horizon
