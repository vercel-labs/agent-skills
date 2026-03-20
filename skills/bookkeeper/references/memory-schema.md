# Memory Schema — `.bookkeeper/` Directory

All persistent state lives in `.bookkeeper/` at the project root. Files are markdown — Claude reads and writes them natively. Each file has a defined schema below.

**Rules for all memory files:**
- Create `.bookkeeper/` on first interaction if it doesn't exist
- **Add `.bookkeeper/` to `.gitignore`** — these files contain financial data and must not be committed to version control
- Always read existing files before overwriting — merge, don't clobber
- Use append operations for `audit-log.md` — never rewrite history
- Keep files concise — these load into context on every session
- **Never store sensitive PII:** No full Tax IDs (EIN/SSN) — last 4 digits only. No W-9 data (addresses, full TINs). Contractor names in 1099 tracking are acceptable but mailing addresses and TINs should be managed in the user's payroll provider or 1099 filing service, not here.

---

## 1. `profile.md` — Business Profile

Captured during onboarding (first session) or updated when the user provides new info.

```markdown
# Business Profile

| Field              | Value                        |
|--------------------|------------------------------|
| Company Name       | Acme Corp                    |
| Entity Type        | LLC (single-member)          |
| Industry           | SaaS / Technology            |
| Fiscal Year End    | December 31                  |
| Accounting Basis   | Accrual                      |
| Materiality        | $500                         |
| Currency           | USD                          |
| State of Formation | Delaware                     |
| Tax ID (last 4)    | **6789                       | ← Never store full EIN/SSN |

## Notes
- Elected S-Corp taxation effective 2024
- Uses Ramp for corporate cards
- Payroll through Gusto, semi-monthly
```

**When to update:** When the user corrects any field, mentions a change in entity structure, or provides new context about the business.

---

## 2. `chart-of-accounts.md` — Living Chart of Accounts

The working COA. Created on first setup, evolved as new accounts are needed.

```markdown
# Chart of Accounts

| Code | Name                          | Type        | Normal  | Notes                    |
|------|-------------------------------|-------------|---------|--------------------------|
| 1000 | Cash - Operating (Mercury)   | Asset       | Debit   | Primary checking         |
| 1010 | Cash - Savings               | Asset       | Debit   |                          |
| 1100 | Accounts Receivable          | Asset       | Debit   |                          |
| 1110 | Allowance for Doubtful Accts | Asset       | Credit  | Contra asset             |
| 1200 | Prepaid Expenses             | Asset       | Debit   |                          |
| 2000 | Accounts Payable             | Liability   | Credit  |                          |
| 2100 | Credit Card Payable - Ramp   | Liability   | Credit  |                          |
| 2200 | Accrued Liabilities          | Liability   | Credit  |                          |
| 2300 | Deferred Revenue             | Liability   | Credit  |                          |
| 2400 | Sales Tax Payable            | Liability   | Credit  |                          |
| 3000 | Owner's Equity               | Equity      | Credit  |                          |
| 3100 | Retained Earnings            | Equity      | Credit  |                          |
| 3200 | Owner's Draw                 | Equity      | Debit   |                          |
| 4000 | Revenue - Subscriptions      | Revenue     | Credit  |                          |
| 4100 | Revenue - Services           | Revenue     | Credit  |                          |
| 5000 | Cost of Revenue              | COGS        | Debit   | Hosting, infrastructure  |
| 6000 | Payroll & Wages              | Expense     | Debit   |                          |
| 6100 | Software & Subscriptions     | Expense     | Debit   |                          |
| 6200 | Rent & Office                | Expense     | Debit   |                          |
| 6300 | Professional Fees            | Expense     | Debit   |                          |
| 6400 | Sales & Marketing            | Expense     | Debit   |                          |
| 6500 | Travel & Entertainment       | Expense     | Debit   |                          |
| 6600 | Insurance                    | Expense     | Debit   |                          |
| 6700 | Depreciation & Amortization  | Expense     | Debit   |                          |
| 6800 | Meals                        | Expense     | Debit   | 50% deductible           |
| 6999 | Uncategorized Expense        | Expense     | Debit   | Temporary — always clear |
| 7000 | Interest Income              | Other Inc.  | Credit  |                          |
| 7100 | Interest Expense             | Other Exp.  | Debit   |                          |
| 7200 | Other Income                 | Other Inc.  | Credit  |                          |
| 7300 | Other Expense                | Other Exp.  | Debit   |                          |
| 8000 | Income Tax Expense           | Tax         | Debit   |                          |
```

