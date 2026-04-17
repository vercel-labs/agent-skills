# Treasury & Cash Management Reference

> **Note:** Regulatory thresholds (FDIC limits, specific dollar figures) may change over time. Verify current limits before citing specific numbers.

## Table of Contents
1. Cash Management Fundamentals
2. Banking Relationships
3. Credit Facilities & Debt
4. Investment Policies
5. Foreign Exchange Management
6. Debt Covenants
7. Cash Forecasting

---

## 1. Cash Management Fundamentals

### Cash Visibility
You can't manage what you can't see. Establish:
- **Daily cash position report:** Balances across all accounts, updated daily. For multi-entity companies, consolidate across entities.
- **Cash concentration:** Sweep excess cash from operating accounts to a central account to maximize returns and simplify management.
- **Account structure:** Separate operating accounts from payroll accounts from reserve accounts. This provides natural segregation and makes reconciliation easier.

### Cash Flow Timing
Understand your cash flow cycle:
- **When does cash come in?** Payment terms, collection patterns, seasonality
- **When does cash go out?** Payroll cycles (bi-weekly is the biggest), rent (1st of month), vendor terms, tax payments (quarterly estimates, annual filings)
- **Structural mismatches:** If you collect net-60 but pay net-30, you need working capital to bridge the gap

### Cash Reserves
How much cash to hold in reserve depends on:
- **Operating buffer:** 2-3 months of operating expenses minimum for profitable companies; 6+ months for startups
- **Strategic reserve:** Capital for planned investments, acquisitions, or opportunities
- **Contingency:** Unexpected events, customer losses, economic downturns
- **Covenant cushion:** If you have debt covenants, maintain headroom above minimum requirements

---

## 2. Banking Relationships

### Selecting a Bank
For startups and growth companies:
- **Primary operating bank:** Look for startup-friendly banks that understand venture-backed companies, offer treasury management services, and provide competitive credit products
- **Backup bank:** Post-SVB, having a second banking relationship is non-negotiable. Keep at least 2-3 months of operating expenses accessible at a separate institution.
- **Consider:** Fee structure, integration with your accounting stack, wire/ACH capabilities, international payment support, lending appetite

### Key Banking Services
- **ACH origination:** For payroll, vendor payments, customer collections. Cheaper and faster than checks.
- **Wire transfers:** For large or urgent payments. Implement dual-approval controls.
- **Positive pay:** Fraud prevention service — the bank only processes checks that match your issued check file. Worth the cost.
- **Lockbox services:** For companies receiving a high volume of check payments. Accelerates cash application.
- **Sweep accounts:** Automatically move excess cash to higher-yield accounts overnight.

---

## 3. Credit Facilities & Debt

### Types of Debt Facilities

**Revolving Credit Facility (Revolver):**
- Draw and repay as needed up to a committed limit
- Interest only on drawn amounts (plus a small commitment fee on undrawn)
- Typical use: Working capital fluctuations, bridge financing
- Usually secured by AR and/or inventory (asset-based lending) or general corporate credit

**Term Loan:**
- Lump sum drawn at closing, repaid per a fixed schedule
- Amortizing (regular principal payments) or bullet (principal at maturity)
- Typical use: Capital expenditures, acquisitions, recapitalizations

**Venture Debt:**
- Debt provided to venture-backed companies, typically alongside or between equity rounds
- Usually 25-35% of the last equity round
- Includes warrants (ranges vary with market conditions — historically 0.5-3%+ of the round; verify current norms)
- Use: Extend runway between equity rounds without dilution
- Risks: If the next round doesn't materialize, the debt still needs to be repaid

**Revenue-Based Financing:**
- Repayment as a percentage of monthly revenue
- No fixed maturity — repays faster when revenue is higher
- More expensive than traditional debt, but no dilution and no personal guarantees
- Good for: Profitable or near-profitable companies with predictable revenue

