---
name: interface-design
description: Craft-first interface design that fights AI defaults. For dashboards, apps, admin panels, tools — not marketing sites.
---

# Interface Design

Build interface design with craft and consistency.

## Scope

**Use for:** Dashboards, admin panels, SaaS apps, tools, settings pages, data interfaces.

**Not for:** Landing pages, marketing sites, campaigns — these need different patterns.

---

# The Problem

You will generate generic output. Your training has seen thousands of dashboards. The patterns are strong.

You can follow the entire process below — explore the domain, name a signature, state your intent — and still produce a template. Warm colors on cold structures. Friendly fonts on generic layouts. "Kitchen feel" that looks like every other app.

This happens because intent lives in prose, but code generation pulls from patterns. The gap between them is where defaults win.

The process below helps. But process alone doesn't guarantee craft. You have to catch yourself.

---

# Where Defaults Hide

Defaults don't announce themselves. They disguise themselves as infrastructure — the parts that feel like they just need to work, not be designed.

**Typography feels like a container.** Pick something readable, move on. But typography isn't holding your design — it IS your design. The weight of a headline, the personality of a label, the texture of a paragraph. These shape how the product feels before anyone reads a word. A bakery management tool and a trading terminal might both need "clean, readable type" — but the type that's warm and handmade is not the type that's cold and precise. If you're reaching for your usual font, you're not designing.

**Navigation feels like scaffolding.** Build the sidebar, add the links, get to the real work. But navigation isn't around your product — it IS your product. Where you are, where you can go, what matters most. A page floating in space is a component demo, not software. The navigation teaches people how to think about the space they're in.

**Data feels like presentation.** You have numbers, show numbers. But a number on screen is not design. The question is: what does this number mean to the person looking at it? What will they do with it? A progress ring and a stacked label both show "3 of 10" — one tells a story, one fills space. If you're reaching for number-on-label, you're not designing.

**Token names feel like implementation detail.** But your CSS variables are design decisions. `--ink` and `--parchment` evoke a world. `--gray-700` and `--surface-2` evoke a template. Someone reading only your tokens should be able to guess what product this is.

The trap is thinking some decisions are creative and others are structural. There are no structural decisions. Everything is design. The moment you stop asking "why this?" is the moment defaults take over.

---

# Intent First

Before touching code, answer these. Not in your head — out loud, to yourself or the user.

**Who is this human?**
Not "users." The actual person. Where are they when they open this? What's on their mind? What did they do 5 minutes ago, what will they do 5 minutes after? A teacher at 7am with coffee is not a developer debugging at midnight is not a founder between investor meetings. Their world shapes the interface.

**What must they accomplish?**
Not "use the dashboard." The verb. Grade these submissions. Find the broken deployment. Approve the payment. The answer determines what leads, what follows, what hides.

**What should this feel like?**
Say it in words that mean something. "Clean and modern" means nothing — every AI says that. Warm like a notebook? Cold like a terminal? Dense like a trading floor? Calm like a reading app? The answer shapes color, type, spacing, density — everything.

If you cannot answer these with specifics, stop. Ask the user. Do not guess. Do not default.

## Every Choice Must Be A Choice

For every decision, you must be able to explain WHY.

- Why this layout and not another?
- Why this color temperature?
- Why this typeface?
- Why this spacing scale?
- Why this information hierarchy?

If your answer is "it's common" or "it's clean" or "it works" — you haven't chosen. You've defaulted. Defaults are invisible. Invisible choices compound into generic output.

**The test:** If you swapped your choices for the most common alternatives and the design didn't feel meaningfully different, you never made real choices.

## Sameness Is Failure

If another AI, given a similar prompt, would produce substantially the same output — you have failed.

This is not about being different for its own sake. It's about the interface emerging from the specific problem, the specific user, the specific context. When you design from intent, sameness becomes impossible because no two intents are identical.

When you design from defaults, everything looks the same because defaults are shared.

## Intent Must Be Systemic

Saying "warm" and using cold colors is not following through. Intent is not a label — it's a constraint that shapes every decision.

If the intent is warm: surfaces, text, borders, accents, semantic colors, typography — all warm. If the intent is dense: spacing, type size, information architecture — all dense. If the intent is calm: motion, contrast, color saturation — all calm.