**When to update:** When a new account is needed during categorization, when the user requests changes, or when a new transaction type requires a new account. Always note what triggered the addition.

---

## 3. `vendor-mappings.md` — Learned Categorizations (Tier 1)

Exact vendor-to-account mappings learned from user confirmations and corrections. These are the highest-confidence categorizations.

```markdown
# Vendor Mappings

Learned mappings from confirmed categorizations. Used as Tier 1 (exact match) in the categorization engine.

| Vendor Pattern       | Account Code | Account Name              | Confidence | Source               |
|----------------------|-------------|---------------------------|------------|----------------------|
| AMZN WEB SERVICES    | 5000        | Cost of Revenue           | HIGH       | User confirmed 2024-01 |
| GUSTO               | 6000        | Payroll & Wages           | HIGH       | User confirmed 2024-01 |
| SLACK TECHNOLOG      | 6100        | Software & Subscriptions  | HIGH       | User confirmed 2024-02 |
| GOOGLE ADS           | 6400        | Sales & Marketing         | HIGH       | User corrected 2024-02 |
| UBER TRIP            | 6500        | Travel & Entertainment    | HIGH       | User confirmed 2024-03 |
```

**When to update:**
- When the user confirms a categorization → add mapping with source "User confirmed [date]"
- When the user corrects a categorization → add/update mapping with source "User corrected [date]"
- When a Tier 2 or Tier 3 categorization is confirmed → promote to Tier 1 here

**Matching rules:**
- Match on substring (vendor descriptions are often truncated in bank feeds)
- Case-insensitive matching
- If multiple patterns could match, use the longest match

---

## 4. `period-balances.md` — Historical Trial Balance Snapshots

One snapshot per closed period. Used for trend analysis and MoM comparisons.

```markdown
# Period Balances

## 2024-01 (January 2024)

| Account Code | Account Name              | Balance      |
|-------------|---------------------------|-------------|
| 1000        | Cash - Operating           | $45,230     |
| 1100        | Accounts Receivable        | $12,500     |
| 2000        | Accounts Payable           | ($8,200)    |
| 4000        | Revenue - Subscriptions    | ($28,000)   |
| 5000        | Cost of Revenue            | $4,200      |
| 6000        | Payroll & Wages            | $15,000     |
| 6100        | Software & Subscriptions   | $3,400      |
...

**Net Income:** $5,400
**Total Assets:** $57,730
**Total Liabilities:** $8,200

## 2024-02 (February 2024)

...
```

**When to update:** At the end of every month-end close, append a new section with that period's trial balance snapshot. Never modify historical sections.

**Format rules:**
- Credit-normal accounts shown as negative (Revenue, Liabilities, Equity)
- Include summary metrics: Net Income, Total Assets, Total Liabilities
- Sections ordered chronologically

---

## 5. `open-items.md` — Unresolved Items Carried Forward

Items that couldn't be resolved in the current session and need follow-up.

```markdown
# Open Items

## Active

| ID   | Date Added | Category       | Description                                              | Priority | Status  |
|------|-----------|----------------|----------------------------------------------------------|----------|---------|
| OI-1 | 2024-01-15 | Uncategorized  | $3,200 charge from "TECHVENDOR LLC" — need user confirmation | HIGH     | Waiting |
| OI-2 | 2024-01-15 | Reconciliation | $450 bank fee not in GL — need adjusting entry           | MEDIUM   | Waiting |
| OI-3 | 2024-02-01 | Missing Data   | January credit card statement not yet provided           | HIGH     | Waiting |

## Resolved

| ID   | Date Added | Date Resolved | Resolution                                |
|------|-----------|---------------|-------------------------------------------|
| OI-0 | 2024-01-10 | 2024-01-15   | Was a refund from AWS — booked as credit to 5000 |
```

**When to update:**
- Add items when: transactions can't be categorized, reconciliation has unresolved differences, data is missing, user needs to provide clarification
- Resolve items when: user provides the answer, the issue is fixed in a subsequent session
- Move resolved items from Active to Resolved table with resolution notes

**Priority levels:** HIGH (blocks close), MEDIUM (should resolve soon), LOW (nice to resolve)

---

## 6. `tax-profile.md` — Entity Tax Configuration

