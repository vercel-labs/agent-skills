# Tax Intelligence Reference

Entity-aware tax rules, deductibility guidelines, 1099 tracking, and compliance workflows. This file is loaded on demand — reference it from SKILL.md but don't keep it in context unless working on tax-related tasks.

> **Year-specific figures warning:** Dollar limits, mileage rates, and depreciation percentages in this file reference specific tax years. Always verify current-year IRS limits before advising the user — these change annually.

---

## Entity-Specific Tax Treatment

### Sole Proprietorship
- **Tax form:** Schedule C on personal Form 1040
- **Self-employment tax:** 15.3% on net profit (12.4% SS + 2.9% Medicare)
- **SE tax deduction:** 50% of SE tax deductible on Form 1040
- **Estimated taxes:** Required if expecting to owe ≥$1,000
- **QBI deduction:** Generally eligible for 20% qualified business income deduction (Section 199A)
- **Bookkeeping note:** All income/expenses flow to personal return. No separate entity tax return.

### Single-Member LLC (Default)
- **Treated as:** Disregarded entity — same as sole proprietorship for tax
- **Tax form:** Schedule C on personal Form 1040
- **Key difference from sole prop:** Liability protection, but identical tax treatment
- **Can elect:** S-Corp taxation (Form 2553) or C-Corp taxation (Form 8832)

### LLC Electing S-Corp
- **Tax form:** Form 1120-S (entity) + Schedule K-1 to owner(s)
- **Reasonable salary required:** Owner-employees must take "reasonable compensation" as W-2 wages
- **Remaining profit:** Passes through as distributions — NOT subject to self-employment tax
- **Payroll taxes:** Only on W-2 wages (saves SE tax on distributions)
- **Estimated taxes:** Still required for owner's share of pass-through income
- **Bookkeeping note:** Must track: officer compensation, shareholder distributions, shareholder basis. Separate payroll for owner.
- **Common optimization:** Set salary at a defensible level (industry benchmarks, 40-60% of net income) to minimize payroll taxes while staying IRS-compliant.

### Multi-Member LLC (Default — Partnership)
- **Tax form:** Form 1065 (entity) + Schedule K-1 to each member
- **Self-employment tax:** Each member pays SE tax on their share of net income (unless limited partner)
- **Guaranteed payments:** Payments to members for services rendered — always SE taxable
- **Estimated taxes:** Each member responsible for their own quarterly estimates
- **Bookkeeping note:** Track each member's capital account, distributions, and allocations per operating agreement.

### C-Corporation
- **Tax form:** Form 1120
- **Corporate tax rate:** 21% flat (federal)
- **Double taxation:** Corporate income taxed at entity level; dividends taxed again at shareholder level
- **No pass-through:** Income stays at the corporate level until distributed
- **Estimated taxes:** Corporation pays its own quarterly estimates (Form 1120-W)
- **Bookkeeping note:** Accumulated earnings tax risk if retaining >$250K without business purpose. Track shareholder loans carefully.

### S-Corporation
- **Tax form:** Form 1120-S + Schedule K-1
- **No entity-level tax** (generally): Income passes through to shareholders
- **Built-in gains tax:** May apply if converted from C-Corp within 5 years
- **Reasonable salary:** Same requirement as LLC electing S-Corp
- **Shareholder restrictions:** Max 100 shareholders, one class of stock, US individuals/trusts only
- **Bookkeeping note:** Track shareholder basis — distributions exceeding basis are taxable capital gains.

---

## 1099 Tracking Workflow

### Who Needs a 1099-NEC?
- Non-employee individuals or non-corporate entities paid ≥$600 during the tax year for services
- **Include:** Freelancers, consultants, contractors, attorneys (even if incorporated), sole proprietors
- **Exclude:** Corporations (C-Corp or S-Corp) — EXCEPT attorneys, Payments made via credit card/PayPal (reported by payment processor on 1099-K)
- **Exclude:** Employees (they get W-2s)

