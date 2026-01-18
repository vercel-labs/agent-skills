# Web Interface Guidelines

Review these files for compliance: $ARGUMENTS

Read files, check against rules below. Output concise but comprehensive—sacrifice grammar for brevity. High signal-to-noise.

## Rules

### Interactions

- Keyboard works everywhere—all flows keyboard-operable & follow WAI-ARIA Patterns
- Clear focus—visible focus ring on every focusable element; prefer `:focus-visible` over `:focus`; set `:focus-within` for grouped controls
- Manage focus—use focus traps, move & return focus according to WAI-ARIA Patterns
- Match visual & hit targets—if visual target < 24px, expand hit target to ≥ 24px; mobile minimum 44px
- Mobile input size—font size ≥ 16px to prevent iOS Safari auto-zoom/pan on focus
- Never disable browser zoom
- Inputs must not lose focus or value after hydration
- Never disable paste in `<input>` or `<textarea>`
- Loading buttons—show loading indicator & keep original label
- Minimum loading-state duration—show-delay ~150–300ms & minimum visible time ~300–500ms to avoid flicker
- URL as state—persist state in URL for share/refresh/Back-Forward navigation (e.g., nuqs)
- Optimistic updates—update UI immediately when success likely; reconcile on server response
- Ellipsis for further input & loading states—"Rename…", "Loading…", "Saving…"
- Confirm destructive actions—require confirmation or provide Undo
- `touch-action: manipulation` prevents double-tap zoom
- Set `-webkit-tap-highlight-color` intentionally
- Forgiving interactions—generous hit targets, clear affordances, predictable interactions
- Tooltip timing—delay first tooltip; subsequent peers have no delay
- `overscroll-behavior: contain` in modals/drawers
- Scroll positions persist on Back/Forward
- Autofocus on desktop single primary input; avoid on mobile (keyboard causes layout shift)
- No dead zones—if part of control looks interactive, it should be
- Deep-link everything—filters, tabs, pagination, expanded panels
- Clean drag interactions—disable text selection & apply `inert` while element dragged
- Links are links—use `<a>` or `<Link>` for navigation (not `<button>` or `<div>`)
- Announce async updates—use polite `aria-live` for toasts & inline validation
- Locale-aware keyboard shortcuts—internationalize for non-QWERTY layouts

### Animations

- Honor `prefers-reduced-motion`—provide reduced-motion variant
- Prefer CSS > Web Animations API > JavaScript libraries
- Compositor-friendly—prioritize `transform`, `opacity`; avoid `width`, `height`, `top`, `left`
- Only animate when it clarifies cause & effect or adds deliberate delight
- Choose easing based on what changes (size, distance, trigger)
- Animations are interruptible by user input
- Input-driven—avoid autoplay; animate in response to actions
- Correct `transform-origin`—anchor motion to physical start
- Never `transition: all`—explicitly list only intended properties
- Cross-browser SVG transforms—apply to `<g>` wrappers with `transform-box: fill-box; transform-origin: center`

### Layout

- Optical alignment—adjust ±1px when perception beats geometry
- Deliberate alignment—every element aligns intentionally
- Balance contrast in lockups—adjust weight/size/spacing/color when text & icons side by side
- Responsive coverage—verify mobile, laptop, & ultra-wide (zoom out to 50% for ultra-wide)
- Respect safe areas—account for notches with `env(safe-area-inset-*)`
- No excessive scrollbars—fix overflow issues; test with macOS "Show scroll bars: Always"
- Let browser size things—prefer flex/grid/intrinsic layout over JS measurement

### Content

- Inline help first—prefer inline explanations; tooltips as last resort
- Stable skeletons—mirror final content exactly to avoid layout shift
- Accurate `<title>` reflects current context
- No dead ends—every screen offers next step or recovery path
- All states designed—empty, sparse, dense, & error states
- Typographic quotes—prefer curly quotes (" ") over straight (" ")
- Avoid widows/orphans—tidy rag & line breaks
- `font-variant-numeric: tabular-nums` for comparisons (or Geist Mono)
- Redundant status cues—don't rely on color alone; include text labels
- Icons have labels—convey same meaning with text for non-sighted users
- Visual layouts may omit visible labels but accessible names/labels still exist
- Use ellipsis character `…` over three periods `...`
- `scroll-margin-top` on headers when linking to sections
- Resilient to user-generated content—handle short, average, & very long
- Locale-aware formats—format dates, times, numbers, delimiters, currencies for user's locale
- Detect language via `Accept-Language` / `navigator.languages`—never rely on IP/GPS
- Set accurate `aria-label`, hide decoration with `aria-hidden`, verify in accessibility tree
- Icon-only buttons need descriptive `aria-label`
- Prefer native elements (`button`, `a`, `label`, `table`) before `aria-*`
- Hierarchical `<h1–h6>` & "Skip to content" link
- Non-breaking spaces: `10&nbsp;MB`, `⌘&nbsp;+&nbsp;K`, brand names

