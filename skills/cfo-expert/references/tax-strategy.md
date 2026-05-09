# Tax Strategy & Compliance Reference

## Table of Contents
1. Federal Income Tax Framework
2. Entity Structure & Tax Implications
3. Key Tax Planning Strategies
4. R&D Tax Credits
5. State & Local Tax (SALT) Considerations
6. Payroll Tax Obligations
7. Sales & Use Tax
8. International Tax Basics
9. Tax Provision (ASC 740)
10. Audit Readiness

---

## 1. Federal Income Tax Framework

**C-Corporation:** Taxed at a flat 21% federal rate (TCJA — verify current rate, as this is subject to legislative change). Subject to double taxation — corporate income is taxed at the entity level, and dividends are taxed again at the shareholder level.

**S-Corporation:** Pass-through entity. Income flows to shareholders' personal returns. Limited to 100 shareholders, one class of stock, US persons only. Shareholders who are also employees must take "reasonable compensation" (subject to payroll taxes) before taking distributions.

**LLC (taxed as partnership):** Default pass-through for multi-member LLCs. Maximum flexibility in allocation of income/loss. Self-employment tax applies to active members unless properly structured.

**Sole Proprietorship:** Simplest structure. All income reported on Schedule C. Subject to self-employment tax on net earnings.

---

## 2. Entity Structure & Tax Implications

**When to recommend C-Corp:**
- Planning to raise institutional capital (VCs strongly prefer C-Corps)
- Targeting an IPO
- Want to retain earnings at the corporate rate rather than pass through at individual rates (compare current corporate vs. individual rates — both are TCJA provisions subject to change)
- Plan to use equity compensation extensively (ISO treatment only available for C-Corps)

**When to recommend S-Corp:**
- Profitable business with distributions exceeding reasonable salary (payroll tax savings)
- Owner-operators wanting pass-through treatment without SE tax on all earnings
- No plans for institutional fundraising

**When to recommend LLC (partnership):**
- Real estate ventures (pass-through losses, flexibility in allocations)
- Joint ventures between companies
- Businesses expecting early-year losses (pass through to offset other income)
- Situations requiring flexible profit/loss allocation among members

**Key decision factors:** Expected profitability timeline, fundraising plans, number and type of owners, state tax considerations, exit strategy.

---

## 3. Key Tax Planning Strategies

### Timing Strategies
- **Accelerate deductions:** Prepay expenses before year-end (within the 12-month rule for cash-basis taxpayers)
- **Defer income:** Delay invoicing or close deals in the new year if cash-basis; manage contract milestones if accrual-basis
- **Bonus depreciation:** Was 100% through 2022, phasing down annually under TCJA. Verify the current-year percentage before advising — this schedule is subject to legislative change. Allows immediate expensing of a portion of qualified asset costs.
- **Section 179:** Allows immediate expensing of qualifying equipment and software in the year placed in service. The deduction limit and phase-out threshold are indexed annually — verify current limits at IRS.gov.

### Entity-Level Strategies
- **Qualified Business Income (QBI) deduction:** Pass-through entities may deduct up to 20% of qualified business income (Section 199A — TCJA provision originally scheduled to expire after 2025; verify current status). Subject to income phase-outs and limitations for specified service businesses.
- **Reasonable compensation planning (S-Corp):** Balance salary (subject to FICA) vs. distributions (not subject to FICA). IRS scrutinizes below-market salaries.
- **Choice of accounting method:** Cash basis is simpler and offers more timing flexibility. Accrual basis is required if average gross receipts exceed the TCJA threshold (indexed annually — verify current limit). Consider the TCJA small business taxpayer simplifications.

### Loss Utilization
- **NOL carryforward:** Post-2017 NOLs carry forward indefinitely but can only offset 80% of taxable income in any year (TCJA provision — has been temporarily modified before, e.g., CARES Act suspended the 80% limit for 2018-2020; verify current rules). No carryback except for certain farming losses.
- **Section 382 limitation:** If there's an ownership change (>50% shift in value over a 3-year period), annual use of pre-change NOLs is limited. Critical to model before fundraising rounds.
- **At-risk and passive activity rules:** Pass-through losses may be limited at the individual level. Ensure shareholders have sufficient basis, at-risk amounts, and active participation.

