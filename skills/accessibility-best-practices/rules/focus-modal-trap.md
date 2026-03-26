---
title: Trap and Restore Focus in Modals and Dialogs
impact: HIGH
impactDescription: Without focus trapping, keyboard users tab into hidden content behind the modal
tags: focus, modal, dialog, trap, keyboard
wcag: "2.4.3 Level A"
---

## Trap and Restore Focus in Modals and Dialogs

**Impact: HIGH (Without focus trapping, keyboard users tab into hidden content behind the modal)**

When a modal or dialog opens: move focus into it, trap Tab cycling within it, close on Escape, and restore focus to the triggering element on close. Use the native `<dialog>` element which handles most of this automatically.

**Incorrect (modal without focus management):**

```tsx
function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null
  return (
    <div className="overlay">
      <div className="modal">
        {/* No focus trap — Tab escapes to page behind */}
        {/* No focus on open — screen reader stays on trigger */}
        {/* No Escape handling */}
        {children}
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  )
}
```

**Correct (native dialog with proper focus management):**

```tsx
function Modal({ isOpen, onClose, title, children }) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (isOpen) {
      dialog.showModal() // Traps focus, handles Escape, adds backdrop
    } else {
      dialog.close()
    }
  }, [isOpen])

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      aria-labelledby="dialog-title"
    >
      <h2 id="dialog-title">{title}</h2>
      {children}
      <button type="button" onClick={onClose}>
        Close
      </button>
    </dialog>
  )
}
```

The native `<dialog>` element with `showModal()` provides: focus trapping, Escape to close, inert background, backdrop, and focus restoration — all for free. Avoid building custom focus traps when `<dialog>` is available.

Reference: [WAI-ARIA Dialog Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
