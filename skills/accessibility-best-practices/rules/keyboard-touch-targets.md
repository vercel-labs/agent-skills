---
title: Ensure Minimum Touch and Click Target Sizes
impact: HIGH
impactDescription: Small targets cause errors for motor-impaired users and everyone on mobile
tags: keyboard, touch-targets, mobile, motor, responsive
wcag: "2.5.8 Level AA"
---

## Ensure Minimum Touch and Click Target Sizes

**Impact: HIGH (Small targets cause errors for motor-impaired users and everyone on mobile)**

Interactive elements must have a minimum target size of 24x24 CSS pixels (WCAG 2.5.8 AA). For comfortable mobile use, 44x44 pixels is recommended. This applies to buttons, links, form controls, and any clickable element — on all viewports, not just mobile.

**Incorrect (tiny targets that are hard to tap):**

```tsx
// Icon button with no padding — target is only the icon size (~16px)
<button onClick={onClose} className="text-sm">
  <XIcon className="w-4 h-4" />
</button>

// Inline links packed tightly together — easy to mis-tap
<div className="flex gap-1 text-xs">
  <a href="/terms">Terms</a>
  <a href="/privacy">Privacy</a>
  <a href="/cookies">Cookies</a>
</div>
```

**Correct (adequate target sizes with spacing):**

```tsx
// Icon button with padding to meet 44px target
<button
  onClick={onClose}
  aria-label="Close"
  className="p-3 min-w-[44px] min-h-[44px] flex items-center justify-center"
>
  <XIcon className="w-4 h-4" aria-hidden="true" />
</button>

// Links with enough padding and spacing to prevent mis-taps
<div className="flex gap-4 text-sm">
  <a href="/terms" className="py-2 px-1">Terms</a>
  <a href="/privacy" className="py-2 px-1">Privacy</a>
  <a href="/cookies" className="py-2 px-1">Cookies</a>
</div>
```

The target size includes padding. A 16px icon inside a button with 14px padding on each side gives a 44px target. Inline links in body text are exempt, but navigation links and action buttons are not.

Reference: [WCAG 2.5.8 Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)
