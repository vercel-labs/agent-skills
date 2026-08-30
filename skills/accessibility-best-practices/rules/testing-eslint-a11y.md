---
title: Use eslint-plugin-jsx-a11y for Static Analysis
impact: MEDIUM
impactDescription: Catches common a11y issues at author time before code is even committed
tags: testing, eslint, static-analysis, linting, jsx-a11y
wcag: "N/A"
---

## Use eslint-plugin-jsx-a11y for Static Analysis

**Impact: MEDIUM (Catches common a11y issues at author time before code is even committed)**

`eslint-plugin-jsx-a11y` catches accessibility violations in JSX during development — missing alt text, invalid ARIA attributes, non-interactive element handlers, and more. It's zero-runtime-cost and catches issues before they reach a browser.

**Installation and configuration:**

```bash
npm install --save-dev eslint-plugin-jsx-a11y
```

```js
// eslint.config.js (flat config)
import jsxA11y from 'eslint-plugin-jsx-a11y'

export default [
  jsxA11y.flatConfigs.recommended,
  // or jsxA11y.flatConfigs.strict for stricter rules
]
```

**Key rules this catches:**

```tsx
// ❌ alt-text: img elements must have an alt prop
<img src="/photo.jpg" />

// ❌ anchor-is-valid: anchors must have href
<a onClick={handleClick}>Click</a>

// ❌ click-events-have-key-events: onClick on div without onKeyDown
<div onClick={handleClick}>Click me</div>

// ❌ no-noninteractive-element-interactions: onClick on <p>
<p onClick={handleClick}>Click me</p>

// ❌ aria-props: invalid ARIA attribute
<button aria-label="Close" aria-expanded="yes">X</button>

// ❌ label-has-associated-control: input without label
<input type="text" />

// ❌ no-redundant-roles: redundant role on native element
<button role="button">Submit</button>
```

Next.js includes `eslint-plugin-jsx-a11y` as part of `eslint-config-next` — if you're using Next.js, many of these rules are already active. Run `npx next lint` to check.

Reference: [eslint-plugin-jsx-a11y](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y)
