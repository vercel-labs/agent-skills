# FP&A & Budgeting Process Reference

> **Note:** Regulatory thresholds (WARN Act, employment law) vary by jurisdiction and change over time. Verify current requirements before advising on compliance matters.

## Table of Contents
1. The FP&A Function
2. Annual Budget Process
3. Budgeting Methodologies
4. Rolling Forecasts
5. Variance Analysis & Business Reviews
6. Headcount Planning
7. FP&A Tools & Systems

---

## 1. The FP&A Function

### Role of FP&A
FP&A (Financial Planning & Analysis) is the strategic arm of finance. While accounting looks backward (what happened), FP&A looks forward (what will happen, what should we do about it).

**Core responsibilities:**
- Annual budget and long-range plan
- Monthly/quarterly forecasting and re-forecasting
- Variance analysis and business partnering
- Board and investor reporting
- Ad hoc financial analysis to support decisions (pricing, hiring, investments, M&A)
- KPI tracking and operational metrics

### When to Build the Function
- **Pre-Series A:** The CEO or a fractional CFO handles planning. Keep it simple — a monthly P&L forecast and runway tracker.
- **Series A:** Hire or designate an FP&A lead. Formalize the budget process, build the financial model, start monthly BvA reporting.
- **Series B+:** Build an FP&A team. Add business partnering (embedded analysts supporting department heads), automate reporting, implement planning tools.

### FP&A vs. Accounting
They complement each other but serve different purposes:
- **Accounting:** Accuracy, compliance, historical truth. "What happened?"
- **FP&A:** Insight, planning, decision support. "What does it mean and what should we do?"

A common mistake is burdening the accounting team with FP&A work (or vice versa). They require different mindsets and skills.

---

## 2. Annual Budget Process

### Timeline (typical for calendar-year companies)

**September:** Kick off. CEO/CFO set strategic priorities and high-level financial targets (revenue growth, profitability goals, headcount constraints).

**October:** Department heads build bottom-up budgets aligned to strategic priorities. FP&A provides templates, historical data, and guidance on assumptions.

**November:** Consolidation and iteration. FP&A rolls up department budgets, identifies gaps vs. top-down targets, facilitates negotiation. Typically 2-3 rounds of revisions.

**December:** Final approval. Board reviews and approves the annual plan. The approved budget becomes the measuring stick for the year.

**January:** Communicate. Share relevant portions with department heads. Ensure everyone knows their targets and how they'll be measured.

### Budget Components
1. **Revenue budget:** Bottom-up from sales pipeline, capacity, and historical conversion rates. See `references/financial-modeling.md` for revenue forecasting approaches.
2. **Headcount plan:** The single biggest driver of expenses for most companies. Build by department, role, start date.
3. **Operating expense budget:** Non-headcount costs by department. Include program spend (marketing, events), tools/software, travel, professional services.
4. **Capital budget:** Planned capex — equipment, facilities, capitalized software development. Evaluate large capex decisions using NPV, IRR, or payback period analysis against the company's hurdle rate.
5. **Cash flow budget:** Tie the P&L budget to expected cash flows, accounting for timing differences (collections, prepayments, debt service).

### Common Pitfalls
- **Sandbagging:** Department heads pad budgets to make targets easier. Counter with data — ask them to justify assumptions with historical trends.
- **Hockey stick revenue:** Unrealistic back-half acceleration. Push for realistic ramp curves supported by pipeline data.
- **Missing costs:** Forgetting about annual renewals, merit increases, benefits cost increases, or one-time items. Use a checklist.
- **No scenarios:** The budget should include a base case and a downside case at minimum. What's the plan if revenue comes in 20% below target?

---

## 3. Budgeting Methodologies

### Incremental Budgeting
Start with last year's actuals and adjust up or down based on planned changes.

**Pros:** Simple, fast, familiar.
**Cons:** Perpetuates inefficiencies. "We spent $500K on X last year" doesn't mean $500K was the right amount.
**Best for:** Stable, mature businesses with predictable cost structures.