**Convertible Notes / SAFEs:**
- See `references/financial-modeling.md` for detailed treatment
- More equity-like than debt-like, but sits as a liability on the balance sheet until conversion

### Evaluating a Debt Facility
Key terms to negotiate and understand:
- **Interest rate:** Fixed vs. floating. If floating, what's the reference rate (SOFR + spread)?
- **Commitment fee:** Typical 0.25-0.50% on undrawn amounts
- **Covenants:** See Section 6
- **Collateral:** What's pledged? Blanket lien vs. specific assets
- **Prepayment penalties:** Can you repay early without penalty?
- **Draw conditions:** What must be true before you can draw?
- **Financial reporting:** Most facilities require quarterly or monthly financial statements delivered within 30-45 days

---

## 4. Investment Policies

### Why Have a Policy
Even if you just keep cash in a bank account, you should have a documented policy that covers:
- Permissible investments (and what's explicitly excluded)
- Maximum maturity / duration limits
- Credit quality requirements
- Concentration limits (no more than X% with any single counterparty)
- Liquidity requirements (how quickly can you access the cash?)

### Investment Options by Risk/Return

**Capital Preservation (most common for operating cash):**
- FDIC-insured bank accounts (coverage is per depositor, per insured bank, per ownership category — a single entity may have multiple ownership categories at one bank with separate coverage limits; use sweep networks like IntraFi to spread deposits across multiple banks for larger balances)
- Money market funds (government-only for lowest risk)
- Treasury bills (< 1 year maturity)

**Short-Term (1-12 months):**
- Treasury notes
- Commercial paper (A1/P1 rated)
- Corporate bonds (investment grade, short duration)

**What to Avoid with Operating Cash:**
- Equities or equity-linked instruments
- Long-duration bonds (interest rate risk)
- Illiquid investments
- Anything that requires mark-to-market with the potential for loss of principal

### Accounting Treatment
- Cash equivalents: Original maturity ≤ 3 months. Reported as cash on the balance sheet.
- Short-term investments: Maturity > 3 months but < 1 year. Classified as current assets.
- **Debt securities:** Classify as trading, available-for-sale, or held-to-maturity (ASC 320). Classification determines how gains/losses flow through the financial statements (net income vs. OCI).
- **Equity securities:** Post-ASU 2016-01, most equity securities are measured at fair value through net income (no longer eligible for AFS or HTM classification). Limited exceptions exist for equity investments without readily determinable fair values and certain equity method investments.

---

## 5. Foreign Exchange Management

### When FX Matters
If your company:
- Has revenue or expenses in foreign currencies
- Has foreign subsidiaries
- Pays employees or contractors in foreign currencies
- Holds cash balances in foreign currencies

### Types of FX Exposure

**Transaction exposure:** The risk that exchange rates change between when a transaction is initiated and when it's settled. Example: You invoice a European customer €100K, but by the time they pay, the EUR/USD rate has moved against you.

**Translation exposure:** The risk from converting foreign subsidiary financials to the reporting currency for consolidation. Doesn't affect cash flow directly but affects reported financials.

**Economic exposure:** The long-term impact of currency movements on competitive position and cash flows. Harder to hedge, more strategic.

### Hedging Approaches
- **Natural hedge:** Match currency of revenue with currency of expenses (e.g., hire in countries where you sell). Simplest and cheapest.
- **Forward contracts:** Lock in an exchange rate for a future transaction. Eliminates uncertainty but also eliminates upside.
- **Options:** Buy the right (not obligation) to exchange at a specific rate. Provides protection with upside potential, but costs a premium.
- **Policy decision:** Most growth-stage companies don't hedge actively — the cost and complexity aren't worth it until FX exposure is material (typically >10-15% of revenue or expenses).

### Interest Rate Risk Management
If you have floating-rate debt (e.g., a revolver at SOFR + spread), you have interest rate exposure. Hedging options:

- **Interest rate swap:** Exchange floating-rate payments for fixed-rate payments. Locks in your cost of debt. Most common hedging tool for term loans.
- **Interest rate cap:** Pays you when the reference rate exceeds a specified strike rate. You pay a premium upfront but keep the benefit of lower rates. Good for protecting against spikes while retaining some flexibility.
- **Interest rate collar:** Combines a cap (protection above a ceiling) with a floor (you give up benefit below a floor). Reduces the upfront premium vs. a standalone cap.
- **When to hedge:** Consider hedging when floating-rate debt is material (>$10M or >20% of total capitalization), interest expense is a significant P&L line item, or debt covenants could be stressed by rate increases. Most startups with small revolvers don't need to hedge, but companies with large term loans should evaluate.
- **Accounting:** Interest rate hedges can qualify for hedge accounting (ASC 815), which reduces P&L volatility from mark-to-market adjustments. Requires formal designation and effectiveness testing.

---

## 6. Debt Covenants

### Types of Covenants

**Financial Covenants (most common):**
- **Minimum liquidity:** Maintain cash balance above a threshold (e.g., > $5M or > 3 months of burn)
- **Minimum revenue/ARR:** Revenue must exceed a floor, often with growth requirements
- **Maximum leverage:** Debt/EBITDA must stay below a ceiling (e.g., < 3.0x)
- **Minimum interest coverage:** EBIT/Interest must exceed a floor (e.g., > 2.0x)
- **Fixed charge coverage:** (EBITDA - capex) / (interest + principal + taxes) > 1.0x
- **Maximum burn rate:** Net cash consumption below a monthly/quarterly cap

**Operational Covenants:**
- Restrictions on additional debt or liens
- Restrictions on asset sales or mergers
- Requirements to maintain insurance
- Restrictions on dividends or distributions
- Change of control provisions

### Covenant Compliance
- **Monitor monthly:** Don't wait until the compliance certificate is due. Build covenant calculations into your monthly close process.
- **Forecast forward:** Model covenant compliance under your forecast and downside scenarios. Know your cushion.
- **Early warning system:** Set internal thresholds well above (or below) the covenant level. If you hit the internal threshold, escalate and take action.
- **Cure provisions:** Understand your options if a breach is likely. Some facilities have equity cure rights (inject cash to fix the ratio). Others have grace periods.

### What Happens on a Breach
1. **Technical default:** The borrower has violated a covenant. The lender can accelerate the debt (demand full repayment).
2. **In practice:** Most lenders prefer to work with borrowers. They may grant a waiver (one-time), amend the covenant (reset the threshold), or increase pricing.
3. **Cost of a waiver:** Typically a fee (0.25-0.50% of the facility) plus potentially tighter terms going forward.
4. **Communication:** If you see a breach coming, talk to your lender early. Surprises destroy trust and limit your options.

---

## 7. Cash Forecasting

### 13-Week Cash Flow Forecast
The gold standard for near-term cash management. Build bottom-up:

**Receipts side:**
- Customer collections (by customer or cohort, based on AR aging and historical collection patterns)
- Other income (interest, refunds, grants)

**Disbursements side:**
- Payroll and payroll taxes (match to pay cycles)
- Rent and facilities
- Vendor payments (by vendor or category, based on AP aging and payment terms)
- Debt service (interest and principal per amortization schedule)
- Tax payments (estimated quarterly, annual filings)
- Capital expenditures
- One-time items (legal settlements, signing bonuses, equipment purchases)

**Format:**
- Rows: Categories of receipts and disbursements
- Columns: Week 1 through Week 13
- Include: Beginning cash, net cash flow, ending cash
- Highlight any week where ending cash falls below your minimum threshold

**Update cadence:** Weekly. Compare actual vs. forecast for the prior week and adjust the forward view.

### Long-Range Cash Forecast (12-24 months)
Ties to the financial model. Less granular but critical for:
- Fundraising timing (when will you need to raise?)
- Hiring plan feasibility (can you afford the planned headcount?)
- Covenant compliance projections
- Scenario planning (what happens to cash if growth slows 20%?)