### Compensation & Benefits
- **Retirement plan contributions:** 401(k), SEP-IRA, defined benefit plans — maximize tax-deferred contributions
- **HSA contributions:** Triple tax advantage (deductible, grows tax-free, tax-free withdrawals for medical)
- **Equity compensation planning:** ISOs vs. NSOs, early exercise + 83(b) elections, timing of exercises relative to AMT exposure

---

## 4. R&D Tax Credits (Section 41)

**Eligibility:** Expenses for research activities that involve discovering information that is technological in nature, intended to be useful in developing a new or improved business component, substantially uncertain at the outset, and involve a process of experimentation.

**Qualified research expenses (QREs):**
- W-2 wages for employees performing or supervising qualified research
- Supplies used in research
- 65% of contract research expenses paid to third parties
- Cloud computing costs used in research (increasingly accepted)

**Calculation methods:**
- Regular method: 20% × (current QREs − base amount)
- Alternative Simplified Credit (ASC): 14% × (current QREs − 50% of average QREs for prior 3 years)
- Most companies use ASC — simpler and often more beneficial for growing companies

**Startup provision:** Companies with < $5M in gross receipts and < 5 years of gross receipts can apply R&D credits against payroll taxes (FICA) annually (limit indexed — verify current cap). Incredibly valuable for pre-revenue startups.

**Section 174 capitalization (post-2022):** R&D expenditures must now be capitalized and amortized over 5 years (domestic) or 15 years (foreign). This TCJA provision is one of the most actively contested — repeal and deferral proposals recur regularly. Verify current requirement before advising. This is a significant cash tax impact — model it carefully.

**Documentation requirements:** Contemporaneous documentation is critical. Maintain project lists, time tracking, technical narratives, and financial records that tie QREs to specific projects.

---

## 5. State & Local Tax (SALT) Considerations

**Income tax nexus:** Physical presence is no longer the only standard. Most states have adopted economic nexus standards (typically based on revenue thresholds, payroll, or property in the state).

**Apportionment:** Multi-state businesses apportion income using state-specific formulas. Most states have moved to single-sales-factor apportionment (weight based on where revenue is sourced). Planning opportunity: Locating operations in states without income tax while selling into states that use single-sales-factor.

**PTE elections (Pass-Through Entity tax):** Many states now allow pass-through entities to elect to pay state income tax at the entity level, effectively working around the individual SALT deduction cap (originally $10,000 under TCJA, scheduled to sunset after 2025 — verify whether the cap has been modified, extended, or expired before advising). Evaluate annually — the math depends on member-level circumstances.

**State-specific incentives:** Many states offer credits for job creation, investment in opportunity zones, film production, angel investment, and other activities. Worth evaluating for any significant location or investment decision.

---

## 6. Payroll Tax Obligations

**Employer's share:**
- Social Security: 6.2% on wages up to the annual wage base (indexed annually — verify at ssa.gov)
- Medicare: 1.45% on all wages (no cap)
- FUTA: 6.0% on first $7,000 (reduced to 0.6% with full state credit; wage base has been stable since 1983 but verify — legislative proposals to increase it recur periodically)
- SUTA: Varies by state and experience rating

**Employee's share (withheld):**
- Social Security: 6.2% (same wage base)
- Medicare: 1.45% + 0.9% Additional Medicare Tax on wages over $200K (ACA threshold, not indexed — verify current applicability)
- Federal income tax withholding (per W-4 elections)
- State/local income tax withholding (where applicable)

**Common compliance failures:** Late deposits (penalties are steep — up to 15%), misclassifying employees as contractors (1099 vs. W-2 — apply the IRS common-law test for behavioral control, financial control, and relationship type), not tracking multi-state withholding for remote workers.

---

## 7. Sales & Use Tax

