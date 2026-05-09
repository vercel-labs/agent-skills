# Financial Reporting & Analysis Reference

## Table of Contents
1. The Three Financial Statements
2. Key Financial Ratios
3. Variance & Flux Analysis
4. KPIs by Business Model
5. Board & Investor Reporting
6. Cash Flow Analysis
7. Working Capital Management

---

## 1. The Three Financial Statements

### Income Statement (P&L)
Tells you: How profitable was the business over a period?

**Structure for a SaaS/tech company:**
- Revenue (break out recurring vs. non-recurring)
- Cost of Revenue / COGS (hosting, support, professional services)
- **Gross Profit** (and gross margin %)
- Operating Expenses:
  - Sales & Marketing
  - Research & Development
  - General & Administrative
- **Operating Income (EBIT)**
- Other Income / (Expense) (interest, FX, gains/losses)
- **Income Before Tax**
- Tax Provision
- **Net Income**

**What to look for:**
- Gross margin trends — is the business becoming more or less efficient?
- OpEx as % of revenue — are expenses scaling faster or slower than revenue?
- One-time items that distort the picture (restructuring, impairments, gains on sales)
- Revenue growth rate vs. expense growth rate — operating leverage emerging?

### Balance Sheet
Tells you: What does the business own, owe, and what's left for shareholders at a point in time?

**Key relationships to check:**
- Current ratio (current assets / current liabilities) — liquidity
- Quick ratio ((cash + AR) / current liabilities) — tighter liquidity test
- Debt-to-equity — leverage and financial risk
- AR vs. revenue trends — are collections keeping pace?
- Deferred revenue trends — leading indicator of future recognized revenue

### Cash Flow Statement
Tells you: Where did cash come from and where did it go?

**Three sections:**
- **Operating:** Cash from business operations. Start with net income, adjust for non-cash items (depreciation, SBC, changes in working capital). This is the most important section — positive operating cash flow means the business sustains itself.
- **Investing:** Cash spent on or received from long-term investments (capex, acquisitions, asset sales). Negative is normal for growing companies.
- **Financing:** Cash from debt and equity (fundraising, loan draws/repayments, dividends). Tells you how the business is funded.

**Free Cash Flow (FCF):** Operating cash flow − capex. The ultimate measure of cash the business generates that's available to stakeholders.

---

## 2. Key Financial Ratios

### Profitability
| Ratio | Formula | What It Tells You |
|-------|---------|-------------------|
| Gross Margin | Gross Profit / Revenue | Efficiency of core delivery |
| Operating Margin | Operating Income / Revenue | Overall operational efficiency |
| Net Margin | Net Income / Revenue | Bottom-line profitability |
| EBITDA Margin | EBITDA / Revenue | Cash-proxy profitability (pre-capex) |
| Return on Equity (ROE) | Net Income / Avg Shareholders' Equity | Return generated on equity investment |
| Return on Assets (ROA) | Net Income / Avg Total Assets | How effectively assets generate profit |

### Liquidity
| Ratio | Formula | What It Tells You |
|-------|---------|-------------------|
| Current Ratio | Current Assets / Current Liabilities | Can you pay bills due within a year? (>1.5 healthy) |
| Quick Ratio | (Cash + AR + Short-term Investments) / Current Liabilities | Tighter liquidity test (>1.0 healthy) |
| Cash Ratio | Cash / Current Liabilities | Most conservative liquidity measure |

### Efficiency
| Ratio | Formula | What It Tells You |
|-------|---------|-------------------|
| DSO | AR / (Revenue / 365) | Days to collect receivables |
| DPO | AP / (COGS / 365) | Days to pay suppliers |
| DIO | Inventory / (COGS / 365) | Days inventory sits before sale |
| Cash Conversion Cycle | DSO + DIO − DPO | Days between paying suppliers and collecting from customers |
| Asset Turnover | Revenue / Avg Total Assets | Revenue generated per dollar of assets |

### Leverage
| Ratio | Formula | What It Tells You |
|-------|---------|-------------------|
| Debt-to-Equity | Total Debt / Total Equity | Financial risk and leverage |
| Debt-to-EBITDA | Total Debt / EBITDA | Capacity to service debt |
| Interest Coverage | EBIT / Interest Expense | Ability to cover interest payments (>3x healthy) |
| Fixed Charge Coverage | (EBIT + Fixed Charges) / (Fixed Charges + Interest) | Broader obligation coverage |

