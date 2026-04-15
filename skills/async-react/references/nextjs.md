# Async React in Next.js

Coordination gotchas specific to Next.js. For the primitives themselves, see `SKILL.md` and `patterns.md`. For general Next.js APIs, see the [Next.js docs](https://nextjs.org/docs).

**Important:** The patterns below target Next.js 16. APIs change between versions — run Step 0 from the implementation workflow to verify your version's APIs before using anything here.

---

## Page Structure

Keep `page.tsx` non-async when possible. Push `await` calls into async server components inside `<Suspense>` so the static shell renders instantly and dynamic parts stream in.

See: [`cacheComponents`](https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheComponents), [`use cache`](https://nextjs.org/docs/app/api-reference/directives/use-cache), [`cacheTag`](https://nextjs.org/docs/app/api-reference/functions/cacheTag), [`cacheLife`](https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheLife)

---

## Invalidation After Mutations

**Every server action that mutates data must invalidate.** Without it, `useOptimistic` shows the instant result but the server never re-renders — the optimistic value settles to stale data.

The flow: user submits → `useOptimistic` shows instant result → server action runs → invalidation → optimistic value settles to real data.

Choose invalidation based on the app's caching strategy:

- **No `'use cache'`**: [`refresh()`](https://nextjs.org/docs/app/api-reference/functions/refresh) alone is sufficient.
- **With `'use cache'` + `cacheTag`**: [`updateTag()`](https://nextjs.org/docs/app/api-reference/functions/updateTag) — expires cache and ensures the next request sees fresh data immediately (read-your-own-writes).
- **Route Handlers / webhooks**: [`revalidateTag()`](https://nextjs.org/docs/app/api-reference/functions/revalidateTag) — `updateTag` is not available outside Server Actions.

```tsx
'use server';

import { refresh } from 'next/cache';

// No 'use cache' — refresh() re-renders server components
export async function toggleStar(taskId: string) {
  await db.star.toggle({ where: { taskId, userId } });
  refresh();
}
```

```tsx
'use server';

import { updateTag } from 'next/cache';

// With 'use cache' + cacheTag — updateTag() expires and re-fetches
export async function updatePost(slug: string, formData: FormData) {
  await db.post.update({ where: { slug }, data: { ... } });
  updateTag('posts');
  updateTag(`post-${slug}`);
}
```

**If you forget the invalidation call:** the optimistic update shows instantly, the mutation succeeds on the server, but the UI never updates with the real data. This is the most common bug when applying the skill.

---

## Shared Constants

[`"use server"`](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations) files can only export async functions. If the client needs to predict a server result (e.g., cycling enum values like `PRIORITY_CYCLE`), put the shared constant in a separate file and import from both.

---

## `router.push()` in Transitions

When called inside `startTransition`, [`router.push()`](https://nextjs.org/docs/app/api-reference/functions/use-router) coordinates with `useOptimistic` in the same transition — both commit together.

### Search params / filter navigation

A common pattern: update `searchParams` via `router.push()` and pass the callback as an action prop to a design component. The design component wraps it in `startTransition` with `useOptimistic`, so the chip/tab highlights instantly while the page re-renders with filtered data.

```tsx
// Consumer — passes router.push as an action prop
function LabelFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get("label") ?? null;

  function filterAction(value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("label", value);
    } else {
      params.delete("label");
    }
    router.push(`/?${params.toString()}`);
  }

  return <ChipGroup items={labels} value={current} changeAction={filterAction} />;
}
```

```tsx
// Design component — wraps action in transition with optimistic state
function ChipGroup({ items, value, changeAction }: ChipGroupProps) {
  const [optimisticValue, setOptimisticValue] = useOptimistic(value);

  function handleClick(newValue: string | null) {
    startTransition(async () => {
      setOptimisticValue(newValue);
      await changeAction(newValue);
    });
  }

  return /* chips using optimisticValue for active state */;
}
```

### Tab / index navigation

Same pattern for tab-like navigation — the action prop receives a URL, and the design component handles the optimistic index:

```tsx
startTransition(async () => {
  setOptimisticIndex(newIndex);
  await action(href); // action = (href) => router.push(href)
});
```

---

## Promise-Passing and Streaming

Server components can start a fetch without awaiting it, passing the **promise** as a prop to a client component. The client uses `use()` to unwrap it — the server renders instantly and data streams in via `<Suspense>`. The `.then()` pattern on `params` avoids making the page `async`:

```tsx
function TaskPage({ params }: { params: Promise<{ id: string }> }) {
  const taskPromise = params.then(({ id }) => getTask(id));
  const commentsPromise = commentsFromTask(taskPromise);

  return (
    <div>
      <Suspense fallback={<TaskSkeleton />}>
        <TaskDetail taskPromise={taskPromise} />
      </Suspense>
      <Suspense fallback={<CommentListSkeleton />}>
        <CommentList commentsPromise={commentsPromise} />
      </Suspense>
    </div>
  );
}
```

Each `<Suspense>` boundary streams independently — the task detail can appear before comments finish loading. Chaining promises (e.g., `commentsFromTask(taskPromise)`) lets you derive dependent data without `await`.

See: [Streaming guide](https://nextjs.org/docs/app/guides/streaming), [Suspense](https://nextjs.org/docs/app/guides/streaming#streaming-with-suspense), [Data fetching](https://nextjs.org/docs/app/building-your-application/data-fetching)

---

## Background Polling (Simple Approach)

For quick prototyping or low-frequency updates, `startTransition` + [`router.refresh()`](https://nextjs.org/docs/app/api-reference/functions/use-router) on an interval is a simple option. Prefer server-sent events, WebSockets, or a real-time data layer for production live data.

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

Because the refresh runs inside `startTransition`, it coordinates with `useOptimistic` — a mid-action refresh updates the base data without clobbering optimistic state.