### Zero-Based Budgeting (ZBB)
Every expense starts at zero and must be justified from scratch each year.

**Pros:** Forces critical evaluation of every dollar. Surfaces bloat and legacy spending.
**Cons:** Extremely time-consuming. Can create organizational fatigue if done every year on everything.
**Best for:** One-time deep dives on specific cost centers, or companies needing significant cost restructuring. Don't do full ZBB every year — rotate departments.

### Driver-Based Budgeting
Build the budget from operational drivers (headcount, customers, transactions) rather than line-item expenses.

**Pros:** Connects financial outcomes to operational decisions. Easier to model scenarios. More intellectually honest.
**Cons:** Requires clear understanding of cost drivers. Initial setup takes more thought.
**Best for:** Growth companies where costs are dynamic and tied to activity levels. This is the recommended approach for most tech companies.

**Example:** Instead of budgeting "customer support = $800K," model it as:
- Expected customers: 5,000
- Support tickets per customer per month: 1.2
- Tickets per support rep per month: 400
- Required support reps: 15
- Fully-loaded cost per rep: $85K
- Total support cost: $1.275M
- Now you can flex the budget if customer count changes.

---

## 4. Rolling Forecasts

### Why Rolling Forecasts
The annual budget goes stale fast. By March, January's assumptions may be obsolete. Rolling forecasts maintain a constant planning horizon.

### How It Works
- Maintain a 12-18 month forward view at all times
- Update monthly (or quarterly): Drop the completed month, add a new month at the end
- Re-forecast the remaining months based on current trends and updated assumptions
- Compare actuals to the original budget AND to the latest forecast

### Budget vs. Forecast
Both are important, but they serve different purposes:
- **Budget:** The commitment. This is what we said we'd do. Used for measuring performance and accountability.
- **Forecast:** The best estimate of what will actually happen. Updated regularly. Used for managing the business in real time.

Never abandon the budget mid-year. Instead, track both budget variance (are we hitting our commitments?) and forecast variance (is our latest estimate accurate?).

### Practical Implementation
- **Refresh frequency:** Monthly for the P&L and cash flow; quarterly for the full balance sheet
- **Assumptions to update:** Revenue pipeline conversion rates, hiring timeline (actual vs. planned start dates), known cost changes, macro factors
- **Keep it efficient:** Don't re-budget the whole company every month. Focus updates on the lines that are moving or uncertain.

---

## 5. Variance Analysis & Business Reviews

### Monthly Business Review (MBR)
The MBR is where FP&A drives accountability and insight. Cadence: Within 10-15 business days of month-end close.

**Agenda:**
1. Financial performance summary (actuals vs. budget, vs. forecast, vs. prior year)
2. Key variance explanations (materiality threshold: typically >10% or >$X)
3. Operational KPI review
4. Updated forecast for the remainder of the year
5. Risks, opportunities, and action items

### Variance Explanation Framework
For every material variance, provide:
1. **What:** The dollar and percentage variance
2. **Why:** Root cause (timing, volume, rate, one-time vs. recurring)
3. **So what:** Impact on full-year forecast and key metrics
4. **Now what:** Required actions or decisions

**Example:**
> Marketing expense $75K over budget (18% unfavorable). Root cause: Pulled forward Q3 conference spend to Q2 due to scheduling change. This is a timing difference — expect Q3 to be $75K favorable. Full-year impact: None. No action required.

### Variance Categories
Understanding the type of variance drives better analysis:
- **Timing:** Expected to reverse in future periods. Watch but don't overreact.
- **Volume:** More or fewer units/transactions than planned. Usually tied to revenue performance.
- **Rate/Price:** Cost per unit is different than planned. Investigate — is it a negotiation issue, market shift, or mix change?
- **One-time:** Non-recurring items. Strip out for run-rate analysis.
- **Structural:** Permanent change in the business. Requires a forecast update.

---

