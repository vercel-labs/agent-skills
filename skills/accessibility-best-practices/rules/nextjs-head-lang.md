---
title: Set the html lang Attribute in Layout
impact: HIGH
impactDescription: Screen readers use lang to select the correct pronunciation engine
tags: nextjs, lang, language, screen-reader, internationalization
wcag: "3.1.1 Level A"
---

## Set the html lang Attribute in Layout

**Impact: HIGH (Screen readers use lang to select the correct pronunciation engine)**

The `lang` attribute on the `<html>` element tells screen readers which language to use for pronunciation. Without it, screen readers may use the wrong language engine, making content incomprehensible. In Next.js App Router, set this in the root layout.

**Incorrect (missing lang attribute):**

```tsx
// app/layout.tsx
export default function RootLayout({ children }) {
  return (
    // No lang attribute — screen reader guesses the language
    <html>
      <body>{children}</body>
    </html>
  )
}
```

**Correct (lang attribute set):**

```tsx
// app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

// For multilingual sites with next-intl or similar (Next.js 15+)
export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  return (
    <html lang={locale}>
      <body>{children}</body>
    </html>
  )
}
```

For content in a different language than the page language, use the `lang` attribute on the specific element:

```tsx
<html lang="en">
  <body>
    <p>Welcome to our site.</p>
    <p lang="es">Bienvenidos a nuestro sitio.</p>
  </body>
</html>
```

Reference: [WCAG 3.1.1 Language of Page](https://www.w3.org/WAI/WCAG22/Understanding/language-of-page.html)
