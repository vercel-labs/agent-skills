# Craft in Action

This shows how the subtle layering principle translates to real decisions. Learn the thinking, not the code. Your values will differ — the approach won't.

---

## The Subtle Layering Mindset

Before looking at any example, internalize this: **you should barely notice the system working.**

When you look at Vercel's dashboard, you don't think "nice borders." You just understand the structure. When you look at Supabase, you don't think "good surface elevation." You just know what's above what. The craft is invisible — that's how you know it's working.

---

## Example: Dashboard with Sidebar and Dropdown

### The Surface Decisions

**Why so subtle?** Each elevation jump should be only a few percentage points of lightness. You can barely see the difference in isolation. But when surfaces stack, the hierarchy emerges. This is the Vercel/Supabase way — whisper-quiet shifts that you feel rather than see.

**What NOT to do:** Don't make dramatic jumps between elevations. That's jarring. Don't use different hues for different levels. Keep the same hue, shift only lightness.

### The Border Decisions

**Why rgba, not solid colors?** Low opacity borders blend with their background. A low-opacity white border on a dark surface is barely there — it defines the edge without demanding attention. Solid hex borders look harsh in comparison.

**The test:** Look at your interface from arm's length. If borders are the first thing you notice, reduce opacity. If you can't find where regions end, increase slightly.

### The Sidebar Decision

**Why same background as canvas, not different?**

Many dashboards make the sidebar a different color. This fragments the visual space — now you have "sidebar world" and "content world."

Better: Same background, subtle border separation. The sidebar is part of the app, not a separate region. Vercel does this. Supabase does this. The border is enough.

### The Dropdown Decision

**Why surface-200, not surface-100?**

The dropdown floats above the card it emerged from. If both were surface-100, the dropdown would blend into the card — you'd lose the sense of layering. Surface-200 is just light enough to feel "above" without being dramatically different.

**Why border-overlay instead of border-default?**

Overlays (dropdowns, popovers) often need slightly more definition because they're floating in space. A touch more border opacity helps them feel contained without being harsh.

---

## Example: Form Controls

### Input Background Decision

**Why darker, not lighter?**

Inputs are "inset" — they receive content, they don't project it. A slightly darker background signals "type here" without needing heavy borders. This is the alternative-background principle.

### Focus State Decision

**Why subtle focus states?**

Focus needs to be visible, but you don't need a glowing ring or dramatic color. A noticeable increase in border opacity is enough for a clear state change. Subtle-but-noticeable — the same principle as surfaces.

---

## Example: Domain Exploration Done Well

### Recipe Management Tool

```
Domain: mise en place, plating, timing, stations, the pass, family meal, 86'd, ticket rail
Color world: copper pots, marble counters, cream aprons, herb greens, flame orange, cast iron black, flour dust white
Signature: "the pass" — a visual queue where dishes move from prep to ready, borrowed from professional kitchen workflow
Defaults rejecting:
  - generic card grid → station-based layout reflecting kitchen organization
  - blue accent → copper warmth (from the pots) and herb green (freshness)
  - sidebar nav → kitchen-station mental model where you "move" between stations
```

### Developer Analytics Dashboard

```
Domain: traces, spans, cold starts, p99, flame graphs, cardinality, retention, the long tail
Color world: terminal green, syntax highlighting, the glow of monitors at night, warning amber, error red against dark
Signature: "the flame" — flame graph visualization as the core metaphor, heat = time spent
Defaults rejecting:
  - card-based metrics → inline terminal-style readouts
  - friendly rounded corners → sharp, technical precision
  - colorful status badges → monochrome with semantic color only for alerts
```

---

## Adapt to Context

Your product might need:
- Warmer hues (slight yellow/orange tint)
- Cooler hues (blue-gray base)
- Different lightness progression
- Light mode (principles invert — higher elevation = shadow, not lightness)

**The principle is constant:** barely different, still distinguishable. The values adapt to context.

---

## The Craft Check

Apply the squint test to your work:

1. Blur your eyes or step back
2. Can you still perceive hierarchy?
3. Is anything jumping out at you?
4. Can you tell where regions begin and end?

If hierarchy is visible and nothing is harsh — the subtle layering is working.