### SaaS-Specific (if applicable)
| Metric | Formula | Benchmark |
|--------|---------|-----------|
| ARR | MRR × 12 | Growth rate >40% for early-stage |
| Net Revenue Retention | (Beginning ARR + Expansion − Contraction − Churn) / Beginning ARR | >110% excellent, >120% elite |
| CAC Payback | CAC / (ARR per customer × Gross Margin) | <18 months healthy |
| LTV/CAC | Customer Lifetime Value / CAC | >3x healthy |
| Rule of 40 | Revenue Growth Rate + Profit Margin | >40% indicates balanced growth |
| Burn Multiple | Net Burn / Net New ARR | <1x excellent, 1-2x good |

---

## 3. Variance & Flux Analysis

**Budget vs. Actual (BvA):** For every material line item, compute $ variance and % variance. Investigate anything >10% or >$X (set threshold based on company size).

**Month-over-Month (MoM):** Look for unexpected changes in any line item. Even if on budget, a sudden MoM shift warrants investigation.

For a detailed variance explanation framework, variance categories, and monthly business review process, see `references/fpa-budgeting.md` Section 5.

---

## 4. KPIs by Business Model

### SaaS / Subscription
Core: MRR/ARR, net revenue retention, churn rate, CAC, LTV, CAC payback, gross margin, burn rate/runway

### E-Commerce / Marketplace
Core: GMV, take rate, AOV, customer acquisition cost, repeat purchase rate, contribution margin, unit economics per order

### Professional Services
Core: Utilization rate, average bill rate, revenue per employee, project margin, backlog, win rate

### Hardware / Manufacturing
Core: Gross margin by product, inventory turns, DIO, warranty reserve, BOM cost trends, capacity utilization

---

## 5. Board & Investor Reporting

**Monthly board package essentials:**
- Executive summary (3-5 bullet narrative of what happened and why)
- P&L with BvA and commentary on material variances
- Cash flow summary and updated runway projection
- Key operating metrics dashboard (tailored to business model)
- AR aging summary
- Headcount summary (actual vs. plan)
- Key risks and mitigation actions

**Quarterly additions:**
- Balance sheet with commentary
- Updated annual forecast (re-forecast based on YTD actuals)
- Strategic initiative updates
- Capital allocation recommendations

**Principles:**
- Lead with insights, not just data. The board doesn't need to see every account — they need to understand what's happening and what you're doing about it.
- Consistency matters. Use the same format and metrics every period so trends are visible.
- Surface bad news early and with a plan. Nothing erodes board trust faster than surprises.

---

## 6. Cash Flow Analysis

### Direct vs. Indirect Method
Most companies use the indirect method (start with net income, adjust for non-cash items and working capital changes). The direct method is more intuitive but harder to prepare.

### Cash Flow Drivers to Monitor
- **Collections pace:** Are customers paying on time? Rising AR with flat revenue = warning.
- **Vendor payment timing:** Are you stretching payables or getting stretched by suppliers?
- **Capex vs. depreciation:** If capex consistently exceeds depreciation, the business is investing for growth. If below, it may be underinvesting.
- **Working capital cycle:** Cash tied up in inventory + AR − AP. Shortening this cycle frees cash.

### 13-Week Cash Flow Forecast
For detailed guidance on building and maintaining a 13-week cash flow forecast, see `references/treasury.md` Section 7.

---

## 7. Working Capital Management

**Optimization levers:**
- **AR:** Tighten payment terms, incentivize early payment (discounts), automate dunning, escalate collections on aging accounts
- **AP:** Negotiate longer payment terms with vendors, take early payment discounts when cost of capital makes it worthwhile (2/10 net 30 = ~36% annualized return)
- **Inventory:** Implement JIT where possible, review slow-moving inventory quarterly, negotiate consignment arrangements
- **Deferred Revenue:** Collect annual payments upfront (great for cash flow, but creates a delivery obligation)

**Cash Conversion Cycle target:** Varies by industry. For asset-light businesses (SaaS, services), target negative CCC (collect before you pay). For inventory-heavy businesses, benchmark against industry peers and improve incrementally.
