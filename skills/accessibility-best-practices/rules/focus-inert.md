---
title: Use the inert Attribute to Disable Background Content
impact: MEDIUM
impactDescription: Prevents keyboard and screen reader access to content behind overlays
tags: focus, inert, modal, overlay, background
wcag: "2.4.3 Level A"
---

## Use the inert Attribute to Disable Background Content

**Impact: MEDIUM (Prevents keyboard and screen reader access to content behind overlays)**

When a modal, drawer, or overlay is open, background content should be inert — not focusable, not clickable, not announced by screen readers. The `inert` attribute does all of this natively. The native `<dialog>` element handles this automatically, but for custom overlays, use `inert` explicitly.

**Incorrect (background content still interactive behind overlay):**

```tsx
function App() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  return (
    <div>
      {/* Background content still focusable and announced */}
      <main>
        <button>Click me</button>
        <a href="/page">Navigate</a>
      </main>
      {drawerOpen && <Drawer onClose={() => setDrawerOpen(false)} />}
    </div>
  )
}
```

**Correct (background content made inert):**

```tsx
function App() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  return (
    <div>
      {/* inert removes from tab order and screen reader tree */}
      <main inert={drawerOpen || undefined}>
        <button>Click me</button>
        <a href="/page">Navigate</a>
      </main>
      {drawerOpen && <Drawer onClose={() => setDrawerOpen(false)} />}
    </div>
  )
}
```

In React 18, pass `undefined` instead of `false` for the `inert` attribute, since `inert={false}` still adds the attribute to the DOM. React 19 fixes this and correctly removes the attribute when `false` is passed. The `inert={drawerOpen || undefined}` pattern works safely across both versions.

Reference: [MDN inert attribute](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/inert)
