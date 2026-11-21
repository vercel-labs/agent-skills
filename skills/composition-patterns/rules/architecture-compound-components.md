---
title: Use Compound Components
impact: HIGH
impactDescription: enables flexible composition without prop drilling
tags: composition, compound-components, architecture
---

## Use Compound Components

Structure complex components as compound components with a shared context. Each
subcomponent accesses shared state via context, not props. Consumers compose the
pieces they need.

**Incorrect (monolithic component with render props):**

```tsx
function Composer({
  renderHeader,
  renderFooter,
  renderActions,
  showAttachments,
  showFormatting,
  showEmojis,
}: Props) {
  return (
    <form>
      {renderHeader?.()}
      <Input />
      {showAttachments && <Attachments />}
      {renderFooter ? (
        renderFooter()
      ) : (
        <Footer>
          {showFormatting && <Formatting />}
          {showEmojis && <Emojis />}
          {renderActions?.()}
        </Footer>
      )}
    </form>
  )
}
```

**Correct (compound components with shared context):**

```tsx
const ComposerContext = createContext<ComposerContextValue | null>(null)

function ComposerProvider({ children, state, actions, meta }: ProviderProps) {
  return (
    <ComposerContext value={{ state, actions, meta }}>
      {children}
    </ComposerContext>
  )
}

function ComposerFrame({ children }: { children: React.ReactNode }) {
  return <form>{children}</form>
}

function ComposerInput() {
  const {
    state,
    actions: { update },
    meta: { inputRef },
  } = use(ComposerContext)
  return (
    <TextInput
      ref={inputRef}
      value={state.input}
      onChangeText={(text) => update((s) => ({ ...s, input: text }))}
    />
  )
}

function ComposerSubmit() {
  const {
    actions: { submit },
  } = use(ComposerContext)
  return <Button onPress={submit}>Send</Button>
}

// Export as compound component
const Composer = {
  Provider: ComposerProvider,
  Frame: ComposerFrame,
  Input: ComposerInput,
  Submit: ComposerSubmit,
  Header: ComposerHeader,
  Footer: ComposerFooter,
  Attachments: ComposerAttachments,
  Formatting: ComposerFormatting,
  Emojis: ComposerEmojis,
}
```

**Usage:**

```tsx
<Composer.Provider state={state} actions={actions} meta={meta}>
  <Composer.Frame>
    <Composer.Header />
    <Composer.Input />
    <Composer.Footer>
      <Composer.Formatting />
      <Composer.Submit />
    </Composer.Footer>
  </Composer.Frame>
</Composer.Provider>
```

Consumers explicitly compose exactly what they need. No hidden conditionals. And the state, actions and meta are dependency-injected by a parent provider, allowing multiple usages of the same component structure.

In an RSC application such as the Next.js App Router, the context provider and components that read its context belong in the client subtree. Compound objects and dot notation still work within client modules.

When a Server Component imports from a `'use client'` entry point, however, the imports are client references. Importing the `Composer` object and accessing `Composer.Frame` on the server does not read an ordinary JavaScript object. Export the parts directly from the client entry point if a Server Component needs to compose them:

**Correct (direct exports from the client entry point):**

```tsx
// composer.tsx: the client module defining the components above
export { ComposerProvider, ComposerFrame, ComposerInput, ComposerSubmit }
```

**Correct (Server Component importing a part directly):**

```tsx
// page.tsx: a Server Component
import { ComposerFrame } from './composer'

export default function Page() {
  return <ComposerFrame>Server-rendered content</ComposerFrame>
}
```

Alternatively, compose `Composer.Provider`, `Composer.Frame`, and the other parts inside a Client Component and export that wrapper for the server to render. Keep ordinary event handlers and state in that client subtree, and pass serializable props or rendered children across the boundary. This does not require making the page or layout a Client Component.

References: [React's client boundary](https://react.dev/reference/rsc/use-client), [Next.js context providers](https://nextjs.org/docs/app/getting-started/server-and-client-components#context-providers).
