---
name: modern-react-guidance
description: Implement, review, or refactor React web components using current React guidance. Use for state and Effects, async Actions and forms, Suspense, responsiveness, performance, and integration with browser APIs. Match recommendations to the project's React version and framework.
license: MIT
metadata:
  author: vercel
  version: "0.1.0"
---

# Modern React Guidance

Find the React guidance relevant to the task, read it, and apply it to the project's existing architecture. Use React's documentation for API semantics and examples; this skill supplies task routing and decision criteria rather than a second API reference.

## Workflow

1. Inspect the components involved and the project's React version, framework, and compiler configuration. Use the project's existing data and mutation APIs. Check feature availability before introducing an API from the current documentation; a newer docs version does not authorize an upgrade.
2. Select the matching task below and retrieve the linked documentation with the available web or documentation tools. Read the relevant usage and caveats sections, following a more specific link only when needed. Skip unrelated topics. For APIs that differ from the installed version, use that version's documentation or release notes.
3. Apply the guidance to the requested change. Preserve the intended user experience and avoid unrelated migrations or optimization passes.
4. Verify the behavior the change affects with the project's existing checks and, for interactions, in a running app. Report material version constraints or guidance you could not retrieve. An unavailable source is a limitation, not confirmation that remembered advice is current.

## Choose guidance by task

| Task | Read | Decision to resolve |
| --- | --- | --- |
| Derive values, respond to user events, or remove an Effect | [You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect) | Calculate render data during render; put interaction logic in its event handler. Use an Effect to synchronize with an external system. |
| Fix stale values or repeated subscriptions | [useEffectEvent](https://react.dev/reference/react/useEffectEvent) | Separate non-reactive Effect logic from synchronization dependencies when supported. Effect Events are not general callback props or a way to hide reactive dependencies. |
| Preserve or reset component state | [Preserving and Resetting State](https://react.dev/learn/preserving-and-resetting-state) | Choose component identity and keys according to which state should survive. |
| Submit a form and display its result or errors | [useActionState](https://react.dev/reference/react/useActionState) and [form Actions](https://react.dev/reference/react-dom/components/form) | Use the existing framework's Action integration where available; choose how result, validation, and pending state reach the UI. |
| Update the UI before a mutation completes | [useOptimistic](https://react.dev/reference/react/useOptimistic) | Define the optimistic result and how it reconciles with success or failure of the Action. |
| Keep interactions responsive or show Action progress | [useTransition](https://react.dev/reference/react/useTransition) | Keep controlled input state urgent. Distinguish background rendering from request cancellation and ordering. |
| Keep a fast input while expensive dependent UI catches up | [useDeferredValue](https://react.dev/reference/react/useDeferredValue) | Defer the consuming UI when appropriate; deferral does not debounce network requests. |
| Coordinate loading states or keep revealed content visible | [Suspense](https://react.dev/reference/react/Suspense) | Choose reveal boundaries around supported suspending data or code. An Effect-based fetch does not activate Suspense. |
| Integrate a dialog, widget, focus, or other imperative DOM API | [Manipulating the DOM with Refs](https://react.dev/learn/manipulating-the-dom-with-refs) | Use refs for imperative operations and keep DOM ownership consistent with React's updates. |
| Optimize rendering or decide whether to add memoization | [React Compiler](https://react.dev/learn/react-compiler/introduction) and [performance guidance](references/performance.md) | Check compiler coverage and identify the actual cost before adding manual memoization. |
| Work across a server/client boundary | [Server Components](https://react.dev/reference/rsc/server-components) | Confirm framework support, execution environment, and what crosses the boundary; consult the installed framework's docs for routing and caching behavior. |
| Diagnose render side effects, mutation, or Hook violations | [Rules of React](https://react.dev/reference/rules) | Keep render pure, preserve immutable inputs, and follow the applicable Hook rules. |

For a task spanning several rows, read the relevant sources together. For example, an optimistic form needs the form/Action and optimistic-state guidance, not every entry in the table. For performance work, read [references/performance.md](references/performance.md) before applying recommendations inherited from older best-practice lists.

## Web platform and framework guidance

When Modern Web Guidance is available, use it for the task's HTML, CSS, browser API, accessibility, and compatibility decisions. Use this skill for the React state, lifecycle, and composition decisions involved in implementing that same feature. For example, a platform guide can define a dialog's behavior while React guidance determines how refs and synchronization connect it to component state.

Framework-specific APIs, routing, caching, and deployment behavior belong to that framework's guidance. Do not assume that a React project uses Next.js, that server rendering implies Server Components, or that a browser API can run on the server.

## When documentation is unavailable

Use relevant documentation already present in the project when available, and state when you could not check a current source. Keep changes within APIs supported by the installed dependencies. Do not install another skill, add a retrieval service, or upgrade dependencies merely to make this workflow run.
