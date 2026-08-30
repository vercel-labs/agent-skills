---
title: Meet WCAG AA Contrast Ratios
impact: CRITICAL
impactDescription: Low contrast makes text unreadable for 300M+ people with low vision or color blindness
tags: color, contrast, low-vision, wcag
wcag: "1.4.3 Level AA, 1.4.11 Level AA"
---

## Meet WCAG AA Contrast Ratios

**Impact: CRITICAL (Low contrast makes text unreadable for 300M+ people with low vision or color blindness)**

Text and UI components must meet minimum contrast ratios against their backgrounds. WCAG AA requires 4.5:1 for normal text, 3:1 for large text (18px bold or 24px regular), and 3:1 for non-text UI components (borders, icons, focus indicators).

**Incorrect (insufficient contrast):**

```tsx
// Light gray text on white — ~2:1 ratio (fails)
<p className="text-gray-400 bg-white">Important information</p>

// Placeholder text with poor contrast
<input placeholder="Enter email" className="placeholder:text-gray-300" />

// Low-contrast button border
<button className="border border-gray-200 text-gray-400 bg-white">
  Submit
</button>
```

**Correct (sufficient contrast):**

```tsx
// Dark text on white — 7:1+ ratio (passes AA and AAA)
<p className="text-gray-700 bg-white">Important information</p>

// Placeholder with sufficient contrast
<input placeholder="Enter email" className="placeholder:text-gray-500" />

// Button with sufficient contrast for text and border
<button className="border border-gray-600 text-gray-700 bg-white">
  Submit
</button>
```

Test contrast with browser DevTools (Accessibility tab shows contrast ratio), or use tools like the WebAIM Contrast Checker. Be especially careful with text over images — add a semi-transparent overlay or text shadow to guarantee contrast.

Reference: [WCAG 1.4.3 Contrast (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