## 6. Headcount Planning

### Why It Matters
For most tech companies, people cost is 60-80% of total expenses. Getting headcount planning right is the single most impactful thing FP&A does.

### Headcount Plan Components

**For each planned hire:**
- Department and hiring manager
- Role title and level
- Target start date (be realistic — add 1-2 months to the hiring manager's estimate)
- Fully-loaded annual cost: Base salary + bonus target + benefits (20-30% of base) + payroll taxes (~8-12% depending on salary level and jurisdiction — the employer FICA rate drops above the Social Security wage base, but state taxes like CA SDI add back) + equity (annualized grant value)
- Ramp period: New hires don't produce at full capacity on day one. Model 50-75% productivity for month 1-2.

**Tracking:**
- Approved headcount vs. offers extended vs. actual starts
- Time to fill by department (for future planning)
- Backfill vs. net new positions
- Contractor vs. full-time mix

### Headcount-to-Revenue Alignment
Key efficiency ratios to monitor:
- Revenue per employee (total and by department)
- Customers per support rep
- ARR per sales rep (quota-carrying)
- Engineers as % of total headcount
- G&A as % of revenue

These aren't targets — they're diagnostic tools. If revenue per employee is declining, investigate whether it's over-hiring, underperformance, or healthy investment in future capacity.

### Hiring Freeze / Reduction in Force
When cash is tight, headcount is the biggest lever:
- **Hiring freeze:** Stop all new hires except critical backfills. Saves the full run-rate cost of planned hires.
- **Selective cuts:** Eliminate specific roles or teams. Model the P&L impact carefully — include severance costs. Severance benchmarks vary: established companies typically offer 2-4 weeks per year of service; startups often use flat packages (e.g., 2-4 months regardless of tenure); executive severance is contractual and often 6-12+ months. Always include benefits continuation (COBRA subsidy) in the cost model.
- **RIF (reduction in force):** Broader layoff. Requires legal review and WARN Act analysis. Federal WARN applies when laying off 50+ employees at a single site (for employers with 100+ employees) or 500+ employees regardless of site. Several states have "mini-WARN" acts with lower thresholds (e.g., California: 75 employees, New York: 50). Verify current federal and state requirements — get employment counsel involved early.

Always model the cash impact, not just the P&L impact. Severance is a near-term cash outflow, but the run-rate savings compound.

---

## 7. FP&A Tools & Systems

### Tool Landscape

**Spreadsheets (Excel/Google Sheets):**
- Everyone starts here. Fine through Series A for most companies.
- Pros: Flexible, no learning curve, free
- Cons: Version control nightmares, error-prone, doesn't scale, hard to collaborate in real-time

**FP&A Platforms (Mosaic, Runway, Jirav, Adaptive, Anaplan):**
- Purpose-built for planning, forecasting, and reporting
- Connect to ERP/accounting system, HRIS, CRM for live data
- When to adopt: Series B+ or when the spreadsheet model breaks (too many cooks, too complex, too slow)

**ERP (NetSuite, Sage Intacct, QuickBooks):**
- The system of record for accounting. FP&A pulls actuals from here.
- QuickBooks: Fine through ~$10M revenue or ~50 employees
- Sage Intacct / NetSuite: Growth stage and beyond. Multi-entity, multi-currency, dimensional reporting.

**BI/Dashboards (Looker, Metabase, Tableau, Mode):**
- For self-service KPI tracking and operational metrics
- FP&A owns the financial data models; business teams consume dashboards
- Critical: Ensure a single source of truth. Financial metrics in the BI tool must tie to the accounting system.

### Choosing the Right Time to Upgrade
Don't over-invest in tools too early. Upgrade when:
- The monthly close takes too long because of manual data aggregation
- Multiple people need to collaborate on the forecast simultaneously
- You need audit trails and version control for planning scenarios
- Board reporting requires more sophisticated visualizations than spreadsheets can deliver
- The finance team is spending more time maintaining the model than analyzing the business