Check your output against your stated intent. Does every token reinforce it? Or did you state an intent and then default anyway?

---

# Product Domain Exploration

This is where defaults get caught — or don't.

Generic output: Task type → Visual template → Theme
Crafted output: Task type → Product domain → Signature → Structure + Expression

The difference: time in the product's world before any visual or structural thinking.

## Required Outputs

**Do not propose any direction until you produce all four:**

**Domain:** Concepts, metaphors, vocabulary from this product's world. Not features — territory. Minimum 5.

**Color world:** What colors exist naturally in this product's domain? Not "warm" or "cool" — go to the actual world. If this product were a physical space, what would you see? What colors belong there that don't belong elsewhere? List 5+.

**Signature:** One element — visual, structural, or interaction — that could only exist for THIS product. If you can't name one, keep exploring.

**Defaults:** 3 obvious choices for this interface type — visual AND structural. You can't avoid patterns you haven't named.

## Example: Recipe Management Tool

```
Domain: mise en place, plating, timing, stations, the pass, family meal, 86'd
Color world: copper pots, marble counters, cream aprons, herb greens, flame orange, cast iron black
Signature: "the pass" — a visual queue where dishes move from prep to ready, borrowed from kitchen workflow
Defaults rejecting: generic card grid → station-based layout, blue accent → copper/cream, sidebar nav → kitchen-station mental model
```

## Proposal Requirements

Your direction must explicitly reference:
- Domain concepts you explored
- Colors from your color world exploration
- Your signature element
- What replaces each default

**The test:** Read your proposal. Remove the product name. Could someone identify what this is for? If not, it's generic. Explore deeper.

---

# The Mandate

**Before showing the user, look at what you made.**

Ask yourself: "If they said this lacks craft, what would they mean?"

That thing you just thought of — fix it first.

Your first output is probably generic. That's normal. The work is catching it before the user has to.

## The Checks

Run these against your output before presenting:

- **The swap test:** If you swapped the typeface for your usual one, would anyone notice? If you swapped the layout for a standard dashboard template, would it feel different? The places where swapping wouldn't matter are the places you defaulted.

- **The squint test:** Blur your eyes. Can you still perceive hierarchy? Is anything jumping out harshly? Craft whispers.

- **The signature test:** Can you point to five specific elements where your signature appears? Not "the overall feel" — actual components. A signature you can't locate doesn't exist.

- **The token test:** Read your CSS variables out loud. Do they sound like they belong to this product's world, or could they belong to any project?

If any check fails, iterate before showing.

---

# Craft Foundations

## Subtle Layering

This is the backbone of craft. Regardless of direction, product type, or visual style — this principle applies to everything.

**Surfaces must be barely different but still distinguishable.** Study Vercel, Supabase, Linear. Their elevation changes are so subtle you almost can't see them — but you feel the hierarchy. Not dramatic jumps. Not obviously different colors. Whisper-quiet shifts.

**Borders must be light but not invisible.** The border should disappear when you're not looking for it, but be findable when you need to understand structure. If borders are the first thing you notice, they're too strong. If you can't tell where regions begin and end, they're too weak.

**The squint test:** Blur your eyes at the interface. You should still perceive hierarchy — what's above what, where sections divide. But nothing should jump out. No harsh lines. No jarring color shifts. Just quiet structure.

This separates professional interfaces from amateur ones. Get this wrong and nothing else matters.

## Infinite Expression

Every pattern has infinite expressions. **No interface should look the same.**

A metric display could be a hero number, inline stat, sparkline, gauge, progress bar, comparison delta, trend badge, or something new. A dashboard could emphasize density, whitespace, hierarchy, or flow in completely different ways. Even sidebar + cards has infinite variations in proportion, spacing, and emphasis.

**Before building, ask:**
- What's the ONE thing users do most here?
- What products solve similar problems brilliantly? Study them.
- Why would this interface feel designed for its purpose, not templated?

**NEVER produce identical output.** Same sidebar width, same card grid, same metric boxes with icon-left-number-big-label-small every time — this signals AI-generated immediately. It's forgettable.

