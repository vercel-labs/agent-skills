---
title: Leverage the Next.js Route Announcer
impact: MEDIUM
impactDescription: Next.js automatically announces route changes — ensure page titles are set for it to work
tags: nextjs, routing, announcer, screen-reader, navigation
wcag: "2.4.2 Level A"
---

## Leverage the Next.js Route Announcer

**Impact: MEDIUM (Next.js automatically announces route changes — ensure page titles are set for it to work)**

Next.js includes a built-in route announcer that reads the new page title to screen readers after client-side navigation. This works automatically — but only if every page has a unique, descriptive `<title>`. Without proper titles, the announcer has nothing meaningful to say.

**Incorrect (route announcer has nothing useful to announce):**

```tsx
// app/about/page.tsx — no metadata, no title
export default function AboutPage() {
  return <div>About us content...</div>
}

// app/contact/page.tsx — same generic title as every other page
export const metadata = {
  title: 'My App',
}
```

**Correct (unique titles for each route):**

```tsx
// app/about/page.tsx
export const metadata = {
  title: 'About Us',
}
export default function AboutPage() {
  return <div>About us content...</div>
}

// app/contact/page.tsx
export const metadata = {
  title: 'Contact',
}
export default function ContactPage() {
  return <div>Contact form...</div>
}

// app/layout.tsx — template ensures consistent format
export const metadata = {
  title: {
    template: '%s | My App',
    default: 'My App',
  },
}
```

In the App Router, Next.js uses an `aria-live="assertive"` region that announces the `document.title` after client-side navigation. This is built into Next.js and requires no additional code — just set proper titles via the metadata API.

Reference: [Next.js Accessibility](https://nextjs.org/docs/architecture/accessibility)
