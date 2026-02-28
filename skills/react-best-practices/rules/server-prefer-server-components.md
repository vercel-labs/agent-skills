---
title: Default to Server Components
impact: HIGH
impactDescription: reduces client bundle size and improves Time to Interactive
tags: server, rsc, use-client, bundle-size, performance
---

## Default to Server Components

**Impact: HIGH (reduces client bundle size and improves Time to Interactive)**

In Next.js App Router, components are Server Components by default. Only add `'use client'` when the component needs state, effects, event handlers, or browser-only APIs. Unnecessary `'use client'` pulls the component and all its imports into the client bundle.

**Incorrect (unnecessary `'use client'` — no state, effects, or event handlers):**

```tsx
'use client'

import { formatDate } from '@/lib/utils'

export function ArticleCard({ title, date, summary }: ArticleCardProps) {
  return (
    <article>
      <h2>{title}</h2>
      <time>{formatDate(date)}</time>
      <p>{summary}</p>
    </article>
  )
}
```

**Correct (Server Component — same output, zero client JS):**

```tsx
import { formatDate } from '@/lib/utils'

export function ArticleCard({ title, date, summary }: ArticleCardProps) {
  return (
    <article>
      <h2>{title}</h2>
      <time>{formatDate(date)}</time>
      <p>{summary}</p>
    </article>
  )
}
```

**Incorrect (`'use client'` too high — heavy dependencies bundled for one input):**

```tsx
'use client'
// article-page.tsx
import { useState } from 'react'
import { HeavyMarkdownRenderer } from './markdown'
import { StaticFooter } from './footer'

export default function ArticlePage({ article }: { article: Article }) {
  const [search, setSearch] = useState('')
  return (
    <div>
      <input value={search} onChange={e => setSearch(e.target.value)} />
      {/* ❌ These don't need interactivity but are forced into the client bundle */}
      <HeavyMarkdownRenderer content={article.content} />
      <StaticFooter />
    </div>
  )
}
```

**Correct (push `'use client'` to the leaf — only SearchInput is client JS):**

```tsx
// article-page.tsx — Server Component
import { SearchInput } from './search-input'
import { HeavyMarkdownRenderer } from './markdown'
import { StaticFooter } from './footer'

export default function ArticlePage({ article }: { article: Article }) {
  return (
    <div>
      <SearchInput />
      <HeavyMarkdownRenderer content={article.content} />  {/* ✅ stays on server */}
      <StaticFooter />
    </div>
  )
}
```

```tsx
'use client'
// search-input.tsx — only this component is sent to the browser
import { useState } from 'react'

export function SearchInput() {
  const [search, setSearch] = useState('')
  return <input value={search} onChange={e => setSearch(e.target.value)} />
}
```

Reference: [Server and Client Components – Next.js Docs](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