### Identification Rules
Flag a vendor for 1099 tracking when ANY of these are true:
1. Payment to an individual (name, not company name)
2. Vendor described as "contractor", "consultant", "freelancer"
3. Account is "Contract Labor Expense" or "Professional Fees" (to individuals)
4. User identifies them as a contractor
5. Vendor is a law firm (attorneys always get 1099s regardless of entity type)

### Tracking Process
1. **During categorization:** When a transaction matches 1099 criteria, check if vendor exists in `.bookkeeper/tax-profile.md` 1099 Tracking table
2. **If new vendor:** Add to tracking table with Type = NEC, YTD = transaction amount
3. **If existing vendor:** Update YTD total
4. **At year-end:** Generate list of vendors with YTD ≥ $600 — these need 1099-NEC filing

### Year-End 1099 Prep Checklist
- [ ] Review all vendors in 1099 tracking table
- [ ] Verify entity type for vendors near $600 threshold (corporation = exempt)
- [ ] Collect W-9 forms for all 1099-eligible vendors
- [ ] Confirm mailing addresses
- [ ] Filing deadline: January 31 (to IRS and recipients)

---

## Deductibility Rules

### Meals (Account 6800)
- **Business meals with clients/prospects:** 50% deductible
- **Employee meals (office-provided, for employer convenience):** 50% deductible
- **Team meals / company events:** 100% deductible (de minimis fringe benefit rules, company-wide events)
- **Travel meals:** 50% deductible (or per diem rates)
- **Documentation required:** Date, place, business purpose, attendees, amount
- **Bookkeeping note:** Track at 100% in the GL; apply 50% limitation on the tax return. Flag in account notes.

### Entertainment
- **Generally:** 0% deductible (Tax Cuts and Jobs Act, 2018+)
- **Exceptions:** Company holiday parties, company picnics (100% if for all employees)
- **Tickets/events with clients:** Not deductible, even if business is discussed
- **Bookkeeping note:** Still record the expense — it's a real cost. Note "non-deductible" for tax purposes.

### Home Office
- **Simplified method:** $5/sq ft, max 300 sq ft ($1,500 max deduction)
- **Regular method:** Actual expenses × (office sq ft / total home sq ft)
  - Deductible expenses: rent/mortgage interest, utilities, insurance, repairs, depreciation
- **Requirement:** Regular and exclusive use for business
- **S-Corp note:** Owner should set up an accountable reimbursement plan; corporation deducts, owner receives tax-free
- **Bookkeeping note:** Track home office % in tax profile. Apply at tax time or via monthly reimbursement entry.

### Vehicle / Mileage
- **Standard mileage rate:** Check IRS rate for current year (was 67¢/mile in 2024 — verify current)
- **Actual expense method:** Gas, insurance, repairs, depreciation × business use %
- **Cannot switch:** Once you use actual expenses, generally locked in for that vehicle
- **Documentation:** Mileage log with date, destination, purpose, miles
- **Bookkeeping note:** Track method and annual miles in tax profile.

### Startup Costs (New Businesses)
- **First $5,000:** Deductible in year 1 (reduced dollar-for-dollar if total startup costs exceed $50,000)
- **Remaining:** Amortize over 180 months (15 years)
- **Includes:** Market research, training, advertising before opening, travel to set up business

### Depreciation & Section 179
- **Section 179:** Immediately expense qualifying asset purchases (up to annual limit — was $1,160,000 in 2023 — verify current)
- **Bonus depreciation:** 60% in 2024, 40% in 2025, 20% in 2026 (phasing out)
- **Qualifying property:** Equipment, machinery, off-the-shelf software, qualified improvement property
- **Vehicles:** Limited to $12,400 first-year depreciation (luxury auto limits, unless >6,000 lbs GVWR)
- **Bookkeeping note:** Record at full cost in fixed assets. Depreciation method is a tax election — flag for CPA review.

---

## Sales Tax Basics

### Nexus Triggers
A business has sales tax obligations in a state when it has:
- **Physical nexus:** Office, warehouse, employees, or inventory in the state
- **Economic nexus:** Exceeds the state's revenue or transaction threshold (commonly $100K revenue OR 200 transactions)

