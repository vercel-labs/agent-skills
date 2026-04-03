# Financial Report Formats & Templates

Standards for producing professional financial reports as Excel workbooks.

---

## General Formatting Rules

### Typography & Layout
- **Font:** Arial 10pt for data, Arial 11pt bold for headers
- **Column widths:** Account names = 30-40 chars, number columns = 15 chars, narrow columns (%) = 10 chars
- **Alignment:** Text left-aligned, numbers right-aligned, headers center-aligned
- **Borders:** Thin bottom border under column headers, thin top + double bottom border on grand totals
- **Indentation:** Sub-accounts indented 2 spaces from parent category

### Number Formatting
- **Currency:** `$#,##0` (no cents for reporting; use `$#,##0.00` only for detail-level data)
- **Negative numbers:** Parentheses `($1,234)` — never minus signs
- **Percentages:** `0.0%` (one decimal)
- **Zeros:** Display as dash `—` using custom format `$#,##0;($#,##0);"—"`
- **Years in headers:** Format as text to prevent `2,024`

### Color Coding
- **Black text:** All formulas and output values
- **Blue text:** Input cells that the user should modify
- **Red text:** Negative variances, items requiring attention
- **Green text:** Positive variances, favorable items
- **Yellow highlight:** Cells flagged for review
- **Gray background:** Subtotal and total rows

---

## Income Statement (P&L)

### Structure
```
[Company Name]
Income Statement
For the Period Ended [Month DD, YYYY]

                              Current Month    Prior Month    Variance $    Variance %    YTD         Budget YTD    Var $        Var %
Revenue
  [Revenue Line 1]
  [Revenue Line 2]
Total Revenue                 ___________      ___________

Cost of Revenue
  [COGS Line 1]
  [COGS Line 2]
Total Cost of Revenue         ___________      ___________

GROSS PROFIT                  ===========      ===========    ___________   ___________
Gross Margin %                XX.X%            XX.X%

Operating Expenses
  Sales & Marketing
    [Detail lines]
  Total Sales & Marketing     ___________      ___________

  Research & Development
    [Detail lines]
  Total R&D                   ___________      ___________

  General & Administrative
    [Detail lines]
  Total G&A                   ___________      ___________

Total Operating Expenses      ___________      ___________

OPERATING INCOME (EBIT)       ===========      ===========
Operating Margin %            XX.X%            XX.X%

Other Income / (Expense)
  Interest Income
  Interest Expense
  Other
Total Other Income/(Expense)  ___________      ___________

INCOME BEFORE TAXES           ===========      ===========

Income Tax Provision          ___________      ___________

NET INCOME                    ===========      ===========
Net Margin %                  XX.X%            XX.X%
```

### Implementation Notes
- All totals and subtotals must be SUM formulas, not hardcoded
- Variance $ = Current − Prior (or Current − Budget)
- Variance % = Variance $ / Prior (handle division by zero with IFERROR)
- Gross Margin % = Gross Profit / Revenue
- Indent detail lines under each category header
- Bold all total rows and grand total rows
- Double-underline NET INCOME

---

## Balance Sheet

### Structure
```
[Company Name]
Balance Sheet
As of [Month DD, YYYY]

                                    Current Period    Prior Period    Change
ASSETS
Current Assets
  Cash & Cash Equivalents
  Accounts Receivable
  Less: Allowance for Doubtful Accounts
  Prepaid Expenses
  Other Current Assets
Total Current Assets                ___________       ___________

Non-Current Assets
  Property & Equipment (net)
  Intangible Assets (net)
  Goodwill
  Other Non-Current Assets
Total Non-Current Assets            ___________       ___________

TOTAL ASSETS                        ===========       ===========

LIABILITIES & EQUITY
Current Liabilities
  Accounts Payable
  Accrued Liabilities
  Deferred Revenue (current)
  Current Portion of Long-Term Debt
  Other Current Liabilities
Total Current Liabilities           ___________       ___________

Non-Current Liabilities
  Long-Term Debt
  Deferred Revenue (non-current)
  Other Non-Current Liabilities
Total Non-Current Liabilities       ___________       ___________

TOTAL LIABILITIES                   ___________       ___________

Stockholders' Equity
  Common Stock
  Additional Paid-in Capital
  Retained Earnings
  Owner's Draws / Distributions
Total Equity                        ___________       ___________

TOTAL LIABILITIES & EQUITY          ===========       ===========

Balance Check (should be $0):       ===========
```

### Implementation Notes
- Balance Check = Total Assets − Total Liabilities & Equity (must be zero, use conditional formatting: green if 0, red if not)
- "Net" values (PP&E net, Intangibles net) should reference accumulated depreciation/amortization
- Contra accounts (Allowance for Doubtful Accounts) displayed as negative or subtracted

---

## Trial Balance

### Structure
```
[Company Name]
Trial Balance
As of [Month DD, YYYY]

Account Code    Account Name                 Debit           Credit
1000            Cash - Operating             $XX,XXX
1010            Cash - Savings               $XX,XXX
1100            Accounts Receivable          $XX,XXX
...
4000            Revenue                                      $XX,XXX
...
6000            Rent Expense                 $XX,XXX
...
            TOTALS                           =========       =========
            Difference (must be $0)          =========
```

