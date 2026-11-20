---
title: Use Granular Cache Revalidation After Mutations
impact: HIGH
impactDescription: prevents stale data without over-invalidating cache
tags: server, server-actions, revalidation, cache, mutations
---

## Use Granular Cache Revalidation After Mutations

**Impact: HIGH (prevents stale data without over-invalidating cache)**

After a Server Action mutates data, choose the most specific revalidation strategy. Using `revalidatePath('/')` or no revalidation at all are the two most common bugs in Next.js apps.

**Incorrect (invalidates entire cache):**

```tsx
'use server'

import { revalidatePath } from 'next/cache'

export async function updatePost(id: string, data: FormData) {
  await db.post.update({ where: { id }, data: { title: data.get('title') } })

  // Blows away ALL cached data across the entire app
  revalidatePath('/')
}
```

**Correct (invalidates only affected data):**

```tsx
'use server'

import { revalidateTag } from 'next/cache'

export async function updatePost(id: string, data: FormData) {
  await db.post.update({ where: { id }, data: { title: data.get('title') } })

  // Only invalidates fetches tagged with this post
  revalidateTag(`post-${id}`)
}
```

Tag your fetches so revalidation is precise:

```tsx
// In a Server Component or data layer
const post = await fetch(`https://api.example.com/posts/${id}`, {
  next: { tags: [`post-${id}`, 'posts'] }
})
```

**Choosing the right strategy:**

| Strategy | Use when | Precision |
|----------|----------|-----------|
| `revalidateTag(tag)` | You tagged your fetch calls | High - only matching fetches |
| `revalidatePath('/posts/[id]')` | Specific page needs fresh data | Medium - all data on that route |
| `revalidatePath('/posts', 'layout')` | Section of the app changed | Low - entire layout subtree |
| `redirect('/posts')` | User should navigate after mutation | N/A - new page fetches fresh |

**Common mistake:** Forgetting to revalidate at all. The mutation succeeds on the server, but the user still sees stale cached data until they hard-refresh.

Reference: [Next.js revalidateTag](https://nextjs.org/docs/app/api-reference/functions/revalidateTag)