### Bookkeeping Treatment
- **Collecting sales tax:** Liability, not revenue
  ```
  Dr. Accounts Receivable    $1,070
      Cr. Revenue                $1,000
      Cr. Sales Tax Payable      $70
  ```
- **Remitting sales tax:** Reduces liability
  ```
  Dr. Sales Tax Payable      $70
      Cr. Cash                   $70
  ```
- **Track by jurisdiction:** Many states require county/city breakdowns
- **Filing frequency:** Monthly, quarterly, or annually based on volume — varies by state

### Common Sales Tax Rates (Approximate — Verify Current)
| State | State Rate | Typical Combined | Notes |
|-------|-----------|-----------------|-------|
| CA    | 7.25%     | 8.5-10.5%       | District taxes vary widely |
| NY    | 4%        | 7-8.875%        | NYC = 8.875% |
| TX    | 6.25%     | 6.25-8.25%      | No state income tax |
| FL    | 6%        | 6-7.5%          | No state income tax |
| WA    | 6.5%      | 7-10.5%         | No state income tax |

---

## Key Tax Dates & Deadlines

### Federal Deadlines

| Date       | What                                                     | Who                     |
|-----------|----------------------------------------------------------|------------------------|
| Jan 15     | Q4 estimated tax payment                                | Individuals, sole props |
| Jan 31     | 1099-NEC filing deadline (to IRS and recipients)        | All businesses          |
| Jan 31     | W-2 filing deadline                                     | Employers               |
| Mar 15     | S-Corp (1120-S) and Partnership (1065) returns due      | S-Corps, partnerships   |
| Apr 15     | Individual (1040) and C-Corp (1120) returns due         | Individuals, C-Corps    |
| Apr 15     | Q1 estimated tax payment                                | Individuals, sole props |
| Jun 15     | Q2 estimated tax payment                                | Individuals, sole props |
| Sep 15     | Extended S-Corp/Partnership returns due                 | S-Corps, partnerships   |
| Sep 15     | Q3 estimated tax payment                                | Individuals, sole props |
| Oct 15     | Extended Individual/C-Corp returns due                  | Individuals, C-Corps    |

### C-Corp Estimated Tax Schedule
| Quarter | Period         | Due Date |
|---------|---------------|----------|
| Q1      | Jan 1 – Mar 31 | Apr 15  |
| Q2      | Apr 1 – Jun 30 | Jun 15  |
| Q3      | Jul 1 – Sep 30 | Sep 15  |
| Q4      | Oct 1 – Dec 31 | Dec 15  |

Proactive reminders for these deadlines are handled by SKILL.md's Date-Aware Triggers (14-day window).

---

## Common Tax Planning Opportunities

Flag these when you notice qualifying patterns in the books:

### Retirement Plan Contributions
- **SEP-IRA:** Up to 25% of net SE income (max was ~$66,000 in 2023 — verify current)
- **Solo 401(k):** Employee + employer contributions (higher limits than SEP for same income)
- **Deadline:** SEP-IRA can be funded until tax filing deadline (including extensions)
- **Trigger:** High net income + no retirement plan contributions recorded

### R&D Tax Credit (Section 41)
- **Eligible:** Developing new/improved products, processes, software
- **Startup provision:** Up to $500,000/year can offset payroll taxes (for companies <$5M revenue, <5 years old)
- **Trigger:** Significant payroll costs classified as R&D/Engineering + early-stage company
- **Note:** Flag for CPA — requires formal study

### Section 179 / Bonus Depreciation
- **Trigger:** Large equipment or asset purchases during the year
- **Action:** Flag for CPA to evaluate immediate expensing vs. standard depreciation

### Income Timing (Cash Basis)
- **Year-end opportunity:** Defer income to next year (delay invoicing) or accelerate expenses (prepay subscriptions)
- **Trigger:** Approaching year-end with high taxable income
- **Note:** Only works for cash-basis taxpayers

### Entity Structure Review
- **Trigger:** Sole prop / single-member LLC with net income > $50,000
- **Opportunity:** S-Corp election may save significant self-employment tax
- **Note:** Must establish reasonable salary — flag for CPA analysis
