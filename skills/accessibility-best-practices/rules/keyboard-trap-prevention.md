---
title: Never Trap Keyboard Focus
impact: CRITICAL
impactDescription: Focus traps completely strand keyboard users with no way to navigate away
tags: keyboard, focus-trap, navigation, blocking
wcag: "2.1.2 Level A"
---

## Never Trap Keyboard Focus

**Impact: CRITICAL (Focus traps completely strand keyboard users with no way to navigate away)**

Users must always be able to move focus away from any component using standard keyboard navigation (Tab, Shift+Tab, Escape). The only exception is intentional focus trapping in modal dialogs — and even then, Escape must close the dialog and release focus.

**Incorrect (accidental focus trap in custom widget):**

```tsx
function CustomDropdown({ options }) {
  return (
    <div
      tabIndex={0}
      onKeyDown={(e) => {
        // Prevents Tab from leaving — user is stuck
        if (e.key === 'Tab') {
          e.preventDefault()
        }
        // Arrow keys move selection but there's no way out
        if (e.key === 'ArrowDown') {
          selectNext()
        }
      }}
    >
      {options.map((opt) => (
        <div key={opt.value}>{opt.label}</div>
      ))}
    </div>
  )
}
```

**Correct (keyboard users can exit naturally):**

```tsx
function CustomDropdown({ options, onClose }) {
  return (
    <div
      role="listbox"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          onClose()
        }
        if (e.key === 'ArrowDown') {
          e.preventDefault() // Prevent scroll, but don't block Tab
          selectNext()
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault()
          selectPrev()
        }
        // Tab is NOT intercepted — natural focus movement preserved
      }}
    >
      {options.map((opt) => (
        <div key={opt.value} role="option" aria-selected={opt.selected}>
          {opt.label}
        </div>
      ))}
    </div>
  )
}
```

Only prevent default on keys you're handling (arrow keys for navigation within the widget). Never intercept Tab. For modals, see the `focus-modal-trap` rule.

Reference: [WCAG 2.1.2 No Keyboard Trap](https://www.w3.org/WAI/WCAG22/Understanding/no-keyboard-trap.html)
