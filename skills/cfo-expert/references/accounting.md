# Accounting & Bookkeeping Reference

## Table of Contents
1. Chart of Accounts Structure
2. Common Journal Entries
3. Revenue Recognition (ASC 606)
4. Lease Accounting (ASC 842)
5. Stock-Based Compensation (ASC 718)
6. Accounts Receivable & Allowances
7. Fixed Assets & Depreciation
8. Intangibles & Amortization
9. Month-End Close Process
10. Reconciliation Best Practices

---

## 1. Chart of Accounts Structure

A well-designed chart of accounts (COA) is the backbone of clean financials. Structure it for both compliance and managerial reporting.

**Recommended numbering convention:**
- 1000-1999: Assets (1000 Current, 1500 Non-Current)
- 2000-2999: Liabilities (2000 Current, 2500 Non-Current)
- 3000-3999: Equity
- 4000-4999: Revenue
- 5000-5999: Cost of Goods Sold / Cost of Revenue
- 6000-6999: Operating Expenses
- 7000-7999: Other Income/Expense
- 8000-8999: Tax Provisions

Keep the COA lean. Every account should serve either external reporting or internal decision-making. If nobody looks at it, consolidate it.

**Departmental coding:** Use sub-codes or dimensions (not separate accounts) for departmental tracking. This keeps the COA manageable while enabling granular P&L reporting by department.

---

## 2. Common Journal Entries

### Revenue Recognition
```
Dr. Accounts Receivable          $X
    Cr. Revenue                      $X
Memo: Revenue recognized per ASC 606, performance obligation satisfied [date]
```

### Deferred Revenue (SaaS / Subscription)
```
Dr. Cash / Accounts Receivable   $X
    Cr. Deferred Revenue             $X
Memo: Payment received for [period], revenue to be recognized ratably

# Monthly recognition:
Dr. Deferred Revenue             $X/n
    Cr. Revenue                      $X/n
Memo: Monthly revenue recognition, [month] of [n]-month contract
```

### Accrued Expenses
```
Dr. [Expense Account]            $X
    Cr. Accrued Liabilities          $X
Memo: Accrual for [description], invoice expected [date]
```

### Prepaid Expenses
```
# At payment:
Dr. Prepaid Expenses             $X
    Cr. Cash / AP                    $X

# Monthly amortization:
Dr. [Expense Account]            $X/n
    Cr. Prepaid Expenses             $X/n
Memo: Amortization of prepaid [description], month [m] of [n]
```

### Payroll
```
Dr. Salary & Wages Expense       $X
Dr. Payroll Tax Expense          $Y
    Cr. Cash (net pay)               $A
    Cr. Payroll Tax Liabilities      $B
    Cr. Benefits Payable             $C
Memo: Payroll for period ending [date]
```

### Fixed Asset Purchase
```
Dr. Fixed Assets - [Category]    $X
    Cr. Cash / AP                    $X
Memo: Purchase of [asset description], useful life [n] years

# Monthly depreciation:
Dr. Depreciation Expense         $X/n/12
    Cr. Accumulated Depreciation     $X/n/12
```

### Bad Debt
```
# Allowance method (required under GAAP for material amounts):
Dr. Bad Debt Expense             $X
    Cr. Allowance for Doubtful Accounts  $X
Memo: Provision based on [aging analysis / % of revenue / specific identification]

# Write-off against allowance:
Dr. Allowance for Doubtful Accounts  $X
    Cr. Accounts Receivable              $X
Memo: Write-off of uncollectible account [customer name]
```

---

## 3. Revenue Recognition (ASC 606)

The five-step model is the foundation of all revenue recognition under US GAAP:

**Step 1: Identify the contract.** A contract exists when: both parties have approved it, rights and payment terms are identifiable, the contract has commercial substance, and collection is probable.

**Step 2: Identify performance obligations.** Each distinct good or service (or bundle) is a separate performance obligation. A good/service is distinct if the customer can benefit from it on its own and it's separately identifiable within the contract.

**Step 3: Determine the transaction price.** Consider variable consideration (estimates using expected value or most likely amount), constraining variable consideration, significant financing components, noncash consideration, and consideration payable to customers.

**Step 4: Allocate the transaction price.** Allocate to each performance obligation based on relative standalone selling prices (SSP). Estimate SSP using adjusted market assessment, expected cost plus margin, or residual approach.

**Step 5: Recognize revenue.** Recognize when (or as) each performance obligation is satisfied — either at a point in time or over time.

**Over-time recognition criteria (any one suffices):**
- Customer simultaneously receives and consumes the benefits
- The entity's performance creates or enhances an asset the customer controls
- The entity's performance doesn't create an asset with alternative use AND has an enforceable right to payment for performance completed to date

**Common pitfalls:**
- Bundling distinct services that should be separated
- Not constraining variable consideration adequately
- Ignoring significant financing components in long-term contracts
- Treating contract modifications as new contracts when they should be cumulative catch-ups

---

## 4. Lease Accounting (ASC 842)

**Classification:** All leases > 12 months go on the balance sheet. Classify as either finance lease or operating lease.

