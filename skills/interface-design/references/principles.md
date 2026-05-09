# Core Craft Principles

These apply regardless of design direction. This is the quality floor.

---

## Surface & Token Architecture

Professional interfaces don't pick colors randomly — they build systems. Understanding this architecture is the difference between "looks okay" and "feels like a real product."

### The Primitive Foundation

Every color in your interface should trace back to a small set of primitives:

- **Foreground** — text colors (primary, secondary, muted)
- **Background** — surface colors (base, elevated, overlay)
- **Border** — edge colors (default, subtle, strong)
- **Brand** — your primary accent
- **Semantic** — functional colors (destructive, warning, success)

Don't invent new colors. Map everything to these primitives.

### Surface Elevation Hierarchy

Surfaces stack. A dropdown sits above a card which sits above the page. Build a numbered system:

```
Level 0: Base background (the app canvas)
Level 1: Cards, panels (primary content surfaces)
Level 2: Dropdowns, popovers (floating above)
Level 3: Nested dropdowns, stacked overlays
Level 4: Highest elevation (rare)
```

In dark mode, higher elevation = slightly lighter. In light mode, higher elevation = slightly lighter or uses shadow. The principle: **elevated surfaces need visual distinction from what's beneath them.**

### The Subtlety Principle

This is where most interfaces fail. Study Vercel, Supabase, Linear — their surfaces are **barely different** but still distinguishable. Their borders are **light but not invisible**.

**For surfaces:** The difference between elevation levels should be subtle — a few percentage points of lightness, not dramatic jumps. In dark mode, surface-100 might be 7% lighter than base, surface-200 might be 9%, surface-300 might be 12%. You can barely see it, but you feel it.

**For borders:** Borders should define regions without demanding attention. Use low opacity (0.05-0.12 alpha for dark mode, slightly higher for light). The border should disappear when you're not looking for it, but be findable when you need to understand the structure.

**The test:** Squint at your interface. You should still perceive the hierarchy — what's above what, where regions begin and end. But no single border or surface should jump out at you. If borders are the first thing you notice, they're too strong. If you can't find where one region ends and another begins, they're too subtle.

**Common mistakes to avoid:**
- Borders that are too visible (1px solid gray instead of subtle rgba)
- Surface jumps that are too dramatic (going from dark to light instead of dark to slightly-less-dark)
- Using different hues for different surfaces (gray card on blue background)
- Harsh dividers where subtle borders would do

### Text Hierarchy via Tokens

Don't just have "text" and "gray text." Build four levels:

- **Primary** — default text, highest contrast
- **Secondary** — supporting text, slightly muted
- **Tertiary** — metadata, timestamps, less important
- **Muted** — disabled, placeholder, lowest contrast

Use all four consistently. If you're only using two, your hierarchy is too flat.

### Border Progression

Borders aren't binary. Build a scale:

- **Default** — standard borders
- **Subtle/Muted** — softer separation
- **Strong** — emphasis, hover states
- **Stronger** — maximum emphasis, focus rings

Match border intensity to the importance of the boundary.

### Dedicated Control Tokens

Form controls (inputs, checkboxes, selects) have specific needs. Don't just reuse surface tokens — create dedicated ones:

- **Control background** — often different from surface backgrounds
- **Control border** — needs to feel interactive
- **Control focus** — clear focus indication

This separation lets you tune controls independently from layout surfaces.

### Context-Aware Bases

Different areas of your app might need different base surfaces:

- **Marketing pages** — might use darker/richer backgrounds
- **Dashboard/app** — might use neutral working backgrounds
- **Sidebar** — might differ from main canvas

The surface hierarchy works the same way — it just starts from a different base.

### Alternative Backgrounds for Depth

Beyond shadows, use contrasting backgrounds to create depth. An "alternative" or "inset" background makes content feel recessed. Useful for:

- Empty states in data grids
- Code blocks
- Inset panels
- Visual grouping without borders

---

## Spacing System

Pick a base unit (4px and 8px are common) and use multiples throughout. The specific number matters less than consistency — every spacing value should be explainable as "X times the base unit."

Build a scale for different contexts:
- Micro spacing (icon gaps, tight element pairs)
- Component spacing (within buttons, inputs, cards)
- Section spacing (between related groups)
- Major separation (between distinct sections)

## Symmetrical Padding

TLBR must match. If top padding is 16px, left/bottom/right must also be 16px. Exception: when content naturally creates visual balance.

```css
/* Good */
padding: 16px;
padding: 12px 16px; /* Only when horizontal needs more room */

/* Bad */
padding: 24px 16px 12px 16px;
```

## Border Radius Consistency