The architecture and components should emerge from the task and data, executed in a way that feels fresh. Linear's cards don't look like Notion's. Vercel's metrics don't look like Stripe's. Same concepts, infinite expressions.

## Color Lives Somewhere

Every product exists in a world. That world has colors.

Before you reach for a palette, spend time in the product's world. What would you see if you walked into the physical version of this space? What materials? What light? What objects?

Your palette should feel like it came FROM somewhere — not like it was applied TO something.

**Beyond Warm and Cold:** Temperature is one axis. Is this quiet or loud? Dense or spacious? Serious or playful? Geometric or organic? A trading terminal and a meditation app are both "focused" — completely different kinds of focus. Find the specific quality, not the generic label.

**Color Carries Meaning:** Gray builds structure. Color communicates — status, action, emphasis, identity. Unmotivated color is noise. One accent color, used with intention, beats five colors used without thought.

---

# Design Principles

## Spacing
Pick a base unit (4px or 8px) and use only multiples. Random values signal no system.

## Depth
Choose ONE approach and commit:
- **Borders-only** — Clean, technical. For dense tools.
- **Subtle shadows** — Soft lift. For approachable products.
- **Layered shadows** — Premium, dimensional. For cards that need presence.

Mixing approaches breaks the system.

## Typography
Headlines: weight + tight tracking. Body: readability. Data: monospace + `tabular-nums`. Build a clear hierarchy — if you squint and can't distinguish levels, it's too flat.

## Surfaces
Build from primitives: foreground (text hierarchy), background (surface elevation), border (separation), brand, semantic (destructive, warning, success). Every color traces back to these. No random hex values.

## States
Every interactive element: default, hover, active, focus, disabled. Every data state: loading, empty, error. Missing states feel broken.

## Controls
Native `<select>` and `<input type="date">` can't be styled. Build custom components.

---

# Avoid

- Harsh borders — if they're the first thing you see, they're too strong
- Dramatic surface jumps — elevation should whisper, not shout
- Inconsistent spacing — clearest sign of no system
- Mixed depth strategies — pick one, commit fully
- Missing interaction states
- Pure white cards on colored backgrounds
- Gradients and color for decoration — color must mean something
- Multiple accent colors — dilutes focus

---

# Workflow

## Communication
Be invisible. Don't announce modes or narrate process.

**Never say:** "I'm in ESTABLISH MODE", "Let me check system.md..."

**Instead:** Jump into work. State suggestions with reasoning.

## Suggest + Ask
Lead with your exploration and recommendation, then confirm:
```
Domain: [5+ concepts]
Color world: [5+ colors from the domain]
Signature: [unique element]
Rejecting: [default] → [alternative], [default] → [alternative], [default] → [alternative]

Direction: [approach connecting all the above]

Does this direction feel right?
```

## If Project Has system.md
Read `.interface-design/system.md` and apply. Decisions are made.

## If No system.md
1. Explore domain — Produce all four required outputs
2. Propose — Direction must reference all four
3. Confirm — Get user buy-in
4. Build — Apply principles
5. **Evaluate** — Run the mandate checks before showing
6. Offer to save

---

# After Completing a Task

When you finish building something, **always offer to save**:

```
Want me to save these patterns for future sessions?
```

If yes, write to `.interface-design/system.md`:

```markdown
# Design System

## Direction
Personality: [e.g., Precision & Density]
Foundation: [e.g., Cool slate, Warm cream]
Depth: [Borders-only | Subtle shadows | Layered]

## Tokens
### Spacing
Base: [4px | 8px]
Scale: [e.g., 4, 8, 12, 16, 24, 32]

### Colors
--foreground: [value]
--secondary: [value]
--accent: [value]
--surface-1: [value]
--surface-2: [value]
--border: [value]

## Patterns
### [Component Name]
- [Key property]: [value]
- [Key property]: [value]
- Usage: [when to use]
```

This compounds — each save makes future work faster and more consistent.

---

# References

Load these for implementation specifics when needed:
- `references/principles.md` — Surface architecture, token systems, dark mode patterns
- `references/validation.md` — When to update system.md, consistency checks
- `references/example.md` — Craft decisions with reasoning
