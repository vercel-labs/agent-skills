# Async React in Next.js

How `useOptimistic` and transitions coordinate with Next.js server actions, router, and caching. For the primitives themselves, see `SKILL.md` and `patterns.md`. For general Next.js APIs, see the [Next.js docs](https://nextjs.org/docs).

---

## Invalidation After Mutations

**Every server action that mutates data must invalidate.** Without it, `useOptimistic` shows the instant result but the server never re-renders — the optimistic value settles to stale data.

The flow: user submits → `useOptimistic` shows instant result → server action runs → invalidation → optimistic value settles to real data.

Choose your invalidation based on the app's caching strategy:

- **No `'use cache'`**: [`refresh()`](https://nextjs.org/docs/app/api-reference/functions/refresh) alone is sufficient.
- **With `'use cache'` + `cacheTag`**: [`updateTag(tag)`](https://nextjs.org/docs/app/api-reference/functions/updateTag) to expire cache, plus `refresh()` if the current page needs to re-render immediately.
- **Route Handlers / webhooks**: [`revalidateTag(tag, 'max')`](https://nextjs.org/docs/app/api-reference/functions/revalidateTag) — `updateTag` is not available outside Server Actions.

```tsx
'use server';

import { refresh, updateTag } from 'next/cache';

export async function toggleStar(taskId: string) {
  await db.star.toggle({ where: { taskId, userId } });
  refresh();
}

export async function updatePost(slug: string, formData: FormData) {
  await db.post.update({ where: { slug }, data: { ... } });
  updateTag('posts');
  updateTag(`post-${slug}`);
  refresh();
}
```

**If you forget the invalidation call:** the optimistic update shows instantly, the mutation succeeds on the server, but the UI never updates with the real data. This is the most common bug when applying the skill.

---

## `router.push()` in Transitions

When called inside a `startTransition`, `router.push()` coordinates with `useOptimistic` in the same transition — both commit together:

```tsx
startTransition(async () => {
  setOptimisticIndex(newIndex);
  await router.push(newUrl);
});
```

This is what makes action props work with Next.js navigation — the design component calls `startTransition`, sets optimistic state, and `await`s the `router.push()` passed via the action prop.

---

## Promise-Passing from Server Components

Server components can start a fetch without awaiting it, passing the **promise** as a prop to a client component. The client uses `use()` to unwrap it — enabling streaming without blocking the server render:

```tsx
async function ChartWrapper({ searchParams }: { searchParams: Promise<{ filter?: string }> }) {
  const { filter } = await searchParams;
  const dataPromise = getChartData(filter);
  return <Chart data={dataPromise} />;
}
```

The client component suspends (showing the nearest `<Suspense>` fallback) until the promise resolves.

---

## Background Polling

For live data (Q&A feeds, collaborative features), use `startTransition` + `router.refresh()` on an interval:

```tsx
'use client';

import { useRouter } from 'next/navigation';
import { startTransition, useEffect } from 'react';

export function usePolling(intervalMs = 5000) {
  const router = useRouter();

  useEffect(() => {
    const id = setInterval(() => {
      startTransition(() => router.refresh());
    }, intervalMs);
    return () => clearInterval(id);
  }, [router, intervalMs]);
}
```

Because the refresh runs inside `startTransition`, it coordinates with `useOptimistic` — a mid-action refresh updates the base data without clobbering optimistic state. If using a reducer, React re-runs it with the latest base value so optimistic additions sit on top of fresh data.
