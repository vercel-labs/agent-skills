---
title: Use Empty alt="" for Decorative Images
impact: HIGH
impactDescription: Decorative images without alt="" are announced by screen readers, creating noise
tags: media, decorative, alt-text, screen-reader
wcag: "1.1.1 Level A"
---

## Use Empty alt="" for Decorative Images

**Impact: HIGH (Decorative images without alt="" are announced by screen readers, creating noise)**

Images that are purely decorative — backgrounds, dividers, visual flourishes, icons next to text that already describes them — should have `alt=""` (empty string). This tells screen readers to skip them entirely. Omitting the `alt` attribute entirely causes screen readers to read the filename.

**Incorrect (decorative images with alt text or missing alt):**

```tsx
// Missing alt — screen reader announces "banner-bg-gradient.png, image"
<img src="/banner-bg-gradient.png" />

// Decorative icon has redundant alt text
<span>
  <img src="/checkmark.svg" alt="checkmark" /> Task complete
</span>

// Background flourish described unnecessarily
<img src="/wave-divider.svg" alt="Decorative wave pattern" />
```

**Correct (empty alt for decorative images):**

```tsx
// Screen reader skips entirely
<img src="/banner-bg-gradient.png" alt="" />

// Icon is decorative — text already conveys meaning
<span>
  <img src="/checkmark.svg" alt="" /> Task complete
</span>

// Decorative divider hidden
<img src="/wave-divider.svg" alt="" />

// For CSS backgrounds — already invisible to screen readers (preferred)
<div className="bg-[url('/wave-divider.svg')]" />
```

When possible, use CSS backgrounds for purely decorative images instead of `<img>` — they are invisible to assistive technology by default.

Reference: [WCAG 1.1.1 Non-text Content](https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html)
