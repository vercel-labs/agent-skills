# Async React Skill

An agent skill for auditing and reviewing React async patterns. Scans for coordination issues — frozen UI, stale data, missing loading states, uncoordinated mutations — and suggests fixes using React 19's primitives. Collaborative by design: surfaces findings, lets you prioritize, then implements what you choose.

## How It Works

1. **Audit** — Scans the codebase for legacy patterns (`useState` + `useEffect` fetching, `useState(prop)`) and missing coordination (no loading states, frozen navigation, no mutation feedback)
2. **Present** — Produces an interaction map classifying every async interaction and suggests patterns for each
3. **Prioritize** — You decide what to fix and in what order
4. **Implement** — Applies the approved changes using the patterns below
5. **Review** — Walks through changes with you to verify coordination works

## What It Knows

- **Transitions** — `startTransition`, `useTransition` for coordinating async work and pending states
- **`useOptimistic`** — Instant feedback for mutations (toggles, counters, list adds, deletes with rollback)
- **`useDeferredValue`** — Stale-while-revalidate for search/filter with Suspense-enabled data sources
- **`<Suspense>`** — Declarative loading boundaries with skeleton fallbacks
- **Action props pattern** — Design components that handle async coordination internally
- **Form actions** — Declarative mutation handling with automatic transition wrapping
- **`data-pending` CSS pattern** — Zero-JS pending states via CSS `:has()`
- **Next.js integration** — Server actions, `updateTag()`, router behavior, promise-passing

## Skill Structure

```
async-react/
├── SKILL.md                      # Core skill (always loaded)
├── AGENTS.md                     # Full compiled document (all references expanded)
└── references/
    ├── implementation.md         # Audit and review workflow
    ├── patterns.md               # Detailed code patterns for each primitive
    ├── nextjs.md                 # Next.js App Router integration
    └── common-mistakes.md        # Common pitfalls and how to avoid them
```

## Installation

Install via [skills.sh](https://skills.sh):

```bash
npx skills add vercel-labs/agent-skills --skill async-react
```

## Resources

- [Ricky Hanlon's Async React demo](https://github.com/rickhanlonii/async-react) — The original React Conf 2025 demo this skill is based on
- [Async React Working Group](https://github.com/reactwg/async-react/discussions) — Follow progress on making Async React the default
- [React `useOptimistic` docs](https://react.dev/reference/react/useOptimistic)
- [React `useTransition` docs](https://react.dev/reference/react/useTransition)
- [React `Suspense` docs](https://react.dev/reference/react/Suspense)
- [React 19 announcement](https://react.dev/blog/2024/12/05/react-19)
- [Building Reusable Components with React 19 Actions](https://aurorascharff.no/posts/building-reusable-components-with-react19-actions/) — RouterSelect with action props
- [Building Design Components with Action Props](https://aurorascharff.no/posts/building-design-components-with-action-props-using-async-react/) — TabList and EditableText patterns
- [Async Combobox with useSuspenseQuery and useDeferredValue](https://aurorascharff.no/posts/building-an-async-combobox-with-usesuspensequery-and-usedeferredvalue/) — Stale-while-revalidate search
- [Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
