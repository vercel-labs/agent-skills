---
title: Support Forced Colors and High Contrast Mode
impact: MEDIUM
impactDescription: Windows High Contrast Mode users see broken layouts without forced-colors support
tags: color, forced-colors, high-contrast, windows, css
wcag: "1.4.11 Level AA"
---

## Support Forced Colors and High Contrast Mode

**Impact: MEDIUM (Windows High Contrast Mode users see broken layouts without forced-colors support)**

Windows High Contrast Mode overrides CSS colors with system colors. Custom-styled components that rely on `background-color` or `box-shadow` for visual meaning (focus rings, borders, selected states) can become invisible. Use the `forced-colors` media query to adapt.

**Incorrect (custom styles break in forced colors mode):**

```css
/* Focus ring using box-shadow — invisible in High Contrast Mode */
.button:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(66, 133, 244, 0.5);
}

/* Selected tab using background-color only */
.tab[aria-selected="true"] {
  background-color: #3b82f6;
  color: white;
}
```

**Correct (forced-colors fallbacks):**

```css
.button:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(66, 133, 244, 0.5);
}

/* In forced colors mode, use a visible outline instead */
@media (forced-colors: active) {
  .button:focus {
    outline: 3px solid Highlight;
    outline-offset: 2px;
  }
}

.tab[aria-selected="true"] {
  background-color: #3b82f6;
  color: white;
}

@media (forced-colors: active) {
  .tab[aria-selected="true"] {
    border-bottom: 3px solid Highlight;
    forced-color-adjust: none;
  }
}
```

Use `forced-color-adjust: none` sparingly and only when you're providing your own forced-colors styles. Test by enabling "High Contrast" in Windows Settings or "Increase Contrast" on macOS.

Reference: [MDN forced-colors media query](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/forced-colors)
