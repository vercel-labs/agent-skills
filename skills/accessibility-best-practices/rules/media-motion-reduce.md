---
title: Respect prefers-reduced-motion for Animations
impact: HIGH
impactDescription: Animations can cause nausea, seizures, and disorientation for vestibular disorder users
tags: media, motion, animation, vestibular, prefers-reduced-motion
wcag: "2.2.2 Level A, 2.3.3 Level AAA"
---

## Respect prefers-reduced-motion for Animations

**Impact: HIGH (Animations can cause nausea, seizures, and disorientation for vestibular disorder users)**

Users with vestibular disorders, migraines, or motion sensitivity can enable "Reduce Motion" in their OS settings. Your app must respect this preference by disabling or reducing non-essential animations. This affects CSS transitions, Framer Motion, and any JavaScript-driven animation.

**Incorrect (animations ignore user preference):**

```tsx
// CSS animation always plays regardless of preference
.hero {
  animation: slideIn 0.5s ease-out;
}

// Framer Motion ignores reduced-motion preference
function Card() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, type: 'spring' }}
    >
      Content
    </motion.div>
  )
}
```

**Correct (animations respect prefers-reduced-motion):**

```css
/* CSS: disable animation when reduced motion is preferred */
.hero {
  animation: slideIn 0.5s ease-out;
}

@media (prefers-reduced-motion: reduce) {
  .hero {
    animation: none;
  }
}

/* Or use a universal reduction */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

```tsx
// Framer Motion: use useReducedMotion hook
import { useReducedMotion, motion } from 'framer-motion'

function Card() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.6, type: 'spring' }}
    >
      Content
    </motion.div>
  )
}
```

Essential animations (progress indicators, loading spinners) can remain but should be simplified. Page transitions, parallax effects, and decorative animations should be fully disabled. Note: WCAG 2.2.2 (Pause, Stop, Hide) at Level A requires that auto-playing animations can be paused or stopped, making reduced-motion support an AA-compliance concern — not just a nice-to-have AAA enhancement.

Reference: [WCAG 2.2.2 Pause, Stop, Hide](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html), [WCAG 2.3.3 Animation from Interactions](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html)