### Forms

- Enter submits when text input focused (single control); ⌘/⌃+Enter for textarea
- Every control has `<label>` or associated label
- Clicking `<label>` focuses associated control
- Keep submit enabled until submission starts; disable during request with spinner & idempotency key
- Don't block typing—allow any input & show validation feedback
- Don't pre-disable submit—allow submitting incomplete forms to surface validation
- Checkboxes & radios—no dead zones; label & control share single hit target
- Show errors next to fields; focus first error on submit
- Set `autocomplete` & meaningful `name` values
- Disable spellcheck for emails, codes, usernames
- Use correct `type` & `inputmode` for better keyboards & validation
- Placeholders end with `…` and show example pattern
- Warn before navigation with unsaved changes
- Ensure password manager & 2FA compatibility; allow pasting one-time codes
- Use `autocomplete="off"` or specific token like `autocomplete="one-time-code"` to avoid password manager triggers
- Trim input values—some input methods add trailing whitespace
- Windows `<select>`—explicitly set `background-color` & `color` for dark mode

### Performance

- Test iOS Low Power Mode & macOS Safari
- Disable extensions that add overhead when measuring
- Track re-renders—minimize & make fast (React DevTools, React Scan)
- Test with CPU & network throttling
- Minimize layout work—batch reads/writes; avoid unnecessary reflows/repaints
- `POST/PATCH/DELETE` complete in <500ms
- Prefer uncontrolled inputs; make controlled loops cheap
- Virtualize large lists (>50 items)—virtua or `content-visibility: auto`
- Preload only above-the-fold images; lazy-load rest
- Set explicit image dimensions—no CLS
- `<link rel="preconnect">` for asset/CDN domains
- Preload critical fonts
- Subset fonts—ship only needed code points/scripts
- Move expensive work to Web Workers

### Design

- Layered shadows—mimic ambient + direct light with at least two layers
- Crisp borders—combine borders & shadows; semi-transparent borders improve edge clarity
- Nested radii—child radius ≤ parent radius & concentric
- Hue consistency—on non-neutral backgrounds, tint borders/shadows/text toward same hue
- Accessible charts—color-blind-friendly palettes
- Minimum contrast—prefer APCA over WCAG 2
- Interactions increase contrast—`:hover`, `:active`, `:focus` more contrast than rest
- `<meta name="theme-color">` matches page background
- `color-scheme: dark` on `<html>` in dark themes for proper scrollbar/UI contrast
- Text anti-aliasing & transforms—animate wrapper instead of text node; use `translateZ(0)` or `will-change: transform` if artifacts persist
- Avoid gradient banding—use background images instead of CSS masks fading to dark colors

### Anti-patterns (flag these)

- `user-scalable=no` or `maximum-scale=1` disabling zoom
- `onPaste` with `preventDefault`
- `transition: all`
- `outline-none` without focus-visible replacement
- Inline `onClick` navigation without `<a>`
- `<div>` or `<span>` with click handlers (should be `<button>`)
- Images without dimensions
- Large arrays `.map()` without virtualization
- Form inputs without labels
- Icon buttons without `aria-label`
- Hardcoded date/number formats (use `Intl.*`)
- `autoFocus` without clear justification

## Output Format

Group by file. Use `file:line` format (VS Code clickable). Terse findings.

```text
## src/Button.tsx

src/Button.tsx:42 - icon button missing aria-label
src/Button.tsx:18 - input lacks label
src/Button.tsx:55 - animation missing prefers-reduced-motion
src/Button.tsx:67 - transition: all → list properties

## src/Modal.tsx

src/Modal.tsx:12 - missing overscroll-behavior: contain
src/Modal.tsx:34 - "..." → "…"

## src/Card.tsx

✓ pass
```

State issue + location. Skip explanation unless fix non-obvious. No preamble.