Tax-specific settings and tracking data. See `references/tax-intelligence.md` for detailed rules.

```markdown
# Tax Profile

## Entity Configuration

| Field                     | Value                              |
|---------------------------|------------------------------------|
| Entity Type               | LLC                                |
| Tax Election              | S-Corp                             |
| Tax Year                  | Calendar (Jan-Dec)                 |
| Reasonable Salary          | $120,000/yr                       |
| State(s) Filing           | Delaware (formation), California (nexus) |
| Sales Tax Nexus States    | CA, NY                             |
| Estimated Tax Required    | Yes — quarterly                    |

## 1099 Tracking

| Vendor                | Type    | YTD Paid  | Threshold | Needs 1099? |
|-----------------------|---------|-----------|-----------|-------------|
| Jane Smith Consulting | NEC     | $8,500    | $600      | YES         |
| Legal Eagles LLP      | NEC     | $4,200    | $600      | YES         |
| Adobe Inc             | —       | $1,200    | $600      | NO (corp)   |

## Estimated Tax Payments

| Quarter | Due Date    | Federal  | State (CA) | Status |
|---------|------------|----------|------------|--------|
| Q1      | Apr 15     | $5,000   | $2,000     | Paid   |
| Q2      | Jun 15     | $5,000   | $2,000     | Paid   |
| Q3      | Sep 15     | $5,000   | $2,000     | Due    |
| Q4      | Jan 15     | $5,000   | $2,000     | —      |

## Key Deduction Notes
- Home office: 200 sq ft of 1,500 sq ft (13.3%)
- Vehicle: Standard mileage rate, ~8,000 business miles/yr
- Meals: 50% deductible, tracked separately in account 6800
```

**When to update:** When entity type changes, when new 1099 vendors are identified, when estimated payments are made, when the user provides tax-relevant info.

---

## 7. `audit-log.md` — Append-Only Action Log

Every significant bookkeeping action gets logged. Never edit or delete entries.

```markdown
# Audit Log

| Timestamp           | Action                        | Detail                                                    | Session |
|---------------------|-------------------------------|-----------------------------------------------------------|---------|
| 2024-01-15 10:30    | IMPORT                        | 47 transactions from Ramp (2024-01-01 to 2024-01-31)     | S001    |
| 2024-01-15 10:32    | CATEGORIZE                    | 42 auto-categorized (38 Tier 1, 4 Tier 2), 5 flagged     | S001    |
| 2024-01-15 10:45    | USER_CORRECTION               | Tx#34: TECHVENDOR LLC moved from 6999 → 6100             | S001    |
| 2024-01-15 10:45    | VENDOR_MAPPING_ADDED          | TECHVENDOR LLC → 6100 (from correction)                  | S001    |
| 2024-01-15 11:00    | REPORT_GENERATED              | P&L for January 2024                                     | S001    |
| 2024-01-15 11:15    | MONTH_CLOSE                   | January 2024 closed — NI $5,400                          | S001    |
| 2024-01-15 11:15    | PERIOD_BALANCE_SAVED          | January 2024 TB snapshot saved                           | S001    |
| 2024-02-05 09:00    | SESSION_START                 | Loaded profile, 3 open items pending                     | S002    |
| 2024-02-05 09:05    | OPEN_ITEM_RESOLVED            | OI-2: Bank fee — adjusting entry booked                  | S002    |
```

**When to update:** Append a new row for every:
- Transaction import (IMPORT)
- Categorization run (CATEGORIZE)
- User correction (USER_CORRECTION)
- Vendor mapping change (VENDOR_MAPPING_ADDED, VENDOR_MAPPING_UPDATED)
- Report generation (REPORT_GENERATED)
- Month-end close (MONTH_CLOSE)
- Period balance saved (PERIOD_BALANCE_SAVED)
- Session start (SESSION_START)
- Profile created or updated (PROFILE_CREATED, PROFILE_UPDATED)
- Open item created/resolved (OPEN_ITEM_CREATED, OPEN_ITEM_RESOLVED)
- COA change (COA_ACCOUNT_ADDED, COA_ACCOUNT_UPDATED)
- Tax event (TAX_PAYMENT_RECORDED, 1099_VENDOR_ADDED)

**Format rules:**
- Timestamp: YYYY-MM-DD HH:MM (24h)
- Session: Incrementing identifier per conversation session
- Never delete or edit existing rows
- Keep entries on one line — brevity matters