**Post-Wayfair landscape:** States can require sales tax collection from remote sellers with economic nexus (typically >$100K in sales or >200 transactions in the state). Every e-commerce and SaaS company must evaluate nexus in all states.

**SaaS taxability:** Varies dramatically by state. Some states tax SaaS as tangible personal property, others exempt it as a service. Maintain a state-by-state taxability matrix.

**Exemptions to track:** Resale certificates, manufacturing exemptions, nonprofit exemptions, government purchases. Collect and retain exemption certificates — the burden of proof is on the seller.

**Use tax obligation:** When vendors don't charge sales tax, the purchaser generally owes use tax. Often overlooked, especially for online purchases and cloud services.

---

## 8. International Tax Basics

**GILTI (Global Intangible Low-Taxed Income):** US shareholders of CFCs must include GILTI in income annually. Effectively creates a minimum tax on foreign earnings. Calculation: Net CFC tested income − 10% of qualified business asset investment (QBAI).

**FDII (Foreign-Derived Intangible Income):** Provides a reduced effective tax rate on income derived from serving foreign markets (rate depends on the corporate rate and FDII deduction percentage, both TCJA provisions subject to change — verify current effective rate). Incentivizes keeping IP and operations in the US.

**Transfer pricing:** Intercompany transactions must be at arm's length. Document transfer pricing policies and maintain contemporaneous documentation (required by Section 482 and penalties are severe).

**Foreign tax credits:** US taxpayers can credit foreign taxes paid against US tax liability (subject to limitations by category of income). Generally preferable to deducting foreign taxes.

**Withholding on payments to foreign persons:** 30% default rate on FDAP income (interest, dividends, royalties, service fees) paid to foreign persons. Reduced by treaty. Require W-8BEN or W-8BEN-E from foreign payees.

---

## 9. Tax Provision (ASC 740)

**Components of tax provision:**
- Current tax expense: Taxes owed for the current period
- Deferred tax expense/benefit: Changes in deferred tax assets and liabilities

**Deferred taxes arise from temporary differences** between book (GAAP) and tax treatment:
- Deferred tax assets (DTAs): Book expense recognized before tax deduction (e.g., SBC, accrued liabilities, NOLs)
- Deferred tax liabilities (DTLs): Tax deduction taken before book expense (e.g., accelerated depreciation, prepaid revenue)

**Valuation allowance:** If it's "more likely than not" (>50%) that some or all of a DTA won't be realized, record a valuation allowance. This is one of the most judgment-heavy areas of the tax provision. Consider: cumulative losses in recent years, expected future income, tax planning strategies, and reversing DTLs.

**Uncertain tax positions (ASC 740-10):** Apply a two-step process: (1) recognition — is it more likely than not the position will be sustained? (2) measurement — measure at the largest amount >50% likely to be sustained. Maintain documentation for all uncertain positions.

**Effective tax rate reconciliation:** Reconcile the statutory federal rate to the actual effective rate (verify current statutory rate). Common reconciling items: state taxes, permanent differences (meals, SBC for ISOs), R&D credits, foreign rate differentials, changes in valuation allowance.

---

## 10. Audit Readiness

**IRS audit triggers:**
- High deduction-to-income ratios
- Large NOL utilizations
- Significant related-party transactions
- R&D credit claims (especially first-time)
- Worker classification issues (1099 vs. W-2)
- Large charitable deductions
- Foreign transactions and credits

**Documentation to maintain:**
- Support for all material deductions and credits
- Transfer pricing documentation
- R&D credit contemporaneous records
- Fixed asset registers with depreciation schedules
- Entity organizational documents and ownership records
- Employment agreements and contractor agreements
- Board minutes authorizing significant transactions

**Best practice:** Maintain a "tax audit file" that's updated annually with support for every material position on the return. If you can't defend it in an audit, don't take the position.

**Statute of limitations:** Generally 3 years from filing date. Extends to 6 years if >25% of gross income is omitted. No limit for fraud or failure to file. Keep records for at least 7 years.
