# Transaction Guide — How to Book Common Transactions

## Table of Contents
1. Revenue Transactions
2. Expense Transactions
3. Payroll
4. Asset Purchases & Depreciation
5. Debt & Financing
6. Equity Transactions
7. Intercompany & Related Party
8. Adjusting Entries
9. Closing Entries

---

## 1. Revenue Transactions

### Simple Product/Service Sale (Point-in-time)
```
Dr. Accounts Receivable / Cash         $X
    Cr. Revenue                             $X
```
Book when: Product delivered or service performed.

### Subscription / SaaS Revenue (Over-time)
**On invoice/payment:**
```
Dr. Accounts Receivable / Cash         $X
    Cr. Deferred Revenue                    $X
```
**Monthly recognition (ratable):**
```
Dr. Deferred Revenue                   $X/n
    Cr. Revenue                             $X/n
```
Where n = number of months in the subscription period.

### Sales with Discounts
```
Dr. Accounts Receivable                $X (net of discount)
Dr. Sales Discounts                    $Y (contra-revenue)
    Cr. Revenue                             $Z (gross)
```

### Refunds / Credits
```
Dr. Revenue (or Sales Returns)         $X
    Cr. Accounts Receivable / Cash          $X
```

### Customer Deposits / Advance Payments
```
Dr. Cash                               $X
    Cr. Customer Deposits (liability)       $X
```
Reclassify to revenue when earned.

### Multi-Element Arrangements (ASC 606)
Allocate total transaction price across performance obligations based on standalone selling prices. Book each element separately:
```
Dr. Accounts Receivable                $TOTAL
    Cr. Revenue - Product                   $A (recognized at delivery)
    Cr. Deferred Revenue - Service          $B (recognized over service period)
    Cr. Deferred Revenue - Support          $C (recognized over support period)
```

---

## 2. Expense Transactions

### Vendor Invoice Received (Accrual Basis)
```
Dr. [Expense Account]                  $X
    Cr. Accounts Payable                    $X
```

### Vendor Payment
```
Dr. Accounts Payable                   $X
    Cr. Cash                                $X
```

### Credit Card Purchases
```
Dr. [Expense Account]                  $X
    Cr. Credit Card Payable                 $X
```
On credit card payment:
```
Dr. Credit Card Payable                $X
    Cr. Cash                                $X
```

### Prepaid Expenses
**On payment:**
```
Dr. Prepaid [Expense Type]             $X
    Cr. Cash / AP                           $X
```
**Monthly amortization:**
```
Dr. [Expense Account]                  $X/n
    Cr. Prepaid [Expense Type]              $X/n
```
Common prepaids: Insurance, rent, annual software licenses, conferences.

### Reimbursable Employee Expenses
```
Dr. [Expense Account]                  $X
    Cr. Accrued Liabilities (or AP)         $X
```
On reimbursement:
```
Dr. Accrued Liabilities                $X
    Cr. Cash                                $X
```

### Accrued Expenses (known cost, no invoice yet)
```
Dr. [Expense Account]                  $X
    Cr. Accrued Liabilities                 $X
```
Reverse in following period when actual invoice arrives, then book actual.

---

## 3. Payroll

### Standard Payroll Entry
```
Dr. Salary & Wages Expense             $GROSS
Dr. Payroll Tax Expense - Employer      $ER_TAXES
Dr. Benefits Expense - Employer         $ER_BENEFITS
    Cr. Cash (net pay)                      $NET
    Cr. Payroll Tax Liabilities             $EE_TAXES + $ER_TAXES
    Cr. Benefits Payable                    $EE_BENEFITS + $ER_BENEFITS
    Cr. 401k Payable                        $401K_WITHHOLDING
    Cr. Other Withholdings Payable          $OTHER
```

### Payroll Tax Deposit
```
Dr. Payroll Tax Liabilities            $X
    Cr. Cash                                $X
```

### Bonus Accrual
```
Dr. Bonus Expense                      $X
    Cr. Accrued Bonus Payable               $X
```
Accrue monthly if bonus pool is estimable. True up when paid.

### PTO / Vacation Accrual
```
Dr. PTO Expense                        $X
    Cr. Accrued PTO Liability               $X
```
Calculate: (Unused hours × hourly rate) for each employee. Adjust monthly.

