# Audit & Review Workflow

This is a collaborative workflow. Audit the codebase, present findings, and implement what the user prioritizes. Don't apply patterns blindly — surface issues and let the user decide.

**Important:** Only fix what's actually broken or causing UX issues. Don't convert working code just to match a pattern. `useState` for local UI state (form inputs, modals, controlled selects) is completely fine — the issue is `useState` for **server-derived data** that should track server updates. If you're unsure whether something is broken or just different, **ask the user** — confirm what issues they're seeing before refactoring.

Present the full picture, then work on what the user cares about.

## Step 0: Verify Framework APIs

Before implementing any pattern, check the project's framework version. Invalidation APIs change between major versions. Using the wrong API will cause build errors or silent failures.

1. Check the installed version (e.g., `package.json`).
2. Read the framework's API reference or bundled docs.
3. Confirm which invalidation, caching, and routing APIs are available before writing code.
4. For framework-specific setup requirements, see `nextjs.md` (Next.js) or your framework's docs.

## Step 1: Audit the App

Before writing any code, scan the codebase and classify async interactions.

**Quick scan — run these searches to find candidates:**

```
grep -r "useState.*useEffect" --include="*.tsx"   # Client-side fetch patterns
grep -r "useState.*initial\|useState.*prop" --include="*.tsx"  # useState(prop) → useOptimistic(prop)
grep -r "onClick.*await" --include="*.tsx"         # Async onClick handlers → form actions
grep -r "router\.refresh" --include="*.tsx"        # Client-side invalidation — check if it should be server-side
grep -r "/api/" --include="*.tsx"                  # API routes that might be unnecessary
grep -r "onChange" --include="*.tsx"                # Design components missing action props
grep -r "window\.location" --include="*.tsx"       # Hard refreshes → framework invalidation
grep -r "handleAction\|handle.*Action" --include="*.tsx"  # Wrong naming — use Action suffix without handle
```

**Look for uncoordinated patterns (ranked by impact):**

- **`useState` + `useEffect` pairs** — Client-side data fetching that should be server data passed as props. This is the #1 source of coordination bugs: mutations and navigation don't talk to each other because state lives in two places. **Exception:** streaming responses via `fetch` + `ReadableStream` are not this anti-pattern — client-side streaming is legitimate.
- **`useState(prop)` / `useState(initialProp)`** — Components receiving server data as a prop and storing it in `useState`. When fresh data arrives (via invalidation or navigation), `useState` ignores the new prop value. Replace with `useOptimistic(prop)` which re-evaluates on each render. **Exception:** components that need both `useOptimistic(prop)` for display and `useState` for an edit draft — here `useState` is for the local draft, not the server value.
- **`onClick` handlers calling async functions without `startTransition`** — These bypass error boundaries and provide no pending state. Wrap in `startTransition`, or use a form `action` if the interaction is naturally a submission.
- **API routes created just for client-side fetching** — Often a sign of the `useEffect` anti-pattern. The data should come from the server component and flow as props.
- **Async components** — Any component with `await`. Candidates for `<Suspense>` boundaries.
- **`<Suspense>` boundaries** — Check if fallbacks match the content layout. Missing or omitted fallbacks cause layout shift. Use skeletons for data, static markup for interactive controls, omit fallback only for side-effect components that render nothing. See `patterns.md` → Fallback Quality.
- **Mutations** — Form submissions, button clicks that trigger async work. Classify each: does the user expect instant feedback (optimistic), or is confirmation important (pessimistic)?
- **Navigation triggers** — Check if the control provides instant visual feedback (tab highlight, filter selection).
- **Custom design components** (tabs, chips, toggles) — Check if they support an `action` prop. If they have `onChange` but not `action`, they're candidates. Only modify your own components — don't patch third-party library code.
- **Framework-specific rendering concerns** — Check for dynamic hooks in layouts, non-deterministic values in server components, and similar patterns that affect caching or static rendering. See `nextjs.md` for Next.js specifics.
- **Data that updates without user action** — Live feeds, collaborative features. Consider a real-time data layer; for simple cases, see the polling example in `nextjs.md` (Next.js) or use `startTransition` + your framework's refresh API on an interval.
- **`handleFooAction` function names** — `handle` prefix and `Action` suffix should not be combined. `handle` is for direct event handlers (`handleClick`, `handleDragStart`); `Action` suffix replaces it (`filterAction`, `deleteAction`).