Sharper corners feel technical, rounder corners feel friendly. Pick a scale that fits your product's personality and use it consistently.

The key is having a system: small radius for inputs and buttons, medium for cards, large for modals or containers. Don't mix sharp and soft randomly — inconsistent radius is as jarring as inconsistent spacing.

## Depth & Elevation Strategy

Match your depth approach to your design direction. Choose ONE and commit:

**Borders-only (flat)** — Clean, technical, dense. Works for utility-focused tools where information density matters more than visual lift. Linear, Raycast, and many developer tools use almost no shadows — just subtle borders to define regions.

**Subtle single shadows** — Soft lift without complexity. A simple `0 1px 3px rgba(0,0,0,0.08)` can be enough. Works for approachable products that want gentle depth.

**Layered shadows** — Rich, premium, dimensional. Multiple shadow layers create realistic depth. Stripe and Mercury use this approach. Best for cards that need to feel like physical objects.

**Surface color shifts** — Background tints establish hierarchy without any shadows. A card at `#fff` on a `#f8fafc` background already feels elevated.

```css
/* Borders-only approach */
--border: rgba(0, 0, 0, 0.08);
--border-subtle: rgba(0, 0, 0, 0.05);
border: 0.5px solid var(--border);

/* Single shadow approach */
--shadow: 0 1px 3px rgba(0, 0, 0, 0.08);

/* Layered shadow approach */
--shadow-layered:
  0 0 0 0.5px rgba(0, 0, 0, 0.05),
  0 1px 2px rgba(0, 0, 0, 0.04),
  0 2px 4px rgba(0, 0, 0, 0.03),
  0 4px 8px rgba(0, 0, 0, 0.02);
```

## Card Layouts

Monotonous card layouts are lazy design. A metric card doesn't have to look like a plan card doesn't have to look like a settings card.

Design each card's internal structure for its specific content — but keep the surface treatment consistent: same border weight, shadow depth, corner radius, padding scale, typography.

## Isolated Controls

UI controls deserve container treatment. Date pickers, filters, dropdowns — these should feel like crafted objects.

**Never use native form elements for styled UI.** Native `<select>`, `<input type="date">`, and similar elements render OS-native dropdowns that cannot be styled. Build custom components instead:

- Custom select: trigger button + positioned dropdown menu
- Custom date picker: input + calendar popover
- Custom checkbox/radio: styled div with state management

Custom select triggers must use `display: inline-flex` with `white-space: nowrap` to keep text and chevron icons on the same row.

## Typography Hierarchy

Build distinct levels that are visually distinguishable at a glance:

- **Headlines** — heavier weight, tighter letter-spacing for presence
- **Body** — comfortable weight for readability
- **Labels/UI** — medium weight, works at smaller sizes
- **Data** — often monospace, needs `tabular-nums` for alignment

Don't rely on size alone. Combine size, weight, and letter-spacing to create clear hierarchy. If you squint and can't tell headline from body, the hierarchy is too weak.

## Monospace for Data

Numbers, IDs, codes, timestamps belong in monospace. Use `tabular-nums` for columnar alignment. Mono signals "this is data."

## Iconography

Icons clarify, not decorate — if removing an icon loses no meaning, remove it. Choose a consistent icon set and stick with it throughout the product.

Give standalone icons presence with subtle background containers. Icons next to text should align optically, not mathematically.

## Animation

Keep it fast and functional. Micro-interactions (hover, focus) should feel instant — around 150ms. Larger transitions (modals, panels) can be slightly longer — 200-250ms.

Use smooth deceleration easing (ease-out variants). Avoid spring/bounce effects in professional interfaces — they feel playful, not serious.

## Contrast Hierarchy

Build a four-level system: foreground (primary) → secondary → muted → faint. Use all four consistently.

## Color Carries Meaning

Gray builds structure. Color communicates — status, action, emphasis, identity. Unmotivated color is noise. Color that reinforces the product's world is character.

## Navigation Context

Screens need grounding. A data table floating in space feels like a component demo, not a product. Consider including:

- **Navigation** — sidebar or top nav showing where you are in the app
- **Location indicator** — breadcrumbs, page title, or active nav state
- **User context** — who's logged in, what workspace/org

When building sidebars, consider using the same background as the main content area. Rely on a subtle border for separation rather than different background colors.

## Dark Mode

Dark interfaces have different needs:

**Borders over shadows** — Shadows are less visible on dark backgrounds. Lean more on borders for definition.

**Adjust semantic colors** — Status colors (success, warning, error) often need to be slightly desaturated for dark backgrounds.

**Same structure, different values** — The hierarchy system still applies, just with inverted values.
