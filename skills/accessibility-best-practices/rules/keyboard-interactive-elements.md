---
title: All Interactive Elements Must Be Keyboard Accessible
impact: CRITICAL
impactDescription: Keyboard-inaccessible controls completely block motor-impaired and screen reader users
tags: keyboard, interactive, focus, tabindex
wcag: "2.1.1 Level A"
---

## All Interactive Elements Must Be Keyboard Accessible

**Impact: CRITICAL (Keyboard-inaccessible controls completely block motor-impaired and screen reader users)**

Every interactive element (buttons, links, form controls, custom widgets) must be operable with keyboard alone — Tab to focus, Enter/Space to activate, Escape to dismiss. Use native HTML elements that provide this for free.

**Incorrect (custom interactive elements without keyboard support):**

```tsx
function Card({ item, onSelect }) {
  return (
    // div with onClick only — not focusable, not keyboard operable
    <div className="card" onClick={() => onSelect(item.id)}>
      <img src={item.image} />
      <p>{item.title}</p>
      <span className="icon" onClick={(e) => {
        e.stopPropagation()
        toggleFavorite(item.id)
      }}>♥</span>
    </div>
  )
}
```

**Correct (keyboard-accessible interactive elements):**

```tsx
function Card({ item, onSelect }) {
  return (
    <article className="card">
      <img src={item.image} alt={item.title} />
      <p>{item.title}</p>
      <button type="button" onClick={() => onSelect(item.id)}>
        Select {item.title}
      </button>
      <button
        type="button"
        onClick={() => toggleFavorite(item.id)}
        aria-label={`${item.isFavorite ? 'Remove from' : 'Add to'} favorites: ${item.title}`}
        aria-pressed={item.isFavorite}
      >
        ♥
      </button>
    </article>
  )
}
```

If the entire card needs to be clickable, consider a single wrapping `<a>` (if it navigates) or placing interactive elements inside a non-interactive container with a primary action button.

Reference: [WCAG 2.1.1 Keyboard](https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html)