Then produce an interaction map and **STOP. Present the table to the user and ask what to prioritize before writing any code.** Do not proceed to Step 2 until the user confirms scope. The audit often surfaces more work than needed — the user may only care about a subset.

```
| Component      | Interaction     | Current Behavior       | Category     | Pattern              |
|----------------|-----------------|------------------------|--------------|----------------------|
| DataGrid       | Page load       | Global spinner         | Add coord.   | Suspense + skeleton  |
| LikeButton     | Toggle          | useEffect + useState   | Fix          | useOptimistic + form |
| DeleteButton   | Destructive     | No feedback            | Add coord.   | useOptimistic or useTransition |
| TabNav         | Tab switch      | onChange (freezes)      | Add coord.   | action prop          |
| VoteButton     | One-way vote    | onSubmit (freezes)     | Add coord.   | useOptimistic + form |
```

## Step 2: Add Suspense Boundaries

*Only implement items the user approved from the audit.*

For async components the user wants addressed, decide: should this block the page, or stream in? See `patterns.md` for skeleton co-location and boundary structure examples.

**Rules:**

- Push data fetching into child components wrapped in `<Suspense>` — works with async server components, `useSuspenseQuery`, `use()`, or any Suspense-enabled data source.
- Co-locate skeletons with their components — export both from the same file.
- Skeleton fallbacks must match the content layout (same heights, same grid). Otherwise you get CLS.
- Sibling `<Suspense>` boundaries resolve independently and stream in parallel. Use siblings when components have independent data and predictable sizes.
- If a component above has an unknown height, wrap both in a single boundary to avoid CLS.
- **Add `data-pending` feedback on regions surrounding Suspense boundaries** — when a filter or navigation triggers a re-render, the old content should dim or pulse while new data loads. Use `group-has-[[data-pending]]:opacity-60 transition-opacity` on the wrapper. See Step 6 and `patterns.md` for details.
- For framework-specific page structure (e.g., keeping `page.tsx` non-async in Next.js), see `nextjs.md`.

For deeper streaming patterns, consult your framework's streaming docs. If the audit surfaces many streaming-related improvements beyond basic Suspense boundaries, present them to the user as a separate category.

## Step 3: Convert Design Components to Action Props

For approved design components that use `onChange` and trigger a navigation or state update, add the action props pattern. See `patterns.md` for the full TabList, EditableText, and SubmitButton implementations.

**Rules:**

- **Keep `onChange` when adding `action`** — don't replace it. `onChange` fires synchronously before the transition and is needed for validation, `event.preventDefault()`, or consumers that don't use transitions. Add the `action` prop alongside it.
- Consider setting `data-pending` on the component root when the transition has a visible delay (e.g., filtering a list, switching tabs with async data). Not every action prop needs it — skip it for instant-feeling interactions. Alternatively, omit `data-pending` from the design component and let the consumer add their own `useTransition` and `data-pending` wrapper when they need pending feedback on surrounding content.
- Name callback props with "Action" to signal they'll run inside a transition.
- For animating async state changes (enter/exit, navigation, tab switches, list reorder), see the `vercel-react-view-transitions` skill.

## Step 4: Fix Uncoordinated State

**Only target `useState` that manages server-derived data or mutation results.** Leave `useState` alone for local UI concerns — form inputs, modals, multi-selects, dependent selects, drag state. These are not anti-patterns.

**Dual-state components:** Some components legitimately need both — `useOptimistic(prop)` for display and `useState` for an edit draft (e.g., an editable text field). Don't flag `useState` as an anti-pattern when a component also needs `useOptimistic` alongside it. The fix is adding `useOptimistic` for the display/committed value, not removing `useState` for the draft.

For `useState` + `useEffect` pairs that fetch server-derived data:

1. Delete the API endpoint (if created just for this)
2. Delete the `useEffect` fetch and local `useState`
3. Pass the data from a server component as a prop — **but first check if the data is actually server-only.** Constants (enums, option lists, static arrays) can often be imported directly in client components.
4. Add `useOptimistic` for instant feedback on mutations
5. Where suitable, use form `action` instead of `onClick` (e.g., submit buttons, toggles, delete actions). Don't force everything into forms — `startTransition` with `onClick` is fine for interactions that aren't naturally form submissions.
6. **Ensure the mutation invalidates** — call the framework's invalidation API after mutating data.
7. **Remove `key` props used to force remounts on data changes** — `useOptimistic` tracks the base value automatically; `key`-based remounting is only needed for `useState`.