**Finance lease (any one criterion):**
- Transfers ownership at end of term
- Contains a bargain purchase option
- Lease term is ≥ 75% of useful life
- PV of payments is ≥ 90% of fair value
- Asset is specialized with no alternative use to lessor

**Operating lease:** Everything else. Still goes on the balance sheet as a right-of-use (ROU) asset and lease liability, but expense recognition is straight-line.

**Initial measurement:**
- Lease liability = PV of future lease payments (using incremental borrowing rate if implicit rate isn't available)
- ROU asset = Lease liability + initial direct costs + prepaid rent − lease incentives

**Practical expedients:** Short-term lease exception (≤ 12 months) allows off-balance sheet treatment. Evaluate whether to elect this on a class-by-class basis.

---

## 5. Stock-Based Compensation (ASC 718)

**Measurement:** Fair value at grant date. For options, typically use Black-Scholes or lattice model. For RSUs, use the stock price on grant date.

**Recognition:** Expense over the requisite service period (usually the vesting period), straight-line for service-only conditions. For performance conditions, recognize if probable of achievement. Market conditions are factored into the fair value estimate, not the recognition pattern.

**Key entries:**
```
# Over the vesting period:
Dr. Stock-Based Compensation Expense   $X
    Cr. Additional Paid-In Capital         $X

# On exercise of options:
Dr. Cash (exercise price × shares)     $X
Dr. Additional Paid-In Capital         $Y
    Cr. Common Stock                       $Z
```

**409A implications:** Private company stock options must have an exercise price at or above fair market value (determined by a 409A valuation) to avoid adverse tax consequences. Refresh the 409A at least annually or after material events.

---

## 6. Accounts Receivable & Allowances

**Aging analysis:** The primary tool for evaluating collectibility. Standard buckets: Current, 1-30 days, 31-60, 61-90, 90+.

**CECL model (ASC 326):** For public companies (and now private companies), use the current expected credit loss model — estimate expected losses over the life of the receivable at inception, not just when losses are probable.

**DSO (Days Sales Outstanding):** AR / (Revenue / Days in period). A rising DSO is a cash flow red flag — investigate whether it's a billing, collection, or customer quality issue.

---

## 7. Fixed Assets & Depreciation

**Capitalization threshold:** Establish a policy (commonly $1,000-$5,000 for SMBs, higher for larger companies). Below threshold → expense immediately.

**Methods:**
- Straight-line: (Cost − Salvage) / Useful Life. Most common for GAAP.
- Double-declining balance: 2 × (1/Useful Life) × Book Value. Front-loads expense.
- Units of production: (Cost − Salvage) × (Actual Usage / Total Estimated Usage).

**Common useful lives:**
- Computer equipment: 3-5 years
- Furniture & fixtures: 5-7 years
- Vehicles: 5 years
- Machinery: 7-10 years
- Buildings: 27.5-39 years
- Leasehold improvements: Shorter of useful life or lease term

**Impairment (ASC 360):** Test when events suggest carrying amount may not be recoverable. If undiscounted future cash flows < carrying amount → write down to fair value.

---

## 8. Intangibles & Amortization

**Definite-lived intangibles** (patents, customer lists, noncompete agreements): Amortize over useful life, test for impairment when triggered.

**Indefinite-lived intangibles** (trademarks, certain licenses): Do not amortize. Test for impairment at least annually.

**Goodwill (ASC 350):** Do not amortize (for public companies; private companies may elect to amortize over ≤10 years). Test for impairment annually at the reporting unit level. The simplified approach: if carrying amount > fair value, recognize impairment for the difference (capped at total goodwill).

**Internally developed software (ASC 350-40):**
- Preliminary stage: Expense as incurred
- Application development stage: Capitalize
- Post-implementation stage: Expense as incurred
Amortize capitalized costs over expected useful life (typically 3-5 years for internal-use software).

---

## 9. Month-End Close Process

A disciplined close process ensures accurate, timely financials. Target: close within 5-10 business days for growth-stage companies, 3-5 for mature organizations.

**Close checklist (recommended sequence):**
1. Reconcile all bank and credit card accounts
2. Record revenue and deferred revenue entries
3. Post payroll entries
4. Record depreciation and amortization
5. Reconcile AP subledger to GL
6. Reconcile AR subledger to GL
7. Record accruals for known but unbilled expenses
8. Reconcile intercompany accounts and post intercompany eliminations (if multi-entity)
9. Record prepaid amortization
10. Record stock-based compensation expense
11. Review and post any adjusting entries
12. Reconcile all balance sheet accounts
13. Generate trial balance and review for anomalies
14. Prepare financial statements
15. Perform flux analysis (month-over-month, budget-to-actual)

---

## 10. Reconciliation Best Practices

Every balance sheet account should be reconciled monthly. The reconciliation should:
- Start with the GL balance
- Identify each component that makes up that balance
- Tie to a supporting schedule or subledger
- Flag and resolve any discrepancies
- Be reviewed by someone other than the preparer

**High-risk accounts requiring extra attention:** Cash, AR, AP, deferred revenue, accrued liabilities, intercompany, and equity.
