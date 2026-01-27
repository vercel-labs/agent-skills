# Web Design Guidelines

**Version 1.0.0**  
Engineering  
January 2026

> **Note:**  
> This document is mainly for agents and LLMs to follow when maintaining,  
> generating, or reviewing web UI code. Humans may also find it useful,  
> but guidance here is optimized for automation and consistency by AI-assisted workflows.

---

## Abstract

Comprehensive web design guidelines for building accessible, performant, and user-friendly interfaces. Contains rules across 8 categories covering accessibility, layout, typography, color, interaction, responsive design, performance, and animation. Each rule includes detailed explanations, real-world examples comparing incorrect vs. correct implementations, and impact assessments to guide automated code generation and review.

---

## Table of Contents

1. [Accessibility](#1-accessibility) — **CRITICAL**
   - 1.1 [Provide Alt Text for Images](#11-provide-alt-text-for-images)
4. [Color](#4-color) — **MEDIUM-HIGH**
   - 4.1 [Ensure Sufficient Color Contrast](#41-ensure-sufficient-color-contrast)

---

## 1. Accessibility

**Impact: CRITICAL**

Accessibility is fundamental to inclusive design. These rules ensure web content is perceivable, operable, understandable, and robust for all users, including those using assistive technologies.

### 1.1 Provide Alt Text for Images

**Impact: CRITICAL**

All images must have descriptive alt text that conveys the purpose and content of the image. Screen readers rely on alt text to describe images to users who cannot see them. Empty or missing alt text makes content inaccessible.

**Incorrect:**

```html
<img src="logo.png">

<img src="chart.png" alt="">

<img src="hero.jpg" alt="image">
```

**Correct:**

```html
<img src="logo.png" alt="Company Logo">

<img src="chart.png" alt="Bar chart showing Q4 revenue increased 25% compared to Q3">

<img src="hero.jpg" alt="Team collaborating around a whiteboard in modern office">
```

**Decorative Images:**

```html
<!-- For purely decorative images, use empty alt to hide from screen readers -->
<img src="decorative-border.png" alt="" role="presentation">
```

Reference: [https://www.w3.org/WAI/WCAG21/Understanding/non-text-content.html](https://www.w3.org/WAI/WCAG21/Understanding/non-text-content.html)

---

## 4. Color

**Impact: MEDIUM-HIGH**

Color conveys meaning and creates visual appeal. These rules ensure proper contrast, consistent usage, and accessibility compliance.

### 4.1 Ensure Sufficient Color Contrast

**Impact: CRITICAL**

Text must have sufficient contrast against its background to be readable. WCAG 2.1 requires a minimum contrast ratio of 4.5:1 for normal text and 3:1 for large text (18px+ or 14px+ bold).

**Incorrect:**

```css
/* Low contrast - fails WCAG */
.text-light {
  color: #999999;
  background-color: #ffffff;
  /* Contrast ratio: 2.85:1 */
}

.button-subtle {
  color: #aaaaaa;
  background-color: #dddddd;
  /* Contrast ratio: 1.47:1 */
}
```

**Correct:**

```css
/* Sufficient contrast - passes WCAG AA */
.text-readable {
  color: #595959;
  background-color: #ffffff;
  /* Contrast ratio: 7:1 */
}

.button-accessible {
  color: #1a1a1a;
  background-color: #dddddd;
  /* Contrast ratio: 11.9:1 */
}
```

**Example: checking contrast programmatically**

```typescript
function getContrastRatio(color1: string, color2: string): number {
  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return (lighter + 0.05) / (darker + 0.05);
}

// Minimum ratios
const NORMAL_TEXT_MIN = 4.5;
const LARGE_TEXT_MIN = 3.0;
```

Reference: [https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)

---

## References

1. [https://www.w3.org/WAI/WCAG21/quickref/](https://www.w3.org/WAI/WCAG21/quickref/)
2. [https://developer.mozilla.org/en-US/docs/Web/Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
3. [https://web.dev/learn/design/](https://web.dev/learn/design/)
4. [https://web.dev/learn/accessibility/](https://web.dev/learn/accessibility/)
5. [https://www.nngroup.com/articles/](https://www.nngroup.com/articles/)
