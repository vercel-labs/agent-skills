---
title: Provide Keyboard Shortcuts for Common Actions
impact: MEDIUM
impactDescription: Keyboard shortcuts improve efficiency for power users and motor-impaired users
tags: keyboard, shortcuts, efficiency, motor
wcag: "2.1.4 Level A"
---

## Provide Keyboard Shortcuts for Common Actions

**Impact: MEDIUM (Keyboard shortcuts improve efficiency for power users and motor-impaired users)**

For frequently used actions, provide keyboard shortcuts. If a shortcut uses a single character key, ensure it can be remapped or disabled (WCAG 2.1.4). Always document available shortcuts.

**Incorrect (single-character shortcut with no way to disable):**

```tsx
function SearchPage() {
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      // Single character 's' — conflicts with typing in inputs,
      // no way to disable or remap
      if (e.key === 's') {
        document.getElementById('search')?.focus()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  return <input id="search" type="search" />
}
```

**Correct (modifier key shortcut, disabled when typing):**

```tsx
function SearchPage() {
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      // Uses modifier key — won't conflict with typing
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        document.getElementById('search')?.focus()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  return (
    <div>
      <label htmlFor="search">
        Search <kbd>⌘K</kbd>
      </label>
      <input id="search" type="search" />
    </div>
  )
}
```

Use modifier keys (Ctrl/Cmd + key) for shortcuts, display the shortcut hint in the UI, and ensure shortcuts don't fire when focus is inside a text input.

Reference: [WCAG 2.1.4 Character Key Shortcuts](https://www.w3.org/WAI/WCAG22/Understanding/character-key-shortcuts.html)
