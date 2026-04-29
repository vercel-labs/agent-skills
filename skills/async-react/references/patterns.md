# Async React Patterns

Code reference for each primitive. See `implementation.md` for the step-by-step workflow. For framework-specific integration (invalidation APIs, router behavior), see `nextjs.md`.

---

## Suspense Boundaries

### Basic

```tsx
import { Suspense } from 'react';

export default function Page() {
  return (
    <div>
      <Header />
      <Suspense fallback={<GridSkeleton />}>
        <DataGrid />
      </Suspense>
    </div>
  );
}
```

### Skeleton Co-location

Export skeleton components from the same file as their component:

```tsx
export async function DataGrid() {
  const data = await fetchData();
  return <div className="grid">{data.map(item => <Card key={item.id} item={item} />)}</div>;
}

export function DataGridSkeleton() {
  return (
    <div className="grid">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="animate-pulse rounded-md bg-black/15 dark:bg-white/15 h-32" />
      ))}
    </div>
  );
}
```

### Boundary Structure

Sibling boundaries stream in parallel — each resolves independently:

```tsx
<Suspense fallback={<ProfileSkeleton />}>
  <UserProfile userId={id} />
</Suspense>
<Suspense fallback={<PostsSkeleton />}>
  <UserPosts userId={id} />
</Suspense>
```

Use siblings when components have independent data **and predictable sizes**. If a component above has an unknown height, siblings below it cause layout shift (CLS) when it resolves. In that case, wrap both in a single boundary:

```tsx
<Suspense fallback={<PageSkeleton />}>
  <VariableHeightHeader slug={slug} />
  <ContentFeed slug={slug} />
</Suspense>
```

Choose the boundary structure that produces the best loading state for the page — there's no single rule.

### Fallback Quality

Fallbacks should match the content's layout to prevent layout shift. Use skeletons for data, static markup for interactive controls (tabs, filters), and omit `fallback` only when the child renders nothing (side-effect components, conditional guards).

---

## Action Props (Design Components)

### TabList — Full Implementation

Support both `action` and `onChange`. The action prop accepts `void | Promise<void>`, so consumers don't need their own `startTransition`:

```tsx
'use client';

import { startTransition, useOptimistic } from 'react';

type TabListProps = {
  tabs: { label: string; value: string }[];
  activeTab: string;
  action?: (value: string) => void | Promise<void>;
  onChange?: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

export function TabList({ tabs, activeTab, action, onChange }: TabListProps) {
  const [optimisticTab, setOptimisticTab] = useOptimistic(activeTab);

  function handleTabChange(e: React.MouseEvent<HTMLButtonElement>, value: string) {
    onChange?.(e);
    startTransition(async () => {
      setOptimisticTab(value);
      await action?.(value);
    });
  }

  return (
    <div>
      {tabs.map(tab => (
        <button
          key={tab.value}
          onClick={e => handleTabChange(e, tab.value)}
          className={tab.value === optimisticTab ? 'active' : ''}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
```

The design component handles the optimistic switch and transition internally. `onChange` fires synchronously before the transition starts — useful for validation or `event.preventDefault()`. For animating the tab switch itself, see the `vercel-react-view-transitions` skill.

**Pending feedback tradeoff:** This example omits `data-pending` and a built-in spinner, leaving pending feedback to the consumer (see Consumer-Driven Pending UI below). Alternatively, the design component can include a built-in spinner and set `data-pending` on its root — this is simpler for consumers but less flexible. Derive `isPending` from `optimisticTab !== activeTab` to avoid a separate `useTransition`.

### Consumer Usage

```tsx
// Before — freezes until navigation completes
<TabList tabs={tabs} activeTab={current} onChange={() => navigate(value)} />

// After — tab highlights instantly, old content stays visible during async work
<TabList tabs={tabs} activeTab={current} action={value => navigate(value)} />
```

### Consumer-Driven Pending UI (data-pending)

When the consumer wants pending feedback on surrounding content (e.g., fading a list while filtering), they add their own `useTransition` and `data-pending` wrapper:

```tsx
function FilteredView() {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="group" data-pending={isPending ? '' : undefined}>
      <TabList
        tabs={tabs}
        activeTab={current}
        action={value => {
          startTransition(() => {
            navigate(value);
          });
        }}
      />
      <div className="group-has-[[data-pending]]:opacity-50 transition-opacity">
        <ContentGrid />
      </div>
    </div>
  );
}
```

