---
name: accessibility-best-practices
description: Comprehensive accessibility (a11y) guidelines for React and Next.js applications. Use when writing, reviewing, or refactoring UI components to ensure WCAG 2.2 compliance, screen reader support, keyboard navigation, and inclusive design. Triggers on tasks involving components, forms, modals, navigation, images, or any user-facing UI.
license: MIT
metadata:
  author: Shain Noor
  version: "1.0.0"
---

# Accessibility Best Practices for React & Next.js

Comprehensive accessibility (a11y) guide for building inclusive React and Next.js applications that conform to WCAG 2.2 AA standards. Contains 48 rules across 10 categories, prioritized by impact to guide automated code generation, review, and refactoring.

## When to Apply

Reference these guidelines when:
- Generating or modifying any user-facing React or Next.js component
- Implementing forms, modals, navigation menus, or custom interactive widgets
- Auditing existing code for WCAG 2.2 AA compliance
- Adding or updating images, video, SVGs, or other media
- Managing focus across route changes, overlays, or dynamic UI
- Integrating accessibility testing into CI or development workflows

## Rule Categories by Priority

| Priority | Category | Impact | Prefix |
|----------|----------|--------|--------|
| 1 | Semantic HTML | CRITICAL | `semantic-` |
| 2 | Keyboard Navigation | CRITICAL | `keyboard-` |
| 3 | ARIA Attributes | HIGH | `aria-` |
| 4 | Forms & Inputs | HIGH | `form-` |
| 5 | Images & Media | MEDIUM-HIGH | `media-` |
| 6 | Color & Contrast | MEDIUM-HIGH | `color-` |
| 7 | Focus Management | MEDIUM | `focus-` |
| 8 | Rendering & Layout | MEDIUM | `rendering-` |
| 9 | Dynamic Content & Live Regions | MEDIUM | `dynamic-` |
| 10 | Next.js Specific Patterns | MEDIUM | `nextjs-` |
| 11 | Testing & Validation | LOW-MEDIUM | `testing-` |

## Quick Reference

### 1. Semantic HTML (CRITICAL)

- `semantic-landmarks` - Use landmark elements (main, nav, header, footer)
- `semantic-headings` - Maintain proper heading hierarchy (h1-h6)
- `semantic-lists` - Use ul/ol/dl for list content, not divs
- `semantic-buttons-links` - Use button for actions, a for navigation
- `semantic-tables` - Use proper table markup with th, caption, scope

### 2. Keyboard Navigation (CRITICAL)

- `keyboard-interactive-elements` - All interactive elements must be keyboard accessible
- `keyboard-tab-order` - Maintain logical tab order, avoid positive tabIndex
- `keyboard-shortcuts` - Provide keyboard shortcuts for common actions
- `keyboard-skip-links` - Add skip navigation links
- `keyboard-trap-prevention` - Never trap keyboard focus
- `keyboard-touch-targets` - Ensure minimum touch and click target sizes

### 3. ARIA Attributes (HIGH)

- `aria-no-redundant` - Don't add ARIA roles that duplicate native semantics
- `aria-labels` - Provide accessible names for all interactive elements
- `aria-expanded-controls` - Use aria-expanded and aria-controls for toggles
- `aria-hidden-decorative` - Hide decorative elements from assistive tech
- `aria-live-regions` - Use aria-live for dynamic content updates

### 4. Forms & Inputs (HIGH)

- `form-labels` - Every input must have an associated label
- `form-error-messages` - Associate error messages with aria-describedby
- `form-fieldset-legend` - Group related inputs with fieldset and legend
- `form-autocomplete` - Use autocomplete attributes for common fields
- `form-validation` - Provide accessible inline validation feedback

### 5. Images & Media (MEDIUM-HIGH)

- `media-alt-text` - Provide descriptive alt text for meaningful images
- `media-decorative` - Use empty alt="" for decorative images
- `media-captions` - Provide captions and transcripts for video/audio
- `media-svg-accessible` - Make SVGs accessible with role and title
- `media-motion-reduce` - Respect prefers-reduced-motion for animations

### 6. Color & Contrast (MEDIUM-HIGH)

- `color-contrast-ratio` - Meet WCAG AA contrast ratios (4.5:1 text, 3:1 large)
- `color-not-sole-indicator` - Never use color alone to convey information
- `color-forced-colors` - Support forced-colors/high-contrast mode
- `color-focus-visible` - Ensure visible focus indicators meet contrast

### 7. Focus Management (MEDIUM)

- `focus-modal-trap` - Trap and restore focus in modals/dialogs
- `focus-route-change` - Manage focus on client-side route changes
- `focus-visible-styles` - Style :focus-visible, never remove outlines
- `focus-inert` - Use inert attribute to disable background content

### 8. Rendering & Layout (MEDIUM)

- `rendering-zoom-reflow` - Support content reflow at 400% zoom without horizontal scroll

### 9. Dynamic Content & Live Regions (MEDIUM)

- `dynamic-announcements` - Announce dynamic changes to screen readers
- `dynamic-loading-states` - Communicate loading states accessibly
- `dynamic-toast-notifications` - Make toast/snackbar notifications accessible
- `dynamic-infinite-scroll` - Provide accessible alternatives to infinite scroll

### 10. Next.js Specific Patterns (MEDIUM)

- `nextjs-metadata` - Use metadata API for accessible page titles
- `nextjs-image` - Use next/image with proper alt text
- `nextjs-link` - Use next/link with descriptive text
- `nextjs-route-announcer` - Leverage Next.js route announcer
- `nextjs-head-lang` - Set html lang attribute in layout

### 11. Testing & Validation (LOW-MEDIUM)

- `testing-axe-integration` - Integrate axe-core in development and CI
- `testing-keyboard-testing` - Include keyboard navigation in test suites
- `testing-screen-reader` - Test with real screen readers (VoiceOver, NVDA)
- `testing-eslint-a11y` - Use eslint-plugin-jsx-a11y for static analysis

## How to Use

Read individual rule files for detailed explanations and code examples:

```
rules/semantic-landmarks.md
rules/keyboard-interactive-elements.md
rules/form-labels.md
```

Each rule file contains:
- Brief explanation of why it matters
- Incorrect code example with explanation
- Correct code example with explanation
- Additional context and references

## Full Compiled Document

For the complete guide with all rules expanded: `AGENTS.md`