### Contractor Payments (1099)
```
Dr. Contract Labor Expense             $X
    Cr. Cash / AP                           $X
```
Track separately from W-2 payroll for 1099 reporting requirements.

---

## 4. Asset Purchases & Depreciation

### Capital Asset Purchase
If above capitalization threshold:
```
Dr. Fixed Assets - [Category]          $X
    Cr. Cash / AP                           $X
```
If below threshold, expense immediately:
```
Dr. [Expense Account]                  $X
    Cr. Cash / AP                           $X
```

### Monthly Depreciation
```
Dr. Depreciation Expense               $X
    Cr. Accumulated Depreciation            $X
```

**Straight-line calculation:**
Monthly depreciation = (Cost − Salvage Value) / (Useful Life in Years × 12)

**Common useful lives:**
| Asset | Life | Salvage |
|-------|------|---------|
| Computers & equipment | 3-5 years | $0 |
| Furniture & fixtures | 5-7 years | $0 |
| Vehicles | 5 years | 10-20% |
| Leasehold improvements | Shorter of useful life or lease term | $0 |
| Software (purchased) | 3-5 years | $0 |
| Buildings | 39 years (commercial) | varies |

### Asset Disposal
```
Dr. Cash (if sold)                     $PROCEEDS
Dr. Accumulated Depreciation           $ACCUM_DEPR
Dr. Loss on Disposal (if applicable)   $LOSS
    Cr. Fixed Assets                        $ORIGINAL_COST
    Cr. Gain on Disposal (if applicable)    $GAIN
```

---

## 5. Debt & Financing

### Loan Proceeds Received
```
Dr. Cash                               $X
    Cr. Notes Payable (or Line of Credit)   $X
```

### Loan Payment (Principal + Interest)
```
Dr. Notes Payable                      $PRINCIPAL
Dr. Interest Expense                   $INTEREST
    Cr. Cash                                $TOTAL_PAYMENT
```

### Line of Credit Draw
```
Dr. Cash                               $X
    Cr. Line of Credit Payable             $X
```

### Line of Credit Repayment
```
Dr. Line of Credit Payable             $X
    Cr. Cash                                $X
```

### Interest Accrual (month-end)
```
Dr. Interest Expense                   $X
    Cr. Accrued Interest Payable            $X
```
Calculate: Outstanding principal × annual rate / 12

---

## 6. Equity Transactions

### Owner Investment / Capital Contribution
```
Dr. Cash                               $X
    Cr. Owner's Equity / Paid-in Capital    $X
```

### Owner Draw / Distribution
```
Dr. Owner's Draw / Distributions       $X
    Cr. Cash                                $X
```
Note: Draws reduce equity, they are NOT expenses.

### Stock Issuance
```
Dr. Cash                               $TOTAL
    Cr. Common Stock (par value)            $PAR
    Cr. Additional Paid-in Capital          $TOTAL - $PAR
```

### Dividend Declaration
```
Dr. Retained Earnings                  $X
    Cr. Dividends Payable                   $X
```
On payment:
```
Dr. Dividends Payable                  $X
    Cr. Cash                                $X
```

---

## 7. Intercompany & Related Party

### Intercompany Loan
**Lending entity:**
```
Dr. Intercompany Receivable            $X
    Cr. Cash                                $X
```
**Borrowing entity:**
```
Dr. Cash                               $X
    Cr. Intercompany Payable               $X
```
These must net to zero in consolidation.

### Management Fees Between Related Entities
```
Paying entity:
Dr. Management Fee Expense             $X
    Cr. Intercompany Payable               $X

Receiving entity:
Dr. Intercompany Receivable            $X
    Cr. Management Fee Income              $X
```

---

## 8. Adjusting Entries

At month-end, review and record these categories:

**Accruals:** Expenses incurred but not yet invoiced (utilities, professional fees, commissions)
**Deferrals:** Payments made for future periods (prepaid rent, insurance, deferred revenue)
**Estimates:** Bad debt provision, warranty reserves, inventory reserves
**Reclassifications:** Correcting miscategorized transactions
**Depreciation/Amortization:** Monthly charges for long-lived assets