### Implementation Notes
- Every account with a non-zero balance gets a row
- Debit balances in Debit column, credit balances in Credit column (never negative numbers)
- Total Debits must equal Total Credits — include a difference check row
- Sort by account code
- Include account type (Asset, Liability, Equity, Revenue, Expense) as a column for filtering

---

## Cash Flow Statement (Indirect Method)

### Structure
```
[Company Name]
Statement of Cash Flows
For the Period Ended [Month DD, YYYY]

OPERATING ACTIVITIES
  Net Income                                          $XX,XXX
  Adjustments for non-cash items:
    Depreciation & Amortization                       $X,XXX
    Stock-Based Compensation                          $X,XXX
    Bad Debt Expense                                  $XXX
  Changes in working capital:
    (Increase)/Decrease in Accounts Receivable        ($X,XXX)
    (Increase)/Decrease in Prepaid Expenses           ($XXX)
    Increase/(Decrease) in Accounts Payable           $X,XXX
    Increase/(Decrease) in Accrued Liabilities        $XXX
    Increase/(Decrease) in Deferred Revenue           $X,XXX
Net Cash from Operating Activities                    =========

INVESTING ACTIVITIES
  Purchases of Property & Equipment                   ($X,XXX)
  Purchases of Intangible Assets                      ($XXX)
Net Cash from Investing Activities                    =========

FINANCING ACTIVITIES
  Proceeds from Debt                                  $XX,XXX
  Repayment of Debt                                   ($X,XXX)
  Owner Contributions                                 $X,XXX
  Owner Draws / Distributions                         ($X,XXX)
Net Cash from Financing Activities                    =========

NET CHANGE IN CASH                                    =========
Cash, Beginning of Period                             $XX,XXX
Cash, End of Period                                   $XX,XXX

Reconciliation Check (End − Begin − Net Change):      $0
```

### Implementation Notes
- Working capital changes = Current period balance sheet − Prior period balance sheet
- For assets: increase = cash outflow (negative), decrease = cash inflow (positive)
- For liabilities: increase = cash inflow (positive), decrease = cash outflow (negative)
- Net Change in Cash must equal the change in Cash on the Balance Sheet — include a check

---

## Bank Reconciliation

### Structure
```
[Company Name]
Bank Reconciliation - [Account Name]
As of [Month DD, YYYY]

BOOK SIDE (per General Ledger)
GL Cash Balance                                       $XX,XXX.XX
Adjustments:
  Add: [Items recorded by bank, not in books]
    Bank interest earned                              $XX.XX
    [Other]                                           $XX.XX
  Less: [Items recorded by bank, not in books]
    Bank service charges                              ($XX.XX)
    NSF checks                                        ($XXX.XX)
Adjusted Book Balance                                 =========

BANK SIDE (per Bank Statement)
Bank Statement Balance                                $XX,XXX.XX
Adjustments:
  Add: Deposits in Transit
    [Date] [Description] [Amount]                     $X,XXX.XX
  Less: Outstanding Checks
    Ck# [Number] [Date] [Payee] [Amount]             ($X,XXX.XX)
    Ck# [Number] [Date] [Payee] [Amount]             ($XXX.XX)
Adjusted Bank Balance                                 =========

DIFFERENCE (must be $0.00)                            =========
```

### Supporting Detail Tab
Include a transaction-level matching sheet:
| Date | Description | Bank Amount | Book Amount | Status | Notes |
|------|------------|-------------|-------------|--------|-------|

Status values: Matched, Outstanding Check, Deposit in Transit, Bank Adjustment, Book Adjustment, Discrepancy

---

## AR Aging Report

### Structure
```
[Company Name]
Accounts Receivable Aging
As of [Month DD, YYYY]

Customer    Invoice#    Date        Due Date    Total       Current     1-30        31-60       61-90       90+
[Name]      [INV-001]   [MM/DD]     [MM/DD]     $X,XXX      $X,XXX
[Name]      [INV-002]   [MM/DD]     [MM/DD]     $X,XXX                  $X,XXX
...

TOTALS                                          =========   =========   =========   =========   =========   =========
% of Total                                      100%        XX%         XX%         XX%         XX%         XX%

Summary:
Total AR                    $XX,XXX
Current (not yet due)       $XX,XXX    XX%
1-30 Days Past Due          $X,XXX     XX%
31-60 Days Past Due         $X,XXX     XX%
61-90 Days Past Due         $XXX       XX%
Over 90 Days                $XXX       XX%

DSO: XX days
```

### Conditional Formatting
- Current: No highlight
- 1-30: Light yellow background
- 31-60: Orange background
- 61-90: Light red background
- 90+: Red background, bold text

---

## AP Aging Report

