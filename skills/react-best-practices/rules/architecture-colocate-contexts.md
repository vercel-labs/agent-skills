---
title: Co-locate Context with Components
impact: MEDIUM
impactDescription: reduces prop drilling, improves maintainability, easier refactoring
tags: architecture, context, file-organization, composition, react19
---

## Co-locate Context with Components

Place context definitions adjacent to the components that use them. This reduces indirection, makes relationships explicit, and enables easier refactoring when context scope changes.

**Incorrect (context scattered across the app):**

```
src/
├── contexts/
│   ├── ComposerContext.ts
│   └── ChannelContext.ts
├── components/
│   ├── Composer/
│   │   ├── Frame.tsx
│   │   ├── Input.tsx
│   │   └── Submit.tsx
│   └── Channel/
│       └── ChannelHeader.tsx
```

Problems:
- Opening `Composer/Input.tsx` doesn't show where context comes from
- Moving components requires updating imports from `src/contexts`
- Debugging requires jumping between distant files

**Correct (context co-located with components):**

```
src/
├── components/
│   ├── Composer/
│   │   ├── context/
│   │   │   ├── types.ts
│   │   │   ├── provider.tsx
│   │   │   └── index.ts
│   │   ├── ComposerFrame.tsx
│   │   ├── ComposerInput.tsx
│   │   └── ComposerSubmit.tsx
│   └── Channel/
│       ├── context/
│       │   ├── types.ts
│       │   ├── provider.tsx
│       │   └── index.ts
│       └── ChannelHeader.tsx
```

Benefits:
- Context defined in same folder as components that use it
- Moving `Composer/` moves all related files together
- Context boundary is explicit (local to feature, not app-wide)

**Context file structure:**

```
context/
├── types.ts      # State, Actions, Meta, ContextValue interfaces
├── provider.tsx  # Provider implementation with { state, actions, meta }
└── index.ts      # Exports provider, context, and hooks
```

**Implementation pattern:**

```tsx
// context/types.ts
export interface ComposerState {
  input: string
  isSubmitting: boolean
}

export interface ComposerActions {
  update: (updater: (s: ComposerState) => ComposerState) => void
  submit: () => Promise<void>
}

export interface ComposerMeta {
  inputRef: React.RefObject<HTMLInputElement>
}

export interface ComposerContextValue {
  state: ComposerState
  actions: ComposerActions
  meta: ComposerMeta
}

// context/provider.tsx
import { createContext, useState, useCallback, useRef, ReactNode } from 'react'
import { ComposerContextValue } from './types'

export const ComposerContext = createContext<ComposerContextValue | null>(null)

export function ComposerProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState({ input: '', isSubmitting: false })
  const inputRef = useRef<HTMLInputElement>(null)

  const update = useCallback((updater) => setState(updater), [])
  const submit = useCallback(async () => { /* ... */ }, [])

  return (
    <ComposerContext value={{
      state,
      actions: { update, submit },
      meta: { inputRef }
    }}>
      {children}
    </ComposerContext>
  )
}

// context/index.ts
import { use } from 'react'
import { ComposerContext, ComposerProvider } from './provider'

export { ComposerContext, ComposerProvider } from './provider'
export type { ComposerState, ComposerActions, ComposerMeta, ComposerContextValue } from './types'

export function useComposer() {
  const context = use(ComposerContext)
  if (!context) throw new Error('useComposer must be used within ComposerProvider')
  return context
}
```

**When to break co-location:**

If a context is truly app-wide (theme, auth, feature flags), place it in a shared location:

```
src/
├── shared/
│   └── contexts/
│       ├── theme/
│       ├── auth/
│       └── feature-flags/
├── components/
│   └── Composer/
│       └── context/  # Feature-scoped, stays here
```

Ask: Does this context belong to a single feature or the entire app? If feature-scoped, co-locate it.

**Cross-feature context:**

If multiple features share a context, place it at the boundary between them or lift to shared:

```
src/
├── shared/
│   └── contexts/
│       └── clients/  # Used by multiple features
├── views/
│   ├── crm/
│   │   └── context/  # CRM-specific UI state
│   └── dashboard/
│       └── context/  # Dashboard-specific UI state
```

Co-location reduces mental overhead: related code lives together.
