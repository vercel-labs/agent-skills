# Async React in Next.js

Coordination gotchas specific to Next.js. For the primitives themselves, see `SKILL.md` and `patterns.md`. For general Next.js APIs, see the [Next.js docs](https://nextjs.org/docs).

**Important:** The patterns below target Next.js 16. APIs change between versions — run Step 0 from the implementation workflow to verify your version's APIs before using anything here.

---

## Page Structure

Keep `page.tsx` non-async when possible. Push `await` calls into async server components inside `<Suspense>` so the static shell renders instantly and dynamic parts stream in.

```tsx
// ✅ Shell renders instantly, Board streams in
export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ label?: string }>;
}) {
  const { label } = await searchParams;

  return (
    <div>
      <Header />
      <Suspense fallback={<BoardSkeleton />}>
        <Board label={label} />
      </Suspense>
    </div>
  );
}
```

The `await searchParams` is lightweight — the expensive work is inside `<Board>` (an async server component), which streams in independently via `<Suspense>`.

See: [`cacheComponents`](https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheComponents), [`use cache`](https://nextjs.org/docs/app/api-reference/directives/use-cache), [`cacheTag`](https://nextjs.org/docs/app/api-reference/functions/cacheTag), [`cacheLife`](https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheLife)

---

## Invalidation After Mutations

**Server actions that mutate data must invalidate.** Without it, `useOptimistic` shows the instant result but the server never re-renders — the optimistic value settles to stale data.

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

## Push Dynamic Hooks Into Leaf Components

Hooks like `useSearchParams()`, `usePathname()`, and `useRouter()` make their component dynamic. When used in a layout or page, the entire subtree becomes dynamic and cannot be statically prerendered — the layout shell won't appear until the dynamic data is ready. Push these hooks into the smallest possible child component and wrap in `<Suspense>`.

**With `cacheComponents: true`, this is enforced as a hard error:** placing a component that uses `useSearchParams()` outside `<Suspense>` throws `Uncached data was accessed outside of <Suspense>`. Without `cacheComponents`, the same pattern silently degrades performance.

**Incorrect (entire layout is dynamic):**

```tsx
'use client'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') ?? ''

  return (
    <div>
      <nav>Dashboard</nav>
      <SearchInput defaultValue={query} />
      {children}
    </div>
  )
}
```

**Correct (layout is a server component, hooks isolated in leaf components):**

```tsx
// layout.tsx — server component, statically prerenderable
export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <nav>Dashboard</nav>
      <Suspense>
        <SearchInput />
      </Suspense>
      {children}
    </div>
  )
}
```

```tsx
// search-input.tsx — client component with the dynamic hook
'use client'

export function SearchInput() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') ?? ''
  return <input defaultValue={query} ... />
}
```

This applies to `useSearchParams()`, `usePathname()`, `useRouter()`, `cookies()`, `headers()`, and `await params`/`await searchParams`.

---

## `router.push()` in Transitions

When called inside `startTransition`, [`router.push()`](https://nextjs.org/docs/app/api-reference/functions/use-router) coordinates with `useOptimistic` in the same transition — both commit together.

### Search params / filter navigation

A common pattern: update `searchParams` via `router.push()` and pass the callback as an action prop to a design component. The design component wraps it in `startTransition` with `useOptimistic`, so the chip/tab highlights instantly while the page re-renders with filtered data.

```tsx
// Consumer — passes router.push as an action prop
// Note: useSearchParams() makes this component dynamic.
// Wrap <LabelFilter /> in <Suspense> at the call site (see Push Dynamic Hooks above).
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

  return <ChipGroup items={labels} value={current} action={filterAction} />;
}

// Call site — wrap in Suspense because LabelFilter uses useSearchParams()
<Suspense>
  <LabelFilter />
</Suspense>
```

```tsx
// Design component — wraps action in transition with optimistic state
function ChipGroup({ items, value, action }: ChipGroupProps) {
  const [optimisticValue, setOptimisticValue] = useOptimistic(value);

  function handleClick(newValue: string | null) {
    startTransition(async () => {
      setOptimisticValue(newValue);
      await action(newValue);
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

Server components can start a fetch without awaiting it, passing the **promise** as a prop to a child component inside `<Suspense>`. The child awaits it — the page shell renders instantly and dynamic parts stream in. The `.then()` pattern on `params` avoids making the page `async`:

**Prerequisite:** This pattern requires `cacheComponents: true` in `next.config.ts` (see [Page Structure](#page-structure)).

```tsx
function TaskPage({ params }: { params: Promise<{ id: string }> }) {
  const taskPromise = params.then(({ id }) => getTask(id));
  const commentsPromise = params.then(({ id }) => getComments(id));

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

Each `<Suspense>` boundary streams independently — the task detail can appear before comments finish loading. Chain `.then()` calls to derive dependent data without `await`.

See: [Streaming guide](https://nextjs.org/docs/app/guides/streaming), [Suspense](https://nextjs.org/docs/app/guides/streaming#streaming-with-suspense), [Data fetching](https://nextjs.org/docs/app/building-your-application/data-fetching)

---

## Link Pending Indicators (useLinkStatus)

[`useLinkStatus`](https://nextjs.org/docs/app/api-reference/functions/use-link-status) is a Next.js hook that reads the pending state of a parent `<Link>`. Use it inside a child of `next/link` to show per-link loading indicators during navigation — useful for pagination, nav items, or any list of links where the user needs to know which one is loading.

```tsx
'use client';

import Link from 'next/link';
import { useLinkStatus } from 'next/link';

function PageLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href}>
      <PageLinkContent>{children}</PageLinkContent>
    </Link>
  );
}

function PageLinkContent({ children }: { children: React.ReactNode }) {
  const { pending } = useLinkStatus();

  return (
    <span className={pending ? 'opacity-50' : ''}>
      {children}
      {pending && <Spinner className="ml-1 inline w-3 h-3" />}
    </span>
  );
}
```

**Key rules:**

- `useLinkStatus` must be called in a **child** component of `<Link>`, not in the same component that renders the `<Link>`.
- It reads the pending state of the parent link's navigation transition, not the page's transition.
- Works well alongside `useTransition` for filter/tab navigation — use `useLinkStatus` for per-link indicators, `useTransition` for page-level pending state.

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

    const onFocus = () => {
      startTransition(() => router.refresh());
    };
    window.addEventListener('focus', onFocus);

    return () => {
      clearInterval(id);
      window.removeEventListener('focus', onFocus);
    };
  }, [router, intervalMs]);
}
```

The focus listener ensures fresh data when the user returns to the tab. Because the refresh runs inside `startTransition`, it coordinates with `useOptimistic` — a mid-action refresh updates the base data without clobbering optimistic state.

---

## Common Next.js Pitfalls

These are framework-specific mistakes. For general React coordination mistakes, see `common-mistakes.md`.

- **Making `page.tsx` async for expensive data** — `async` pages block the entire shell until all `await` calls complete. Keep `page.tsx` non-async when possible: use `.then()` on `params`/`searchParams`, pass promises to child server components inside `<Suspense>`. See [Page Structure](#page-structure).
- **Missing `cacheComponents: true` in `next.config.ts`** (Next.js 16) — Without it, combining `<Suspense>` with dynamic data can throw `React.unstable_postpone is not defined` or silently disable streaming. Enable it before any other work.
- **Exporting constants from `"use server"` files** — Only async functions can be exported. Shared constants must live in a separate file. See [Shared Constants](#shared-constants).
- **Dynamic hooks in layouts** — `useSearchParams()`, `usePathname()`, `useRouter()` make their component dynamic. When used in a layout, the entire subtree becomes dynamic. Push these hooks into the smallest possible child component and wrap in `<Suspense>`. See [Push Dynamic Hooks](#push-dynamic-hooks-into-leaf-components).