Each adjusting entry should include a clear memo explaining why it was booked.

---

## 9. Closing Entries

At period-end (monthly or annually depending on system):

**Close revenue accounts to Income Summary:**
```
Dr. Revenue                            $TOTAL_REV
    Cr. Income Summary                     $TOTAL_REV
```

**Close expense accounts to Income Summary:**
```
Dr. Income Summary                     $TOTAL_EXP
    Cr. [Each Expense Account]             $X each
```

**Close Income Summary to Retained Earnings:**
```
If profit:
Dr. Income Summary                     $NET_INCOME
    Cr. Retained Earnings                  $NET_INCOME

If loss:
Dr. Retained Earnings                  $NET_LOSS
    Cr. Income Summary                     $NET_LOSS
```

**Close Dividends/Draws:**
```
Dr. Retained Earnings                  $X
    Cr. Dividends / Owner's Draw           $X
```

After closing entries, only balance sheet accounts (permanent accounts) should have balances. All income statement accounts (temporary accounts) should be zero.

---

## 10. Tax-Related Entries

### Sales Tax Collection (on a sale)
```
Dr. Accounts Receivable / Cash         $TOTAL
    Cr. Revenue                             $SALE_AMOUNT
    Cr. Sales Tax Payable                   $TAX_AMOUNT
```
Sales tax collected is a **liability**, not revenue. You hold it in trust for the taxing authority.

### Sales Tax Remittance (paying the taxing authority)
```
Dr. Sales Tax Payable                  $X
    Cr. Cash                                $X
```
This reduces the liability. It is NOT an expense — you're remitting money you collected.

### Estimated Income Tax Payment (Pass-Through Entity — LLC, S-Corp, Partnership)
Owner pays estimated taxes from personal funds:
```
No entry in the business books (personal obligation)
```
If owner pays from business account:
```
Dr. Owner's Draw / Distributions       $X
    Cr. Cash                                $X
```
This is NOT a business expense — it's a distribution to the owner who uses it for personal tax obligations.

### Estimated Income Tax Payment (C-Corporation)
```
Dr. Income Tax Expense                 $X
    Cr. Cash                                $X
```
C-Corps pay their own income tax. This IS a legitimate business expense.

### Quarterly Estimated Tax Accrual (C-Corp, month-end)
If booking monthly accruals for expected annual tax:
```
Dr. Income Tax Expense                 $MONTHLY_ESTIMATE
    Cr. Income Tax Payable                  $MONTHLY_ESTIMATE
```
On quarterly payment:
```
Dr. Income Tax Payable                 $QUARTERLY_AMOUNT
    Cr. Cash                                $QUARTERLY_AMOUNT
```

### Payroll Tax Deposit
```
Dr. Payroll Tax Liabilities            $X
    Cr. Cash                                $X
```
Payroll taxes (employer FICA, FUTA, SUTA) were accrued when payroll was booked. The deposit clears the liability.

### Use Tax (on purchases where sales tax wasn't charged)
When you buy something from an out-of-state vendor that didn't charge sales tax but your state requires use tax:
```
Dr. [Expense/Asset Account]           $PURCHASE_AMOUNT
Dr. Use Tax Expense (or capitalize)    $TAX_AMOUNT
    Cr. Cash / AP                           $PURCHASE_AMOUNT
    Cr. Use Tax Payable                     $TAX_AMOUNT
```
Alternatively, if use tax is immaterial, it can be included in the asset/expense cost.

### Tax Refund Received
**C-Corp:**
```
Dr. Cash                               $X
    Cr. Income Tax Expense                  $X
```
(Or credit Income Tax Payable if it was accrued as a receivable)

**Pass-through / Personal (paid from business account originally booked as draw):**
```
Dr. Cash                               $X
    Cr. Owner's Equity / Capital            $X
```

### Property Tax Payment
```
Dr. Property Tax Expense               $X
    Cr. Cash / AP                           $X
```
If prepaying, book as prepaid and amortize monthly:
```
Dr. Prepaid Property Tax               $ANNUAL
    Cr. Cash                                $ANNUAL

Monthly:
Dr. Property Tax Expense               $ANNUAL/12
    Cr. Prepaid Property Tax               $ANNUAL/12
```
