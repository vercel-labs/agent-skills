## Provide Alt Text for Images

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

Reference: [WCAG 1.1.1](https://www.w3.org/WAI/WCAG21/Understanding/non-text-content.html)