The optimistic tab switch still happens inside `TabList`. The consumer's `isPending` drives `data-pending` on a wrapper, and descendants use `group-has-[[data-pending]]:` to style themselves.

### EditableText — displayValue Pattern

For components where the display format differs from the raw value, accept a `displayValue` prop as either a static `ReactNode` or a function that receives the optimistic value:

```tsx
type EditableTextProps = {
  value: string;
  displayValue?: ((value: string) => React.ReactNode) | React.ReactNode;
  onChange?: (e: React.SyntheticEvent) => void;
  action: (value: string) => void | Promise<void>;
};

export function EditableText({ value, displayValue, action, onChange }: EditableTextProps) {
  const [isPending, startTransition] = useTransition();
  const [optimisticValue, setOptimisticValue] = useOptimistic(value);
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  function handleCommit(e: React.SyntheticEvent) {
    setIsEditing(false);
    if (draft === optimisticValue) return;
    onChange?.(e);
    startTransition(async () => {
      setOptimisticValue(draft);
      await action(draft);
    });
  }

  const resolvedDisplay = optimisticValue
    ? typeof displayValue === 'function'
      ? displayValue(optimisticValue)
      : (displayValue ?? optimisticValue)
    : null;

  // ... render editing input or display button with resolvedDisplay
}
```

Consumer usage:

```tsx
<EditableText
  value={price}
  action={savePrice}
  displayValue={value => formatCurrency(Number(value))}
/>
```

The formatted display updates instantly on commit because the function receives the optimistic value.

### SubmitButton — formAction with Pending Indicator

A reusable submit button that wraps any form's submission in a transition with pending state. Uses `formAction` on the button instead of `action` on the form — this auto-wraps in a transition (like form `action`) and passes `FormData`:

```tsx
'use client';

import { useOptimistic } from 'react';

type SubmitButtonProps = React.ComponentProps<'button'> & {
  action: (formData: FormData) => void | Promise<void>;
  onSubmit?: (formData: FormData) => void;
};

export function SubmitButton({ children, action, onSubmit, disabled, ...props }: SubmitButtonProps) {
  const [isPending, setIsPending] = useOptimistic(false);

  async function submitAction(formData: FormData) {
    onSubmit?.(formData);
    setIsPending(true);
    await action(formData);
  }

  return (
    <button type="submit" formAction={submitAction} disabled={isPending || disabled} {...props}>
      {isPending ? 'Submitting...' : children}
    </button>
  );
}
```

**Why `formAction` on the button instead of `action` on the form:** The consumer keeps a plain `<form>` and drops in `<SubmitButton>` — the button's `formAction` overrides the form's `action`. This makes the design component composable: the consumer controls the form, the button handles pending state. No `startTransition` needed — `formAction` wraps in a transition automatically.

**`onSubmit` callback:** Fires synchronously before the transition starts — useful for immediate side effects like clearing an input or closing a dropdown (same role as `onChange` on action-prop design components).

### SubmitButton — useFormStatus Alternative

`useFormStatus` reads the pending state of a parent `<form>`. It's a child-component pattern — the button must be a child of a `<form>` with an `action` prop:

```tsx
'use client';

import { useFormStatus } from 'react-dom';

export function SubmitButton({ children, disabled, ...props }: React.ComponentProps<'button'>) {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending || disabled} {...props}>
      {pending ? 'Submitting...' : children}
    </button>
  );
}
```

**`useFormStatus` vs `useOptimistic(false)` vs `formAction`:**

| Pattern | Where pending lives | Works with |
|---------|-------------------|------------|
| `useFormStatus` | Reads parent form's pending state | Must be child of `<form action={...}>` |
| `useOptimistic(false)` | Self-contained in the button | Any form, `formAction` on button |
| `formAction` on button | Button overrides form's action | Composable — consumer keeps plain `<form>` |

