---
name: gateman-analysis
description: Post-implementation code audit using "Assume Nothing, Question Everything, Worship No One, Applaud Humility" — UBC economics Professor Robert Gateman's four laws, applied to code and AI output. Use when asked to "run gateman", "gateman analysis", "post-implementation audit", "pre-merge verification", "challenge my assumptions", "don't trust the AI", "audit for hallucination", or "is this safe to ship". Proactively suggest after completing a security-sensitive, financial, blockchain, compliance, or LLM-output-consuming feature.
metadata:
  author: tcxcx
  version: "1.1.0"
  argument-hint: <path-or-PR-or-feature-name>
---

# Gateman Analysis Protocol

> "Assume Nothing, question everything, worship no one, and applaud humility."
> — Robert Gateman, UBC Economics

A post-implementation audit protocol that treats every line of new code — and every line produced by an AI — as an economic actor: rational until proven otherwise, never trusted on reputation alone. Run it **after** writing the feature but **before** shipping it.

This skill is named in honour of an economics professor whose four-rule worldview survives translation from price theory into software and AI: every input is a stranger, every claim deserves a follow-up question, no library/framework/teammate/model gets a free pass, and the smartest move is to assume the room is full of people just as sharp as you.

## Who Was Professor Gateman?

[![Robert Gateman — Humans of UBC: "Assume Nothing" (click to open)](https://www.facebook.com/humansofubc/posts/assume-nothing-robert-gateman-economics-professor/250788225628894/)](https://www.facebook.com/humansofubc/posts/assume-nothing-robert-gateman-economics-professor/250788225628894/)

Robert Gateman taught introductory economics at the University of British Columbia for decades. He was the one teaching ECON 101 to packed lecture halls of first-years, half of whom would never see another economics class. The course was a pre-req hurdle. He treated it like a worldview.

What he gave students wasn't supply and demand curves — those they could read in any textbook. What he gave them was a posture toward knowledge:

> **"Assume Nothing, question everything, worship no one, and applaud humility."**

He ended every lecture the same way: *"Go make a difference."*

He'd spell "L O L" out with his hands.

He'd remind a hall of 600 students that they were *"at the best economics school in Canada, this should be easy for all of you"* — and in the same breath insist they hold that confidence beside humility, because everyone in the room was just as bright as they were.

He told them to **choose their business partners more carefully than their romantic ones**. In an age of AI co-developers, that one re-translates without losing a syllable: choose your model, your library, and your dependency exactly the same way. Read its terms. Distrust its bullishness. Verify its output.

And he insisted, with the conviction of someone who had watched markets crash and recover and crash again, that humility is a feature, not a weakness — that the loudest expert in the room is often the most wrong, and that the move is to assume the person beside you might know more than you do.

This skill is the engineering translation of that posture. Every checklist below maps to one of the four laws. The whole thing is a defence against the most dangerous failure mode in software *and* in AI: confident output that nobody questioned.

> **Agent instruction:** if the user says "show me Gateman", "who was Gateman", "open the link", "open the photo", or anything similar, run `open "https://www.facebook.com/humansofubc/posts/assume-nothing-robert-gateman-economics-professor/250788225628894/"` on macOS (or `xdg-open` on Linux) to load the Humans of UBC post in the user's default browser. Do not paraphrase the image — open it.

## When to Run

Invoke explicitly when you would otherwise rubber-stamp a diff. Required for:

- Finishing a feature that touches money, identity, auth, or on-chain state
- Closing a security or compliance ticket
- Pre-merge review of a feature branch heading to `main` / `production`
- Refactor of a critical code path (payments, sessions, signing, migrations)
- Anything where "looks fine" is the only evidence of correctness

Skip for: typo fixes, copy changes, dependency bumps that pass CI, isolated UI tweaks.

## Gateman's Four Laws

### 1. Assume Nothing

Every value crossing a boundary is a stranger. Validate at entry. The boundaries are:

- HTTP / RPC / webhook payloads
- Database query results
- LLM and AI provider responses (yes, *especially* these — see "Don't Trust the AI" below)
- Third-party SDK return values
- User input from forms, URLs, CLI args
- Filesystem reads, env vars, feature flags
- Cross-package internal calls when the contract isn't enforced by types

If the type system says it's safe but a runtime check costs you nothing, run the check anyway. Types are documentation; validation is enforcement.

### 2. Question Everything

A type signature is a claim. A passing test is a claim. A green CI run is a claim. A model's confidence score is a claim. The question is always the same: *what would have to be true for this claim to be wrong, and have I checked?*

Treat every diff as a hypothesis. The audit is the experiment.

- Did the code change behave the way the commit message says it does?
- Did the test actually exercise the failure case, or only the happy path?
- Did the AI's explanation match what the code actually executes?
- Did the dependency upgrade change a default you were relying on?

If you cannot name the experiment you ran, you have not questioned the claim.

### 3. Worship No One

No name on the package, no popularity on GitHub, no familiarity with a teammate, no smoothness of an AI explanation exempts code from scrutiny. Read it. Test it. Distrust it.

This applies hardest to:

- Libraries you've used for years
- Code written by senior engineers
- Wrappers around external services ("the SDK handles that")
- Your own prior commits
- Anything labelled "stable", "battle-tested", or "industry standard"
- **AI output that sounds correct, especially when it sounds correct in your voice**

The interview question for any dependency: *what does this do if I pass it garbage, and what does it do if it returns garbage to me?*

For AI specifically: *did it actually run the code, or is it telling me what the code probably does?*

### 4. Applaud Humility

The loudest expert in the room is often the most wrong. The largest model is not the most accurate. The cleanest-looking diff is not the safest one.

Reward — in yourself, in teammates, and in the model — the move that says *"I'm not sure, let me check."* Penalise — in yourself, in teammates, and in the model — the move that says *"this is fine"* without evidence.

In practice, this means:

- Prefer "I ran X and observed Y" over "I think this should work."
- Prefer a small fix with a test over a large fix without one.
- Prefer the AI that asks a clarifying question over the AI that confidently fills in a guess.
- Prefer the teammate who flags a risk over the teammate who promises it's fine.
- Prefer your own uncertainty, named out loud, over a confident vibe.

Humility is the defence against the most expensive failure mode in software *and* AI: a confident answer that nobody questioned.

## Don't Trust the AI

Gateman would never have trusted it. Neither should you.

This is the principle that makes this skill matter in 2026. LLM-augmented coding turns "Assume Nothing" from a stylistic note into a survival rule, because the AI is doing four things at once:

1. **Sounding right** in the user's voice, which silences the alarm bells that get tripped by an unfamiliar tone.
2. **Producing syntactically valid code** that passes the cheapest checks (formatter, type-checker, "does it compile").
3. **Citing things that do not exist** — functions, parameters, packages, errors, API endpoints, model IDs.
4. **Asserting completeness** when it has only done the happy path.

This is the textbook hallucination surface. Gateman's four laws map onto it directly:

| Law              | AI counterpart                                                                                                     |
| ---------------- | ------------------------------------------------------------------------------------------------------------------ |
| Assume Nothing   | The AI's output is a foreign API response. Validate its shape, its citations, its claimed file edits.              |
| Question Everything | "Did it actually run the code or only describe it?" "Does that import exist?" "Did the test it wrote even fail before the fix?" |
| Worship No One   | A larger model is not a more correct model. The brand on the API key does not exempt the response from review.    |
| Applaud Humility | Trust the AI that says "I'm not sure, let me check the file" over the AI that one-shots a confident wrong answer. |

**Concrete defences against AI hallucination** (apply every one of these on AI-written diffs):

- [ ] Every function / import / API the AI named actually exists in the codebase or the documented version of the dependency
- [ ] Every file the AI claims to have edited has been re-read to confirm the edit applied as described
- [ ] Every test the AI wrote has been observed failing on the original code before the fix
- [ ] Every external call the AI added has a runtime shape check on the response (not just a type)
- [ ] Every flag, env var, or config the AI suggested has been confirmed to exist (not assumed by the model)
- [ ] Every "this is fine, no changes needed elsewhere" claim has been verified by grep, not by belief
- [ ] Every link, URL, model ID, or version number the AI emitted has been checked against the live source

**DON'T TRUST AI.** That is not a slogan; it is a workflow. The AI is the most useful, most confident, and most assumption-laden boundary in your stack. Treat its output like a webhook from a vendor you have never met.

## Verification Checklist

Walk the checklist in order. Treat each unchecked box as a blocker until you write the justification or the fix. Honest "N/A — no external input here" is acceptable; silent skipping is not.

### Section 1 — Input Validation (Assume Nothing)

```typescript
// BAD — Assumes the shape that the type says it has
const userName = data.user.name;

// GOOD — Validates at the boundary, fails loud
if (!data?.user?.name || typeof data.user.name !== "string") {
  throw new ValidationError("Invalid user response shape");
}
const userName = data.user.name;
```

Questions:

- [ ] Every function parameter at a boundary is validated (not just typed)
- [ ] Every API / RPC / webhook response is validated before use
- [ ] User inputs are sanitized (length caps, null bytes stripped, control chars rejected)
- [ ] Optional fields have explicit defaults or branches, no implicit `undefined`
- [ ] Numeric values have explicit range checks (no `Number.MAX_SAFE_INTEGER` surprises)
- [ ] Strings that become identifiers (slugs, IDs) go through an allowlist regex

### Section 2 — External Identifiers (Worship None)

External IDs (Stripe customer IDs, third-party UUIDs, OAuth subjects, blockchain addresses) are **not** primary keys in your system. They identify entities in someone else's system.

```typescript
// BAD — Treats an external ID as if it were your own user ID
const rows = await db.from("payments").where({ customer_id: userId });

// GOOD — Resolves external ID explicitly, names the source
const user = await getUserById(userId);
const externalCustomerId = user.stripe_customer_id; // foreign system's ID
const rows = await db.from("payments").where({ customer_id: externalCustomerId });
```

Questions:

- [ ] Every external ID is named in a way that makes its origin obvious
- [ ] No external ID is used as a foreign key constraint target
- [ ] Mapping from internal ID → external ID is centralised (one query helper)
- [ ] Row-level security policies do not silently permit cross-tenant reads
- [ ] Service / admin credentials are scoped to the operations that require them

### Section 3 — Side-Channel and Fraud Surface

Any operation that moves money, mints credentials, or grants access has an adversarial counterparty. Defend before delivering value.

```typescript
// BAD — No defence against replay, self-dealing, or cycles
async function awardReferral(userId, partnerId) {
  await createAttribution(userId, partnerId);
}

// GOOD — Stacked checks before state change
async function awardReferral(userId, partnerId, ip) {
  if (userId === partnerId) throw new FraudError("Self-referral");
  if (await ipAlreadyConverted(ip, partnerId)) throw new FraudError("IP reuse");
  if (await wouldCreateCycle(userId, partnerId)) throw new FraudError("Cycle");
  if (!await isWithinValidWindow(userId)) throw new FraudError("Window expired");
  await createAttribution(userId, partnerId);
}
```

Questions:

- [ ] Rate limiting on every state-changing endpoint
- [ ] Self-action checks where relevant (self-referral, self-approval, self-payout)
- [ ] Cycle / graph-traversal checks where the data forms relationships
- [ ] IP / device / fingerprint tracking on attribution-sensitive paths
- [ ] Financial operations are reversible (refund, chargeback, clawback supported)
- [ ] Reversal handlers updated whenever a new value-creation path is added

### Section 4 — Configuration vs. Hard-Coding

Constants that change between environments (chain IDs, contract addresses, fee tiers, country codes) belong in one config module and nowhere else. Two copies will diverge.

```typescript
// BAD — Hard-coded chain list, will rot
const chains = ["avalanche", "polygon", "base"];

// GOOD — Single source of truth, validated
import { getSupportedChains, isSupportedChain } from "@/config/chains";

const chains = getSupportedChains();
if (!isSupportedChain(chainId)) throw new Error(`Unsupported chain: ${chainId}`);
```

Questions:

- [ ] No hard-coded chain IDs, contract addresses, network names, or fee rates
- [ ] Testnet vs. mainnet handled by config, not by branch
- [ ] Mapping from internal names to provider names (e.g. payment / KYC / chain provider enums) is centralised
- [ ] Env-var-driven values have a fail-loud default if the env var is missing
- [ ] Magic numbers (`30`, `500`, `0.01`) are named constants with a comment when not obvious

### Section 5 — Money, Time, and Reversibility

Anything denominated in money or time needs explicit treatment. No floats, no implicit timezones, no irreversible writes.

```typescript
const PAYOUT_RULES = {
  holdPeriodDays: 30,           // protects against refund within window
  minimumPayoutAmount: 50,      // prevents dust-attack drains
  manualReviewThreshold: 500,   // larger amounts require human approval
  maxRequestsPerDay: 3,         // rate-limits abuse
  reversalReasons: ["refund", "dispute", "chargeback", "cancelled"] as const,
  auditAllChanges: true,
} as const;
```

Questions:

- [ ] Amounts are integers in the smallest unit (cents, wei) — never floats
- [ ] Currency code travels with every amount; no implicit USD assumption
- [ ] Timestamps are UTC-stored, locale-rendered; no "server local time"
- [ ] Hold periods, cooldowns, and windows are configurable, not inline
- [ ] Provider webhooks for refund / dispute / chargeback are handled, not just success
- [ ] Every state transition that moves value writes an audit log entry

### Section 6 — Failure Modes

The unhappy path is the path you ship. Walk it.

Questions:

- [ ] Every `try` has a `catch` that does something (log, retry, surface, compensate)
- [ ] Empty `catch {}` blocks have a one-line comment justifying the swallow
- [ ] Retries have backoff and an upper bound; no infinite loops
- [ ] Timeouts on every outbound network call
- [ ] Partial-failure paths (write to A succeeded, B failed) have an explicit reconciler
- [ ] Idempotency keys on every POST that costs money or mints state
- [ ] Database transactions wrap multi-row state changes

### Section 7 — Observability

If it breaks at 3 a.m. and you cannot tell what happened, the feature is incomplete.

Questions:

- [ ] Structured logs (JSON, key-value) — not free-text `console.log("done")`
- [ ] A correlation ID (request ID, trace ID) flows through every log line in the request
- [ ] PII is redacted in logs (emails masked, full tokens never logged)
- [ ] Duration is logged for every external call
- [ ] Metric / counter emitted for every retry, fallback, or degraded path
- [ ] Error class is distinguishable from validation, network, and internal failures

### Section 8 — AI Output Verification (Don't Trust the AI)

The diff in front of you was at least partially written by a language model. Apply the AI-specific defences from "Don't Trust the AI" above, with one extra rule: when the AI's confidence and your evidence disagree, the evidence wins.

Questions:

- [ ] Re-read every file the AI claims to have edited (the edit applied as described, nothing extra was changed)
- [ ] Grep for every function / import / module the AI named (it exists at that path, with that signature)
- [ ] Run every test the AI wrote, *first* against the broken code (it fails) and *then* against the fix (it passes)
- [ ] Verify every URL, version number, model ID, and CLI flag against the live source
- [ ] When the AI says "no changes needed elsewhere", confirm by grep — not by trust
- [ ] When the AI says "this is the standard way", confirm against the actual docs of the actual version you use
- [ ] When the AI sounds especially confident, treat that as a signal to check harder, not less

## Code Quality Scorecard

Score the changed code 0–10 per category, with a one-line justification. Anything under 6 is a blocker.

| Category          | Score | Notes |
| ----------------- | ----- | ----- |
| Error handling    |       | Distinct error classes? Catches with intent? |
| Logging           |       | Structured? Correlated? PII-safe? |
| Type safety       |       | Any `any`? Unchecked casts at boundaries? |
| Testability       |       | Pure functions extracted? Boundary mockable? |
| Performance       |       | N+1 queries? Sync-in-loop? Backoff on retries? |
| Security          |       | Input validated? AuthZ on every entry? Secrets handled? |
| AI verification   |       | Every AI-claimed edit re-read? Every cited symbol verified? Every "no changes needed" grep-confirmed? |

## Continuous Improvement Buckets

After scoring, choose the highest-leverage improvement. Six recurring buckets — most audits surface one or two:

### P1 — Test Coverage on Boundary Helpers

Look for: new validators, retry wrappers, parsers, normalisers. These are the cheapest, most catastrophic places to skip tests. Aim for at least one happy-path test per branch (`returns on 2xx`, `retries on 5xx up to N`, `throws on invalid input`, `times out at T ms`).

### P2 — Type Safety

Search for `as any`, `// @ts-ignore`, and unchecked casts. Each one is a latent runtime bug. Where dynamic shape is unavoidable (foreign APIs, dynamic table names), wrap with a typed `parse()` function rather than spreading the cast through callers.

### P3 — Structured Logging

Replace `console.log` with a logger that emits JSON, accepts a context object, includes a correlation ID, and redacts known PII fields. Add `durationMs` to every entry around an external call.

### P4 — Resilience Patterns

Add: circuit breaker on services that fail in bursts, dead-letter queue for partial-success flows, idempotency keys on POSTs that mutate state, retry with exponential backoff (1s, 2s, 4s, cap at 30s).

### P5 — Extract Repeated HTTP / SDK Wrappers

When two services have private `fetchWithRetry` methods, extract to a shared client. When error-code strings appear in three files, centralise to a constants module. Two duplicates is a warning; three is a refactor.

### P6 — Security Hardening

Add rate limiting to any endpoint accepting external input. Add input sanitization middleware. Audit every new SQL query for parameter binding (no string concatenation). Confirm no secret appears in any log line, error message, or response body.

## Red Flags

If any of these appear in a diff, stop and write a justification before continuing.

**Code smells:**

- `any` types without comment
- Empty `catch {}` blocks
- Hard-coded constants that vary by environment
- `process.env.X` read deep inside business logic (read once at the edge, pass as a value)
- Direct database client construction inside a request handler (use a shared client)

**Security smells:**

- External IDs used as foreign keys
- Authorization checks that compare strings without canonicalisation
- Logging the full body of an incoming webhook (signatures, tokens leak this way)
- Reading user input into a SQL string with template literals
- A new admin endpoint without rate limiting

**Money smells:**

- Float arithmetic on currency
- Missing currency code on an amount column or field
- A successful-payment handler without a corresponding refund handler
- A value-creation path without an audit log write

## Verification Report Template

End every Gateman pass with a written verdict. The report is the deliverable, not the audit itself.

```markdown
## Gateman Verification Report

**Feature:** <name>
**Branch / PR:** <ref>
**Date:** <YYYY-MM-DD>
**Verifier:** <agent or human>

### Score

| Category       | Score | Note |
| -------------- | ----- | ---- |
| Error handling |       |      |
| Logging        |       |      |
| Type safety    |       |      |
| Testability    |       |      |
| Performance    |       |      |
| Security       |       |      |

### Checks Passed
- [x] ...

### Checks Failed
- [ ] ...

### Recommended Next Steps
1. ...
2. ...

### Risk Level
LOW | MEDIUM | HIGH | CRITICAL

### Sign-off
Safe to ship: YES | NO | YES_WITH_FOLLOWUPS
```

## How an Agent Should Run This Skill

1. Read the diff or scope the user named (file paths, PR, feature name).
2. Walk Sections 1–7 in order. For each section, name the specific lines that satisfy or violate it. No section may be skipped silently.
3. Fill the scorecard with concrete justifications. A score is only valid with a one-line reason.
4. Pick the single highest-leverage P1–P6 bucket as the recommended next step.
5. Write the report. Include the risk level. State whether the change is safe to ship.
6. If the verdict is **NO** or **CRITICAL**, name the smallest possible fix that would change the verdict.

## What This Skill Is Not

- It is **not** a substitute for tests, type-checks, or linters. Run those first; Gateman audits what they cannot see.
- It is **not** an architecture review. For "should we build this at all", use a planning or scope-review skill before writing code.
- It is **not** an alternative to threat modelling for production security-critical systems. Threat models are upstream; Gateman is downstream of implementation.
- It is **not** automatic. The protocol is a human-or-agent rubric, not a CI gate. The agent must read code and write justifications.
- It is **not** a vibes check. Vibes are exactly what this skill exists to overturn.

## Appendix — Gateman's Greatest Hits

Quotes recorded by his students. Use these as bumper stickers for the four laws. Open the references at the bottom of the file to read the originals.

> **"Go make a difference."**
> Said at the end of every lecture. The work is the artefact. Ship something that matters.

> **"Assume nothing, question everything, worship no one, and applaud humility."**
> The complete four-law statement. The rest of this skill is one big footnote to this sentence.

> **"L O L."**
> Spelled out with his hands, in lecture. The internet is a foreign country. Bring your own meaning.

> **"You're all students at the best economics school in Canada, this should be easy for all of you."**
> Then, in the next breath: *be humble, because everyone in this room is just as bright as you are.* Confidence and humility are not opposites; they are stacked.

> **"Choose your partner wisely, but choose your business partner even more wisely."**
> In 2026, your business partner is also your model, your library, and your dependency. Read the terms of service. Test the failure mode. Distrust the bullishness. The pattern of the relationship matters more than the magnetism of the first conversation.

> **"You attend the best school in the best city in the best country in the world. Be confident in your ability but approach everything with a heavy sense of humility because everyone here is just as intelligent as you. Assume nothing."**
> AI does not change this; it sharpens it. AI is a level playing field. Build with humility. Assume nothing. Worship no one — *especially the AI gods*.

### Bonus track — Supply and Demand, to the Stones

Gateman is reputed to have taught *oferta y demanda* with "(I Can't Get No) Satisfaction" playing loud enough to rattle the lecture hall. The market clears where you can't get any more of what you want at the price you want it. The song is the curve.

> *"I can't get NO… SA-TIS-FAC-TION."*

If your AI assistant gets you 80% of the way and stalls, that's the demand curve hitting the supply curve. You don't get satisfaction by yelling louder; you get it by **changing the price you're willing to pay** — in attention, in verification, in re-reading the diff. The market clears when you put in the work the model can't.

## References

- **Humans of UBC** — "Assume Nothing: Robert Gateman, Economics Professor."
  https://www.facebook.com/humansofubc/posts/assume-nothing-robert-gateman-economics-professor/250788225628894/
  *Open this on the macOS command line with* `open <url>` *when asked for "the photo" or "who was Gateman".*

- **r/UBC** — "Motivational Gateman quotes."
  https://www.reddit.com/r/UBC/comments/6lb7al/motivational_gateman_quotes/
  *Source for "Go make a difference", "L O L", the business-partner line, and the four-law statement.*

- **UBC Blogs (Kiely, 2011)** — "Gateman's Econ 101."
  https://blogs.ubc.ca/kiely/2011/11/27/gatemans-econ-101/
  *Source for the "best school / best city / best country" passage and the humility-first framing.*

## License

This skill is released under the MIT License — see the sibling `LICENSE` file.
The license carries a dedication addendum in honor of **Professor Robert Gateman, UBC Economics**.

## Tuum Est — It Is Yours

The University of British Columbia's motto is **"Tuum Est."**

Latin. *It is yours.*

You don't understand it at first. Nobody really does. The plaque is dull, the translation is bland, and you walk past it for four years on the way to class. But it isn't a slogan — it's a transfer of weight.

Your destiny is in your hands. Your freedom is in your hands. Your fortune is in your hands. Your death is in your hands. The world is in your hands because *you are Atlas Shrugged* — the shrug is not a refusal, it's the load. You carry it, or nobody does.

This is the law that closes the four. The four laws of Gateman discipline what you let in. **Tuum Est** disciplines what you put out.

- The audit is yours.
- The diff is yours.
- The hallucination — if you ship it — is yours.
- The customer who is harmed because you skipped the check — is yours.
- The teammate who inherits the silent bug at 3 a.m. — is yours.
- The line of code the AI wrote and you didn't read — is yours.

There is nobody to blame upstream. The model is a tool. The library is a tool. The teammate is a partner, not a shield. Once your name is on the merge commit, the weight is on you.

Worship no one. **Not even yourself.** *Especially* not yourself. The whole point of putting humility above the four laws is to stop you from quietly making yourself the exception. The version of you who is tired, certain, in a rush — that version is the most dangerous reviewer of your own work. Tuum Est means *that version's mistakes are also yours.*

> *Worship none. Not even yourself. Humbleness. Assume Nothing. Tuum Est.*

This is where the skill ends and the work begins. Close the file. Open the diff. Carry the load.

---

**Remember.** Assume Nothing. Question Everything. Worship No One. Applaud Humility. Don't trust the AI. **Tuum Est.** *Then* ship.
