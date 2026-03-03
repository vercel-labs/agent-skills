# Financial Modeling & Forecasting Reference

## Table of Contents
1. Model Architecture Principles
2. Revenue Forecasting
3. Expense Modeling
4. Three-Statement Model
5. DCF Valuation
6. Scenario & Sensitivity Analysis
7. Unit Economics
8. Cash Runway & Burn Rate
9. Fundraising Models
10. M&A and Transaction Modeling

---

## 1. Model Architecture Principles

A financial model is only useful if people trust it and can work with it. These principles apply regardless of the model's purpose:

**Separation of concerns:**
- **Inputs/Assumptions tab:** All changeable assumptions in one place, clearly labeled, color-coded (blue font for inputs is industry standard)
- **Calculations tab(s):** Formulas that reference the inputs tab. No hardcoded numbers in formulas.
- **Output tabs:** Summary financials, charts, dashboards. Link to calculations.

**Transparency:**
- Every number should be traceable. If someone asks "where does this come from?", the answer should be one click away.
- Use named ranges or clear cell references. Avoid circular references.
- Document key assumptions with comments or a dedicated assumptions log.

**Flexibility:**
- Build for scenario analysis from the start. Key assumptions should be easy to toggle.
- Use monthly granularity for Year 1, quarterly for Years 2-3, annual for Years 4-5 (adjust based on the model's purpose).
- Time periods should flow left to right. Historicals on the left, projections on the right.

**Error checking:**
- Balance sheet must balance (Assets = Liabilities + Equity). Include a check row that flags TRUE/FALSE.
- Cash flow statement should reconcile to the change in cash on the balance sheet. Include a reconciliation check row.
- Build in reasonableness checks (e.g., margins within expected ranges, growth rates sensible).
- Check for hardcoded values in formula rows — every cell in a calculation row should be a formula, never a typed number.
- Ensure formula consistency across rows: if Q1 uses a formula, every subsequent quarter should use the same structure (drag/fill, don't retype).
- Sign convention: Pick one and be consistent. Common approach: revenue and assets positive, expenses and liabilities positive (natural signs). Document the convention on the cover tab.
- Include a summary error-check row at the top of the model that aggregates all individual checks. If any check fails, the summary shows an alert.

---

## 2. Revenue Forecasting

### Bottom-Up (preferred for operating models)
Build from the drivers that actually generate revenue:

**SaaS/Subscription:**
- Beginning customers + new customers − churned customers = ending customers
- Ending customers × ARPU = MRR
- Model new customer adds from: sales pipeline × conversion rate, marketing spend × CAC efficiency
- Model churn from: historical churn rate, adjusted for cohort analysis
- Model expansion from: upsell rate, price increases, seat expansion

**Transactional/E-Commerce:**
- Traffic × conversion rate = orders
- Orders × AOV = revenue
- Break down by channel (organic, paid, referral) with different economics

**Marketplace:**
- Supply-side: number of sellers/providers, listings per seller
- Demand-side: number of buyers, purchase frequency
- GMV = transactions × average transaction value
- Revenue = GMV × take rate

**Services:**
- Headcount × utilization rate × average bill rate = revenue
- Or: number of projects × average project value

### Top-Down (useful for TAM/SAM/SOM and sanity checks)
- Total addressable market × expected market share = revenue
- Good for validating bottom-up projections, not for driving operational plans

### Cohort-Based (best for retention-dependent businesses)
- Model each customer cohort separately
- Apply retention curves to each cohort over time
- Sum active customers across all cohorts for total base
- Captures the compounding effect of improving (or worsening) retention

---

## 3. Expense Modeling

### Cost of Revenue / COGS
Tie to revenue drivers:
- Hosting/infrastructure: Cost per customer or % of revenue (should decrease as % of revenue with scale)
- Customer support: Headcount-driven, based on customers-per-support-rep ratio
- Payment processing: Fixed % of transaction volume
- Third-party costs: Per-unit or per-transaction

### Operating Expenses
Model headcount first, then layer on non-personnel costs:

**Headcount plan:**
- Start with current team, add planned hires by department and month
- For fully-loaded cost assumptions, ramp periods, and detailed headcount planning, see `references/fpa-budgeting.md` Section 6

**Sales & Marketing:**
- Sales: headcount × OTE (on-target earnings), split base/variable
- Marketing: program spend (events, ads, content) + tools + headcount
- CAC targets should constrain total S&M spend

**Research & Development:**
- Engineering headcount (largest component)
- Tools and infrastructure
- Contracted development (if any)

**General & Administrative:**
- Finance, HR, legal, facilities, insurance
- Often modeled as a % of revenue at scale, but headcount-driven for early stage
- Include audit fees, legal retainers, D&O insurance, rent

### Non-Cash Expenses
- Stock-based compensation: Model separately. Based on grant schedule and fair value.
- Depreciation & amortization: Driven by capex schedule and useful life assumptions
- Important to show GAAP P&L and then bridge to non-GAAP/cash metrics

---

## 4. Three-Statement Model

The integrated three-statement model links the Income Statement, Balance Sheet, and Cash Flow Statement so that changes in assumptions automatically flow through all three.

### Linkage mechanics:
1. **Income Statement** drives net income → flows to retained earnings on Balance Sheet and starting point of Cash Flow Statement
2. **Balance Sheet** working capital changes flow to operating cash flow
3. **Cash Flow Statement** ending cash balance ties back to Balance Sheet cash

### Balance Sheet Forecasting
- **AR:** Revenue × (DSO / days in period)
- **Inventory:** COGS × (DIO / days in period)
- **Prepaid expenses:** Based on known prepayments or as % of OpEx
- **Fixed assets:** Beginning balance + capex − depreciation
- **AP:** COGS × (DPO / days in period)
- **Deferred revenue:** Based on billings schedule and recognition timing
- **Accrued expenses:** Based on known accruals or as % of OpEx
- **Debt:** Per amortization schedule
- **Equity:** Prior balance + net income + stock issuances − dividends

### Cash Flow Forecasting
Use the indirect method:
- Start with net income
- Add back non-cash charges (D&A, SBC)
- Adjust for working capital changes (increase in AR = cash outflow, increase in AP = cash inflow)
- Subtract capex (investing)
- Add/subtract financing activities (debt draws/repayments, equity raises)

---

## 5. DCF Valuation

### When to use:
- Valuing a business for M&A
- Evaluating investment opportunities
- Internal valuation for equity compensation (supports 409A)
- Strategic planning (is a project worth pursuing?)

### Mechanics:
1. **Project free cash flows (FCF)** for the explicit forecast period (typically 5-10 years)
   - FCF = EBIT × (1 − tax rate) + D&A − capex − change in working capital
2. **Calculate terminal value** using either:
   - Gordon Growth Model: FCF × (1 + g) / (WACC − g), where g = long-term growth rate (typically 2-3%)
   - Exit multiple: Apply an EV/EBITDA multiple to terminal year EBITDA
3. **Discount back to present value** using WACC
4. **Enterprise Value** = PV of FCFs + PV of terminal value
5. **Equity Value** = Enterprise Value − net debt + excess cash

### WACC (Weighted Average Cost of Capital):
- Cost of equity: Use CAPM → Rf + β × (Rm − Rf) + size premium (if applicable)
- Cost of debt: After-tax interest rate → Rd × (1 − tax rate)
- WACC = (E/V × Re) + (D/V × Rd × (1−T))

### Sanity checks:
- Terminal value should typically be 60-80% of total enterprise value (higher for early-stage)
- Implied exit multiples should be reasonable vs. public comparables
- Sensitivity table: WACC vs. terminal growth rate → show range of valuations

---

## 6. Scenario & Sensitivity Analysis

### Scenario Analysis
Build at least three scenarios:

**Base case:** Most likely outcome. Grounded in historical trends and known plans. This is your operating plan.

**Upside case:** What if things go better than planned? Higher win rates, faster growth, better retention. Useful for identifying opportunities and capacity planning.

**Downside case:** What if things go wrong? Slower growth, higher churn, delayed deals. Critical for stress-testing cash runway and identifying when cost cuts would be needed.

**How to build scenarios:**
- Identify the 3-5 variables with the most impact on outcomes
- Define optimistic and pessimistic assumptions for each
- Don't just move everything in the same direction — think about realistic combinations
- Use a scenario toggle in the model so you can switch between views instantly

### Sensitivity Analysis
Show how a key output changes when one or two inputs vary:

**One-way sensitivity (tornado chart):**
- Vary each key input ±20% independently
- Rank by impact on the output (e.g., valuation, IRR, cash runway)
- Shows which assumptions matter most

**Two-way sensitivity (data table):**
- Pick the two most impactful variables
- Create a matrix showing the output for every combination
- Classic example: WACC vs. terminal growth for DCF valuation

---

## 7. Unit Economics

The foundation of any sustainable business model. If the unit economics don't work, scale just accelerates losses.

### Key metrics:

**Customer Acquisition Cost (CAC):**
- Fully-loaded S&M spend / new customers acquired in the period
- Include all costs: salaries, commissions, ad spend, tools, events
- Segment by channel for actionable insights

**Lifetime Value (LTV):**
- ARPU × gross margin × (1 / churn rate)
- Or for cohort-based: Sum of discounted gross profit per customer over observed lifetime
- Use gross margin, not revenue — you need to cover variable costs first

**LTV/CAC ratio:**
- Target: >3x for healthy business
- <1x means you're losing money on every customer (fix unit economics before scaling)
- >5x may indicate underinvestment in growth

**CAC Payback Period:**
- CAC / (monthly gross profit per customer)
- Target: <18 months for SaaS, <12 months for transactional businesses
- This is a cash flow metric — even if LTV/CAC is great, long payback periods require more working capital

**Contribution Margin:**
- Revenue − all variable costs (COGS + variable S&M + variable support)
- The true measure of whether each unit of business is profitable before fixed costs

---

## 8. Cash Runway & Burn Rate

### Gross Burn vs. Net Burn
- **Gross burn:** Total cash out per month (all expenses and investments)
- **Net burn:** Cash out − cash in per month (gross burn − revenue)
- Runway = Cash balance / monthly net burn

### Runway Planning
- **Green zone:** >12 months runway
- **Yellow zone:** 6-12 months — start planning next raise or path to profitability
- **Red zone:** <6 months — immediate action required (cut costs, bridge financing, emergency fundraise)

### Extending Runway
In priority order:
1. Accelerate collections (AR management)
2. Renegotiate vendor terms (extend AP)
3. Cut discretionary spend (travel, events, tools)
4. Freeze hiring
5. Restructure (layoffs — last resort, but model the impact)
6. Bridge financing (debt, convertible notes)

### Cash Flow Forecasting for Startups
- Build a 13-week rolling cash forecast (see `references/treasury.md` Section 7)
- Update monthly with a longer-horizon forecast (12-24 months)
- Always model the "zero cash date" — when do you run out if nothing changes?

---

## 9. Fundraising Models

### Cap Table Modeling
- Pre-money valuation + investment amount = post-money valuation
- New shares = investment / price per share
- Dilution = new shares / (existing shares + new shares)
- Model the option pool (typically 10-20% refresh at each round)

### Convertible Notes & SAFEs
- **Convertible note:** Debt that converts to equity at next priced round. Key terms: cap, discount, interest rate, maturity date.
- **SAFE:** Not debt. Converts at next priced round. Key terms: cap and/or discount. No interest or maturity.
- Model conversion at both cap and discount to determine which applies (investor gets the better deal)

### Pro Forma Cap Table
After any financing event, produce a pro forma cap table showing:
- All share classes and their rights
- Fully diluted share count (include options, warrants, convertible instruments)
- Ownership percentages on a fully diluted basis
- Liquidation preferences and participation rights

---

## 10. M&A and Transaction Modeling

### Accretion/Dilution Analysis
- Would this acquisition increase or decrease the acquirer's EPS?
- Model: Combined earnings / combined shares (adjusted for deal structure)
- Account for: purchase price, financing costs, synergies, integration costs

### Purchase Price Allocation (ASC 805)
- Allocate purchase price to identifiable assets and liabilities at fair value
- Excess = goodwill
- Common identifiable intangibles: customer relationships, technology, trade names, noncompetes
- Requires third-party valuation for material acquisitions

### Merger Model Structure
- Standalone projections for both buyer and target
- Synergy assumptions (revenue and cost, with ramp timeline)
- Deal structure (cash vs. stock vs. mixed)
- Financing assumptions (new debt, terms, covenants)
- Pro forma combined financials
- Returns analysis: IRR, MOIC, payback period
