---
title: Use next/link with Descriptive Link Text
impact: MEDIUM-HIGH
impactDescription: "Click here" and "Read more" links are meaningless when screen readers list all links
tags: nextjs, link, navigation, screen-reader, descriptive
wcag: "2.4.4 Level A"
---

## Use next/link with Descriptive Link Text

**Impact: MEDIUM-HIGH ("Click here" and "Read more" links are meaningless when screen readers list all links)**

Screen readers can list all links on a page. If every link says "Read more" or "Click here", the list is useless. Link text must describe the destination or purpose. `next/link` renders a standard `<a>` tag — the same rules apply.

**Incorrect (generic or ambiguous link text):**

```tsx
import Link from 'next/link'

// "Click here" — meaningless out of context
<p>To view our pricing, <Link href="/pricing">click here</Link>.</p>

// Every card has "Read more" — all identical in link lists
{posts.map((post) => (
  <div key={post.id}>
    <h3>{post.title}</h3>
    <p>{post.excerpt}</p>
    <Link href={`/blog/${post.slug}`}>Read more</Link>
  </div>
))}

// URL as link text
<Link href="/docs/api">https://example.com/docs/api</Link>
```

**Correct (descriptive link text):**

```tsx
import Link from 'next/link'

// Descriptive link text
<p>View our <Link href="/pricing">pricing plans</Link>.</p>

// Unique, descriptive link text per card
{posts.map((post) => (
  <article key={post.id}>
    <h3>
      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
    </h3>
    <p>{post.excerpt}</p>
  </article>
))}

// If "Read more" is required visually, add hidden context
{posts.map((post) => (
  <div key={post.id}>
    <h3>{post.title}</h3>
    <p>{post.excerpt}</p>
    <Link href={`/blog/${post.slug}`}>
      Read more<span className="sr-only"> about {post.title}</span>
    </Link>
  </div>
))}
```

When the visual design requires generic text like "Read more", append visually-hidden text with `sr-only` to make the link unique for screen reader users.

Reference: [WCAG 2.4.4 Link Purpose (In Context)](https://www.w3.org/WAI/WCAG22/Understanding/link-purpose-in-context.html)