### Structure
```
[Company Name]
Accounts Payable Aging
As of [Month DD, YYYY]

Vendor      Invoice#    Date        Due Date    Total       Current     1-30        31-60       61-90       90+
[Name]      [INV-001]   [MM/DD]     [MM/DD]     $X,XXX      $X,XXX
[Name]      [INV-002]   [MM/DD]     [MM/DD]     $X,XXX                  $X,XXX
...

TOTALS                                          =========   =========   =========   =========   =========   =========
% of Total                                      100%        XX%         XX%         XX%         XX%         XX%

Summary:
Total AP                    $XX,XXX
Current (not yet due)       $XX,XXX    XX%
1-30 Days Past Due          $X,XXX     XX%
31-60 Days Past Due         $X,XXX     XX%
61-90 Days Past Due         $XXX       XX%
Over 90 Days                $XXX       XX%

DPO: XX days
```

### Conditional Formatting
- Current: No highlight
- 1-30: Light yellow background
- 31-60: Orange background
- 61-90: Light red background
- 90+: Red background, bold text

### Implementation Notes
- DPO (Days Payable Outstanding) = (Average AP / Total Purchases) × Days in Period
- Include a "Payment Priority" column: HIGH (past due 60+), MEDIUM (past due 30+), LOW (current)
- Sort by due date ascending (most urgent first) within each aging bucket

---

## Month-End Close Package

A single workbook with these tabs (in order):

1. **Summary** — Key metrics, net income, cash position, notable items
2. **P&L** — Full income statement with comparatives
3. **Balance Sheet** — Full balance sheet with prior period
4. **Trial Balance** — All accounts with debit/credit columns
5. **Bank Reconciliation** — For each cash account
6. **Journal Entries** — All adjusting/closing entries for the period
7. **AR Aging** — If applicable
8. **AP Aging** — If applicable
9. **Open Items** — Anything requiring follow-up, flagged transactions, questions

The Summary tab should be a one-page executive view that a non-accountant can understand:
- Revenue this month vs. last month and budget
- Net income and margin
- Cash balance and change from prior month
- Top 3 expense categories
- Any items needing attention (past-due AR, unusual expenses, etc.)

---

## Trend Analysis Overlay

When historical data is available in `.bookkeeper/period-balances.md`, overlay trend analysis on any financial report. This is additive — it enhances existing report formats, not a standalone report.

### MoM Comparison Columns

Add these columns to the right of any existing report (P&L, Balance Sheet, or custom):

```
                              Current Month    Prior Month    MoM $ Change    MoM % Change    3-Mo Avg    vs 3-Mo Avg
Revenue
  Subscriptions               $28,000          $26,500        $1,500          5.7%            $26,000     7.7% ▲
  Services                    $5,000           $8,000         ($3,000)        (37.5%)         $6,500      (23.1%) ▼

Operating Expenses
  Payroll & Wages             $15,000          $15,000        $0              0.0%            $14,800     1.4% —
  Software & Subscriptions    $3,400           $2,800         $600            21.4%           $2,900      17.2% ▲
  Travel & Entertainment      $1,200           $400           $800            200.0%          $600        100.0% ▲▲
```

### Change Indicators

Use these symbols to make trends scannable at a glance:

| Symbol | Meaning | Rule |
|--------|---------|------|
| `▲`    | Favorable increase or unfavorable decrease is notable | Change > 10% vs prior period |
| `▲▲`   | Large movement requiring attention | Change > 50% vs prior period |
| `▼`    | Favorable decrease or unfavorable increase is notable | Change > 10% vs prior period |
| `▼▼`   | Large movement requiring attention | Change > 50% vs prior period |
| `—`    | Stable | Change ≤ 10% |

**Direction interpretation depends on account type:**
- **Revenue:** Increase = favorable (▲ green), Decrease = unfavorable (▼ red)
- **Expenses:** Increase = unfavorable (▲ red), Decrease = favorable (▼ green)
- **Assets:** Context-dependent (cash increase = good, AR increase = may signal collection issues)

### 3-Month Moving Average

For each line item, calculate and display:
- `3-Mo Avg` = average of the 3 most recent periods (including current)
- `vs 3-Mo Avg` = (Current − 3-Mo Avg) / 3-Mo Avg as percentage

This smooths out one-off spikes and helps identify true trends vs noise.

### Anomaly Flags

Automatically flag line items in the trend overlay when:

| Condition | Flag | Action |
|-----------|------|--------|
| MoM change > 50% and amount > materiality threshold | `⚠ SPIKE` | Add note explaining what changed |
| 3+ consecutive months of increase in an expense category | `📈 TREND` | Note the trend for user awareness |
| New line item (no prior period data) | `🆕 NEW` | Highlight as new category |
| Line item went to zero (had balance last month) | `⛔ STOPPED` | Confirm if intentional |
| Duplicate vendor charges (same vendor, same amount, same month) | `🔁 DUPE?` | Flag for review |

### Implementation Notes
- Only add trend columns when ≥2 periods of historical data exist in `.bookkeeper/period-balances.md`
- For 3-month average, use available periods if <3 months of history
- Use conditional formatting: green for favorable trends, red for unfavorable
- Trend columns go after the core report columns — never rearrange the base report
- Include a small legend row at the top of the trend columns explaining the symbols
