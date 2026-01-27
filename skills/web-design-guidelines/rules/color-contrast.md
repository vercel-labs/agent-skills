## Ensure Sufficient Color Contrast

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

**Example (checking contrast programmatically):**

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

Reference: [WCAG 1.4.3](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
