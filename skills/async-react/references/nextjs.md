# Async React in Next.js

How the App Router integrates with React's async coordination primitives. Only Next.js-specific details — for the primitives themselves, see `SKILL.md` and `patterns.md`.

---

## Server Actions + Cache Invalidation

Server actions are the mutation layer. They run on the server and integrate with the transition system via form `action` or `startTransition` on the client.

**Every server action that mutates data must invalidate.** Without invalidation, `useOptimistic` shows the instant result but the server never re-renders — so the optimistic value settles to stale data, and navigating away and back shows old state.

Three invalidation functions (all from `next/cache`):

- **`updateTag(tag)`** — Immediately expires cached data for a tag. **Server Actions only.** Designed for read-your-own-writes — the user sees fresh data on the next render, not stale content. This is the primary invalidation method when using `'use cache'` + `cacheTag`.
- **`revalidateTag(tag, 'max')`** — Marks tagged data as stale with stale-while-revalidate semantics (serves cached content while fetching fresh in the background). Works in Server Actions **and** Route Handlers. The single-argument form `revalidateTag(tag)` is deprecated — always pass a profile.
- **`refresh()`** — Refreshes the client router, causing server components to re-render for the current user. Does **not** revalidate tagged cache entries — use alongside `updateTag` or `revalidateTag` when you have cache tags.

**Which to use:**

- **Apps without `'use cache'`**: `refresh()` alone is sufficient — server components re-render with fresh data.
- **Apps with `'use cache'` + `cacheTag`**: Use `updateTag(tag)` to invalidate cached entries. Add `refresh()` if the current page also needs to re-render immediately.
- **Route Handlers / webhooks**: Use `revalidateTag(tag, 'max')` — `updateTag` is not available outside Server Actions.

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

`updateTag` immediately expires the cached query entries; `refresh()` forces the current user's page to re-render. Both together ensure optimistic updates settle to fresh data.

### The Flow

User submits → `useOptimistic` shows instant result → server action runs → `updateTag()` expires cache + `refresh()` re-renders → optimistic value settles to real data.

**If you forget the invalidation call:** the optimistic update shows instantly, the mutation succeeds on the server, but the UI never updates with the real data. This is the most common bug when applying the skill.

### Return Errors, Don't Throw

For expected failures (validation, auth), return error info. Unexpected errors should throw and bubble to the nearest `error.tsx` boundary:

```tsx
export async function addComment(slug: string, formData: FormData): Promise<ActionResult> {
  const parsed = schema.safeParse({ content: formData.get('content') });
  if (!parsed.success) return { error: parsed.error.issues[0].message, success: false };

  await db.comment.create({ data: { content: parsed.data.content, eventSlug: slug } });
  updateTag(`comments-${slug}`);
  return { success: true };
}
```

---

## Keeping Pages Non-Async (Static Shell)

To maximize the static shell with `cacheComponents`, pages should be **non-async**. Dynamic data access (`searchParams`, `params`, uncached fetches) must happen inside async server components wrapped in `<Suspense>`.

`searchParams` and `params` are promises in Next.js 16. Pass them as props into async components inside Suspense instead of awaiting them at the page level:

```tsx
// ✅ Non-async page — static shell renders instantly
export default function Page({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  return (
    <div>
      <Header />
      <Suspense fallback={<ResultsSkeleton />}>
        <Results searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function Results({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const data = await fetchResults(q);
  return <ResultsList data={data} />;
}
```

Client components using `useSearchParams()` are also dynamic — wrap them in `<Suspense>`:

```tsx
<Suspense>
  <FilterBar />  {/* uses useSearchParams() internally */}
</Suspense>
```

---

## Router Behavior

### Navigation = Transition

The App Router wraps every `<Link>` navigation in `startTransition`. This means:
- Old page stays visible and interactive while the new page loads
- `<Suspense>` boundaries on the destination page resolve independently

For animating these navigation transitions (cross-fade, slide, shared elements), see the `vercel-react-view-transitions` skill.

### `router.push()` in Transitions

When called inside a `startTransition`, it coordinates with `useOptimistic` in the same transition:

```tsx
startTransition(async () => {
  setOptimisticIndex(newIndex);
  await router.push(newUrl);
});
// Both commit together
```

This is what makes action props work with Next.js navigation — the design component calls `startTransition`, sets optimistic state, and `await`s the `router.push()` passed via the action prop.

---

## Promise-Passing from Server Components

Server components can start a fetch without awaiting it, passing the **promise** as a prop to a client component. The client uses `use()` (see Core Concepts in `SKILL.md`) to unwrap it — enabling streaming without blocking the server render:

```tsx
// Server component — starts fetch, doesn't await
async function ChartWrapper({ searchParams }: { searchParams: Promise<{ filter?: string }> }) {
  const { filter } = await searchParams;
  const dataPromise = getChartData(filter);
  return <Chart data={dataPromise} />;
}
```

The server component renders immediately and streams the promise to the client. The client component suspends (showing the nearest `<Suspense>` fallback) until the promise resolves. This is useful when:

- The client component needs the raw data for interactivity (charts, drag-and-drop)
- Multiple client components share the same promise (start one fetch, pass to siblings)

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

---

## Error Boundaries

Next.js `error.tsx` files create error boundaries. Errors thrown inside transitions — including server action failures — automatically bubble to the nearest `error.tsx`. Use toast for expected errors to prevent the boundary from catching them.
