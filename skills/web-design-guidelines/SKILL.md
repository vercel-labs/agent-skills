---
name: web-design-guidelines
description: Web design and accessibility guidelines for modern web applications. Use when creating, reviewing, or refactoring UI components to ensure best practices for styling, animations, accessibility, and color contrast.
metadata:
  author: vercel
  version: "1.0.0"
---

# Web Design Guidelines

Comprehensive web design and accessibility guide for modern web applications. Contains 4 rules covering styling, animations, accessibility, and color contrast to ensure high-quality user experiences.

## When to Apply

Reference these guidelines when:
- Creating new UI components or pages
- Reviewing code for design and accessibility issues
- Refactoring existing components for better UX
- Implementing animations and transitions
- Ensuring proper color contrast and accessibility
- Choosing between styling approaches

## Rule Categories by Priority

| Priority | Category | Impact | Prefix |
|----------|----------|--------|--------|
| 0 | Styling | HIGH | `styling-` |
| 1 | Accessibility | CRITICAL | `accessibility-` |
| 4 | Color | MEDIUM-HIGH | `color-` |
| 8 | Animation & Motion | LOW-MEDIUM | `animation-` |

## Quick Reference

### 0. Styling (HIGH)

- `styling-prefer-tailwind` - Use Tailwind CSS utility classes over custom CSS

### 1. Accessibility (CRITICAL)

- `accessibility-alt-text` - Provide descriptive alt text for all images

### 4. Color (MEDIUM-HIGH)

- `color-contrast` - Ensure WCAG AA contrast ratios (4.5:1 for text, 3:1 for UI)

### 8. Animation & Motion (LOW-MEDIUM)

- `animation-framer-motion-or-css` - Use Framer Motion for complex animations, CSS for simple ones

## How to Use

Read individual rule files for detailed explanations and code examples:

```
rules/accessibility-alt-text.md
rules/animation-framer-motion-or-css.md
rules/color-contrast.md
rules/styling-prefer-tailwind.md
```

Each rule file contains:
- Brief explanation of why it matters
- Incorrect code example with explanation
- Correct code examples with framework-specific alternatives
- Additional context and references

## Full Compiled Document

For the complete guide with all rules expanded: `AGENTS.md`