For `useState(prop)` / `useState(initialProp)` storing server-derived data:

1. Replace `useState(prop)` with `useOptimistic(prop)` — this ensures the component tracks server updates after invalidation
2. Replace the `setState` calls with the optimistic setter inside `startTransition` or a form `action`
3. For relative updates (cycling, incrementing), use an updater function: `setOptimistic(current => next(current))`
4. Remove any `useEffect` syncing props to state — `useOptimistic` handles this automatically

See `patterns.md` → `useState(prop)` Anti-Pattern for before/after code examples.

## Step 5: Add Optimistic Updates

For approved mutations where the user expects instant feedback, apply the appropriate pattern from `patterns.md`:

- **Toggle** (favorite, like) — Boolean `useOptimistic` with form `action`
- **Multi-value** (follow with count) — Reducer form of `useOptimistic`
- **One-way** (upvote) — Reducer that increments and disables
- **List add** (create item) — Reducer with `crypto.randomUUID()` dedup
- **Move between groups** (Kanban) — Reducer that remaps the group field
- **Optimistic delete** — Reducer that marks `deleting: true`
- **Immediate form clearing** (chat/comment) — `formRef.current?.reset()` before `await`

**Rules:**

- The setter must be called inside an Action (`startTransition` or form `action`).
- Use **updater functions** (`setOptimistic(current => ...)`) for relative updates (cycling, incrementing, toggling) — prevents stale closures on rapid interactions.
- Use **reducers** (not updaters) when the base state might change during the Action (e.g., from polling), or when handling multiple action types.
- A component can have **multiple `useOptimistic` calls** for independent values.
- **Unexpected errors bubble to error boundaries** — use `useTransition`'s `startTransition` (not the standalone import) so thrown errors reach `error.tsx`. Don't wrap mutations in `try/catch` unless handling an **expected** failure (e.g., validation, conflict) with inline feedback like `toast.error()`. Blanket `try/catch` swallows errors that should crash visibly.
- For list adds, generate a UUID on the client and pass it to the server.
- Mutations that change displayed data must call the framework's invalidation API.

### Shared mutation logic

When the client needs to predict the server result (e.g., cycling enum values), extract the logic into a shared constant importable by both the client component and the mutation handler.

### Post-await state updates

State updates after `await` inside `startTransition` fall outside the transition scope. Wrap post-`await` updates in another `startTransition`. See `patterns.md` for the double-transition pattern.

## Step 6: Add Pending Feedback

Use `useTransition` + `data-pending` for "working" feedback. This works on its own for pessimistic mutations (e.g., delete with no optimistic result), or as an addition alongside `useOptimistic` to show both instant feedback and a subtle pending indicator. See `patterns.md` for the DeleteButton and grouped pending examples.

**Rules:**

- `data-pending` requires a parent with `has-[[data-pending]]:` styles to create a visible effect. Always add both parts.
- For grouped regions, use `group-has-[[data-pending]]:`.
- For design components, there are two valid approaches: the component can set `data-pending` internally (simpler for consumers), or the consumer can own `data-pending` on a wrapper (more flexible). See `patterns.md` for both patterns.

## Step 7: Review Together

**Do not skip this step.** A successful build doesn't mean the coordination works — most async bugs are behavioral, not type errors. Walk through the items you changed with the user and verify each interaction:

- Does loading avoid layout shift? (Skeleton matches content)
- Does the mutation provide feedback? (Optimistic or pending indicator)
- Does navigation feel responsive? (Controls highlight immediately)
- Do mutations persist after navigation? (Mutate, navigate away, navigate back — fresh data shows)
- Do mutations survive navigation? (Toggle, then switch tabs — no stale data)
- Does background refresh coordinate with user actions? (Action mid-poll — no clobber)
- Do mutations invalidate? (Call your framework's invalidation API)
- Are all server-derived values using `useOptimistic(prop)`, not `useState(prop)`?
- Are Action-suffixed functions named without `handle` prefix?
- Do relative updates use updater functions (`current => ...`)?
- Do errors surface correctly? (Unexpected → error boundary, expected → toast)
- Are state changes animated? (See the `vercel-react-view-transitions` skill for page transitions, enter/exit, and shared element animations)