All three work — choose based on your component structure. See the [useFormStatus docs](https://react.dev/reference/react-dom/hooks/useFormStatus) for details.

---

## Optimistic Mutations

### Toggle (Boolean)

```tsx
'use client';

import { useOptimistic } from 'react';

export function LikeButton({ isLiked, toggleAction }) {
  const [optimistic, setOptimistic] = useOptimistic(isLiked);

  return (
    <form action={async () => {
      setOptimistic(!optimistic);
      try {
        await toggleAction();
      } catch (e) {
        toast.error('Failed to update — please try again');
      }
    }}>
      <button type="submit">
        {optimistic ? '❤️' : '🤍'}
      </button>
    </form>
  );
}
```

No `startTransition` needed — form `action` already wraps in a transition. The setter is called inside an Action prop. The `try/catch` here handles an **expected** failure (e.g., rate limit, permission denied) with inline feedback. For **unexpected** errors, skip the `try/catch` and use `useTransition`'s `startTransition` instead of form `action` — errors bubble to the nearest error boundary (`error.tsx`). Don't add blanket `try/catch` to mutations.

**Alternative — updater function** for robustness against rapid double-taps:

```tsx
const [optimistic, setOptimistic] = useOptimistic(isLiked);

<form action={async () => {
  setOptimistic(current => !current);
  await toggleAction();
}}>
```

The updater function computes from the latest optimistic state, so rapid double-taps toggle correctly instead of reading a stale closure value. Both approaches work for typical single-tap toggles — use the updater form when rapid interactions are expected.

### Updater Function (Cycle / Relative)

When computing the next value from the current value, use an updater function instead of reading from the optimistic variable. This prevents stale closures when rapid interactions queue multiple transitions:

```tsx
'use client';

import { useOptimistic } from 'react';
import { PRIORITY_CYCLE } from '../lib/data';

export function PriorityButton({ taskId, priority }) {
  const [optimisticPriority, setOptimisticPriority] = useOptimistic(priority);

  return (
    <form action={async () => {
      // ✅ Updater — computes from latest optimistic state
      setOptimisticPriority(current => PRIORITY_CYCLE[current]);
      await cyclePriority(taskId);
    }}>
      <button type="submit">{optimisticPriority}</button>
    </form>
  );
}
```

**Why not `setOptimisticPriority(PRIORITY_CYCLE[optimisticPriority])`?** If the user clicks twice rapidly, both calls read the same `optimisticPriority` from the closure. Updater functions queue and each computes from the result of the previous one.

### Multiple Optimistic Values

A single component can have multiple independent `useOptimistic` calls. Each tracks its own server prop:

```tsx
export function TaskCard({ id, priority, assignee }) {
  const [optimisticPriority, setOptimisticPriority] = useOptimistic(priority);
  const [optimisticAssignee, setOptimisticAssignee] = useOptimistic(assignee);

  function handlePriority(e: React.MouseEvent) {
    e.stopPropagation();
    startTransition(async () => {
      setOptimisticPriority(current => PRIORITY_CYCLE[current]);
      await cyclePriority(id);
    });
  }

  function handleAssignee(e: React.MouseEvent) {
    e.stopPropagation();
    startTransition(async () => {
      setOptimisticAssignee(nextAssignee);
      await reassignTask(id, nextAssignee);
    });
  }

  // Render with optimisticPriority and optimisticAssignee
}
```

Each optimistic value settles independently when its transition completes. Both track fresh server data when the framework re-renders with new props.

### `useState(prop)` Anti-Pattern

`useState(initialValue)` only reads the initial value on mount. When new server data arrives (via invalidation, revalidation, or navigation), the prop updates but `useState` ignores it:

```tsx
// ❌ Stale after refresh — useState ignores prop updates
function Card({ priority: initialPriority }) {
  const [priority, setPriority] = useState(initialPriority);
  // After re-render with new data, initialPriority changes but priority stays stale
}

// ✅ Tracks server data — useOptimistic re-evaluates on each render
function Card({ priority }) {
  const [optimisticPriority, setOptimisticPriority] = useOptimistic(priority);
  // After re-render with new data, priority changes and optimisticPriority follows
}
```

This distinction is critical for drag-and-drop boards, Kanban columns, and any component that receives server-derived props and supports mutations. `useState` creates an island of stale data; `useOptimistic` stays in sync with the server.

### Multi-Value (Reducer)

When an optimistic update affects multiple related values, use a reducer:

```tsx
const [optimistic, dispatch] = useOptimistic(
  { isFollowing: user.isFollowing, count: user.followerCount },
  (current, shouldFollow) => ({
    isFollowing: shouldFollow,
    count: current.count + (shouldFollow ? 1 : -1),
  })
);

function toggleAction() {
  startTransition(async () => {
    dispatch(!optimistic.isFollowing);
    await followAction(!optimistic.isFollowing);
  });
}
```

### One-Way (Counter)

Two hooks — one for each value:

```tsx
const [optimisticVotes, setOptimisticVotes] = useOptimistic(votes);
const [optimisticHasVoted, setOptimisticHasVoted] = useOptimistic(hasVoted);

<form action={async () => {
  setOptimisticVotes(current => current + 1);
  setOptimisticHasVoted(true);
  await upvote(id);
}}>
  <button disabled={optimisticHasVoted}>👍 {optimisticVotes}</button>
</form>
```

Use an updater function for the count (`current => current + 1`) to handle rapid clicks correctly. For tightly coupled multi-value updates, see the Multi-Value (Reducer) pattern below.

### Optimistic Delete (with Error Recovery)

You can use `useOptimistic` for destructive actions too. On failure, the item reappears automatically:

```tsx
const [optimisticItems, removeItem] = useOptimistic(
  items,
  (currentItems, idToRemove) =>
    currentItems.map(item =>
      item.id === idToRemove ? { ...item, deleting: true } : item
    )
);

function deleteItemAction(id) {
  startTransition(async () => {
    removeItem(id);
    try {
      await deleteAction(id);
    } catch (e) {
      toast.error(e.message);
    }
  });
}
```

Style deleted items with reduced opacity. If the action fails, `useOptimistic` reverts and the item reappears.

### Move Between Groups (Kanban, Categories)

When items move between groups (columns, categories, status buckets), use a reducer that remaps the item's group field. The optimistic update moves the item instantly; on failure, `useOptimistic` snaps it back:

```tsx
const [optimisticItems, moveItem] = useOptimistic(
  items,
  (state, { id, newStatus }: { id: string; newStatus: Status }) =>
    state.map(item => item.id === id ? { ...item, status: newStatus } : item)
);

function moveAction(id: string, newStatus: Status) {
  startTransition(async () => {
    moveItem({ id, newStatus });
    await updateStatus(id, newStatus);
  });
}
```

This works for drag-and-drop boards, category reassignment, priority changes — any interaction that moves an item between groups. The reducer re-runs with the latest base data if a background refresh arrives mid-action, so the move sits on top of fresh data.

### List Add (UUID Dedup)

```tsx
const [optimisticItems, addOptimistic] = useOptimistic(
  items,
  (state, newItem: Item) => {
    if (state.some(i => i.id === newItem.id)) return state;
    return [...state, { ...newItem, pending: true }];
  }
);

async function submitAction(formData: FormData) {
  const id = crypto.randomUUID();
  addOptimistic({ id, text: formData.get('text') });

  const result = await createItem(id, formData);
  if (result.error) toast.error(result.error);
}
```

Pass the client-generated ID to the mutation so the optimistic item and real response share the same key. Use a reducer (not an updater) so that if the base list changes during the Action (e.g., from polling), React re-runs the reducer with the latest data.

### Pending-Only List (Empty Initial)

When a server component renders the authoritative list, the client component only needs to track **pending** items. Start with an empty array and reuse the same item component for both real and pending items via a `pending` prop:

```tsx
'use client';

import { useOptimistic, useRef } from 'react';

export function OptimisticItems({ parentId }: { parentId: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [pending, setPending] = useOptimistic<Item[]>([]);

  return (
    <>
      {pending.map(item => (
        <ItemCard key={item.id} item={item} pending />
      ))}
      <form
        ref={formRef}
        action={async (formData) => {
          const text = (formData.get('text') as string)?.trim();
          if (!text) return;
          formRef.current?.reset();

          const id = crypto.randomUUID();
          setPending(current => [...current, { id, text, pending: true }]);
          await createItem(parentId, id, text);
        }}
      >
        <input name="text" required />
        <button type="submit">Add</button>
      </form>
    </>
  );
}
```

The server component renders the real list alongside. The page wraps it in `<Suspense>`:

```tsx
async function ItemSection({ parentId }: { parentId: string }) {
  const items = await getItems(parentId);
  return (
    <div>
      <OptimisticItems parentId={parentId} />
      {items.map(item => <ItemCard key={item.id} item={item} />)}
    </div>
  );
}
```

The server component owns the real list. When the framework delivers fresh data (after invalidation), the pending array resets to `[]` — no dedup reducer needed since the real and pending lists are separate DOM trees. The client-generated UUID is passed to the mutation so the real item uses the same ID, preventing a duplicate flash.

**When to use this vs the full-list approach:** Use the empty-initial pattern when a server component renders the list and the client only handles creation. Use the full-list reducer (above) when the client owns the entire list — e.g., when using `use()` to unwrap a promise, or when the client also handles optimistic deletes and reorders.

### Immediate Form Clearing

For chat/comment UIs, the input should clear immediately when the user submits — not after the server responds. Use an uncontrolled input with `formRef.current?.reset()`:

```tsx
'use client';

import { useOptimistic, useRef } from 'react';

export function CommentForm({ addAction }: { addAction: (content: string) => Promise<void> }) {
  const [isPending, setIsPending] = useOptimistic(false);
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={async (formData) => {
        const text = (formData.get('content') as string)?.trim();
        if (!text) return;
        setIsPending(true);
        formRef.current?.reset();
        await addAction(text);
      }}
    >
      <input name="content" required disabled={isPending} />
      <button type="submit" disabled={isPending}>Send</button>
    </form>
  );
}
```

`formRef.current?.reset()` directly manipulates the DOM, so it clears the input synchronously before the `await`. `setIsPending(true)` uses `useOptimistic` and also updates immediately. React's automatic form reset after `formAction` completes would also clear the input, but only *after* the action finishes — `formRef.reset()` makes it immediate.

**Why not controlled inputs?** `useState` setters are deferred inside transitions — `setContent('')` inside a form `action` does NOT clear the input until the transition commits (after the `await`). Only `useOptimistic` setters and direct DOM manipulation (`formRef.reset()`) update immediately.

---

## Pessimistic Mutations

When you don't want to show the result optimistically but still need feedback:

```tsx
'use client';

import { useOptimistic } from 'react';

export function DeleteButton({ id, deleteAction }) {
  const [isPending, setIsPending] = useOptimistic(false);

  return (
    <form action={async () => {
      setIsPending(true);
      await deleteAction(id);
    }}>
      <button type="submit" disabled={isPending}>
        Delete
      </button>
    </form>
  );
}
```

The `disabled` state on the button provides feedback. If the consumer wants the surrounding card to dim, the `DeleteButton` can also set `data-pending` on itself as a CSS hook for parent `has-[[data-pending]]:` styles.

**Alternative — `useTransition` + `onClick`:**

```tsx
'use client';

import { useTransition } from 'react';

export function DeleteButton({ id, deleteAction }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      data-pending={isPending ? '' : undefined}
      disabled={isPending}
      onClick={() => startTransition(async () => await deleteAction(id))}
    >
      Delete
    </button>
  );
}
```

Both work. The form `action` version uses `useOptimistic(false)` and gets automatic form coordination. The `useTransition` + `onClick` version is more explicit and sets `data-pending` directly, which can be useful when parent components react via `has-[[data-pending]]:` styles:

```tsx
<div className="has-[[data-pending]]:opacity-50 transition-opacity">
  <CardContent />
  <DeleteButton id={item.id} deleteAction={deleteItem} />
</div>
```

### Grouped Pending

For sibling elements, use `group` on a common ancestor. The component that owns the transition sets `data-pending`:

```tsx
<div className="group">
  <FilterBar />   {/* sets data-pending internally */}
  <div className="group-has-[[data-pending]]:opacity-50 transition-opacity">
    <ContentGrid />
  </div>
</div>
```

Alternatively, the consumer can own the transition and set `data-pending` on the wrapper:

```tsx
<div className="group" data-pending={isPending ? '' : undefined}>
  <FilterChips action={filterAction} />
  <div className="group-has-[[data-pending]]:opacity-50 transition-opacity">
    <ContentGrid />
  </div>
</div>
```

---

## Deferred Values (Stale-While-Revalidate)

### Async Search with useSuspenseQuery

Extract data fetching into a separate component that uses a Suspense-enabled data source. Use `useDeferredValue` so old results stay visible while fresh data loads:

```tsx
import { useState, useDeferredValue, Suspense } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';

export function SearchCombobox({ asyncSearchFn, onSelect, placeholder = 'Search...' }) {
  const [filterText, setFilterText] = useState('');
  const deferredFilterText = useDeferredValue(filterText);
  const isStale = filterText !== deferredFilterText;

  return (
    <div>
      <input
        placeholder={placeholder}
        value={filterText}
        onChange={e => setFilterText(e.target.value)}
      />
      {deferredFilterText.length >= 2 && (
        <ErrorBoundary fallback={<div>Error loading results</div>}>
          <Suspense fallback={<div>Loading results...</div>}>
            <div className={isStale ? 'animate-pulse' : ''}>
              <SearchResults
                query={deferredFilterText}
                asyncSearchFn={asyncSearchFn}
                onItemClick={onSelect}
              />
            </div>
          </Suspense>
        </ErrorBoundary>
      )}
    </div>
  );
}

function SearchResults({ query, asyncSearchFn, onItemClick }) {
  const { data: results } = useSuspenseQuery({
    queryKey: ['search', query],
    queryFn: () => asyncSearchFn(query),
  });

  if (!results?.length) return <span>No results found</span>;

  return results.map(item => (
    <div key={item.id} onClick={() => onItemClick(item)}>
      {item.name}
    </div>
  ));
}
```

How it works:
- The input stays responsive — `filterText` updates immediately on every keystroke.
- `deferredFilterText` lags behind, so `SearchResults` keeps showing stale results while `useSuspenseQuery` fetches fresh data.
- `isStale` (comparing the two values) drives a visual indicator on the stale content.
- On first load, the `<Suspense>` fallback shows. On subsequent changes, old results stay visible.
- `useSuspenseQuery` provides built-in caching — repeated queries show instant cache hits.

This pattern works with any Suspense-enabled data source, not just TanStack Query.

---

## Action State (useActionState)

### Form with Server Response

`useActionState` manages state derived from an action result. The reducer receives `(prevState, payload)` and returns new state. When passed as a form `action`, the payload is `FormData` and React wraps the submission in a transition automatically:

```tsx
'use client';

import { useActionState, startTransition } from 'react';
import { saveItem } from '../actions';

export function CreateForm({ onSuccess }: { onSuccess?: () => void }) {
  const [{ error, key }, formAction, isPending] = useActionState(
    async (prev: { error: string | null; key: number }, formData: FormData) => {
      const result = await saveItem(formData);
      if ('error' in result) return { ...prev, error: result.error };
      startTransition(() => onSuccess?.());
      return { error: null, key: prev.key + 1 };
    },
    { error: null, key: 0 }
  );

  return (
    <form action={formAction}>
      <div key={key}>
        <input name="title" required />
        <textarea name="description" />
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button type="submit" disabled={isPending}>
        {isPending ? 'Saving...' : 'Save'}
      </button>
    </form>
  );
}
```

**Key-based reset:** Incrementing `key` in the returned state remounts form content, resetting all internal state (inputs, `useState` hooks) without a manual `resetForm()`.

**Error handling:** Return expected errors as state and display inline. Throw unexpected errors — `useActionState` rethrows them to the nearest error boundary and cancels all queued actions.

### Combining with useOptimistic

`useOptimistic` reads from `useActionState`'s state for instant feedback:

```tsx
const [state, dispatchAction, isPending] = useActionState(updateAction, { count: 0 });
const [optimisticCount, setOptimisticCount] = useOptimistic(state.count);

function addAction() {
  startTransition(() => {
    setOptimisticCount(c => c + 1);
    dispatchAction({ type: 'ADD' });
  });
}
```

### When Not to Use

- If you just need optimistic feedback and don't care about the server response, `useOptimistic` alone is simpler.
- `useActionState` queues actions sequentially — each waits for the previous to complete. For parallel actions, use `useState` + `useTransition` directly.
- If the form has no validation/error state and no need for auto-reset, a plain form `action` with `useOptimistic(false)` for `isPending` is sufficient.

---

## Double-Transition Pattern

State updates after `await` inside an async `startTransition` fall outside the transition scope. This matters when you need to close a dialog, reset a form, or update UI after a mutation completes — those updates run immediately instead of being batched with the re-render triggered by invalidation.

```tsx
function CreateDialog({ action }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useOptimistic(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <form action={async (formData) => {
        setIsPending(true);
        await action(formData);
        // Without inner startTransition, dialog closes before
        // the board re-renders with fresh data — causes a flash
        startTransition(() => {
          setIsOpen(false);
        });
      }}>
        <button type="submit" disabled={isPending}>
          {isPending ? 'Creating...' : 'Create'}
        </button>
      </form>
    </Dialog>
  );
}
```

The outer transition (from `<form action>`) wraps the `await`. The inner `startTransition` batches the dialog close with the re-render triggered by invalidation inside the mutation. Without it, the dialog closes instantly while the page still shows stale data.

---

## Coordination

### Mutation + Navigation

Toggle a favorite, then switch to a filtered view. Both go through the transition system — `useOptimistic` handles the instant toggle, the tab switch triggers navigation, and React coordinates everything in a single render pass. The optimistic value settles when the server responds.

### Mutation + Background Refresh

A background data refresh arrives mid-action. If using a reducer, React re-runs it with the updated base data — your optimistic addition sits on top of the latest list. When the action completes, the optimistic overlay settles.
