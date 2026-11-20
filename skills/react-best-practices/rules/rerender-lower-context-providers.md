---
title: Lower Context Providers Below Lazy Boundaries
impact: MEDIUM
impactDescription: avoids provider setup and context updates for inactive UI
tags: react, context, providers, modal, lazy-rendering, performance
---

## Lower Context Providers Below Lazy Boundaries

Place context providers as close as possible to the subtree that consumes them, especially behind UI boundaries that only render when active, such as modals, drawers, popovers, tabs, accordions, and route segments. A provider above the boundary runs its initialization, subscriptions, memoization, and context updates even when the expensive UI is closed or not selected.

**Incorrect (provider runs while the modal is closed):**

```tsx
function UserSettingsButton({ userId }: { userId: string }) {
  const [open, setOpen] = useState(false)

  return (
    <SettingsDataProvider userId={userId}>
      <Button onClick={() => setOpen(true)}>Settings</Button>
      <Modal open={open} onOpenChange={setOpen}>
        <ModalContent>
          <SettingsForm />
        </ModalContent>
      </Modal>
    </SettingsDataProvider>
  )
}

function SettingsDataProvider({
  userId,
  children,
}: {
  userId: string
  children: React.ReactNode
}) {
  const value = useMemo(() => buildSettingsModel(userId), [userId])

  return (
    <SettingsDataContext.Provider value={value}>
      {children}
    </SettingsDataContext.Provider>
  )
}
```

**Correct (provider only mounts with modal content):**

```tsx
function UserSettingsButton({ userId }: { userId: string }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>Settings</Button>
      <Modal open={open} onOpenChange={setOpen}>
        <SettingsDataProvider userId={userId}>
          <ModalContent>
            <SettingsForm />
          </ModalContent>
        </SettingsDataProvider>
      </Modal>
    </>
  )
}

function SettingsDataProvider({
  userId,
  children,
}: {
  userId: string
  children: React.ReactNode
}) {
  const value = useMemo(() => buildSettingsModel(userId), [userId])

  return (
    <SettingsDataContext.Provider value={value}>
      {children}
    </SettingsDataContext.Provider>
  )
}
```

Keep providers higher only when their state is genuinely shared by always-visible UI, needed to decide whether the boundary should open, or intentionally preloaded before the user activates the subtree.
