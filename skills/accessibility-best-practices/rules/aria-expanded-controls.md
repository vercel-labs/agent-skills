---
title: Use aria-expanded and aria-controls for Toggle Elements
impact: HIGH
impactDescription: Screen reader users cannot know if a section is open or closed without aria-expanded
tags: aria, expanded, controls, toggle, disclosure
wcag: "1.3.1 Level A"
---

## Use aria-expanded and aria-controls for Toggle Elements

**Impact: HIGH (Screen reader users cannot know if a section is open or closed without aria-expanded)**

When a button toggles visibility of content (accordion, dropdown, disclosure), use `aria-expanded` to communicate state and `aria-controls` to associate the button with the controlled content.

**Incorrect (no state communication):**

```tsx
function Accordion({ title, children }) {
  const [open, setOpen] = useState(false)
  return (
    <div>
      <button onClick={() => setOpen(!open)}>
        {title} {open ? '▲' : '▼'}
      </button>
      {open && <div className="content">{children}</div>}
    </div>
  )
}
```

**Correct (aria-expanded and aria-controls):**

```tsx
function Accordion({ title, children }) {
  const [open, setOpen] = useState(false)
  const contentId = useId()

  return (
    <div>
      <h3>
        <button
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls={contentId}
        >
          {title}
        </button>
      </h3>
      <div id={contentId} role="region" hidden={!open}>
        {children}
      </div>
    </div>
  )
}
```

Screen readers will announce "Title, expanded, button" or "Title, collapsed, button", telling the user the current state before they interact.

Reference: [WAI-ARIA Disclosure Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/), [WCAG 1.3.1 Info and Relationships](https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html)
