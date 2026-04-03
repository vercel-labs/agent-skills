---
title: Provide Descriptive Alt Text for Meaningful Images
impact: CRITICAL
impactDescription: Blind users cannot perceive image content without alt text
tags: media, alt-text, images, screen-reader, blind
wcag: "1.1.1 Level A"
---

## Provide Descriptive Alt Text for Meaningful Images

**Impact: CRITICAL (Blind users cannot perceive image content without alt text)**

Every meaningful image needs alt text that conveys the same information the image provides to sighted users. Alt text should describe the content and function, not just say "image of..." Screen readers already announce "image" — don't repeat it.

**Incorrect (missing, generic, or redundant alt text):**

```tsx
// Missing alt — screen reader reads filename
<img src="/team-photo-2026.jpg" />

// Generic — doesn't convey what's in the image
<img src="/chart.png" alt="chart" />

// Redundant "image of"
<img src="/ceo.jpg" alt="Image of our CEO" />

// Alt text duplicates adjacent text
<h2>Revenue Growth</h2>
<img src="/revenue-chart.png" alt="Revenue Growth" />
```

**Correct (descriptive, functional alt text):**

```tsx
// Describes the content meaningfully
<img src="/team-photo-2026.jpg" alt="Engineering team at the 2026 offsite in Austin, 12 people standing in front of the office" />

// Conveys the data the chart shows
<img src="/chart.png" alt="Bar chart showing monthly active users growing from 10K in January to 85K in December 2025" />

// Describes the person and context
<img src="/ceo.jpg" alt="Jane Smith, CEO" />

// Adds information not in surrounding text
<h2>Revenue Growth</h2>
<img src="/revenue-chart.png" alt="Line chart: revenue grew from $2M in Q1 to $8M in Q4, with steepest growth in Q3" />
```

For complex images (charts, infographics), consider providing a detailed text alternative nearby in addition to concise alt text.

Reference: [WCAG 1.1.1 Non-text Content](https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html)
