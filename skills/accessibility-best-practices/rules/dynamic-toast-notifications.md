---
title: Make Toast and Snackbar Notifications Accessible
impact: HIGH
impactDescription: Timed auto-dismissing toasts can be missed by screen readers and low-vision users
tags: dynamic, toast, notifications, alert, screen-reader, timing
wcag: "4.1.3 Level AA, 2.2.1 Level A"
---

## Make Toast and Snackbar Notifications Accessible

**Impact: HIGH (Timed auto-dismissing toasts can be missed by screen readers and low-vision users)**

Toast notifications must be announced to screen readers via `role="status"` or `role="alert"`, must not disappear before screen readers can read them, and should be pausable/dismissible. Error toasts should use `role="alert"` (assertive); success/info toasts should use `role="status"` (polite).

**Incorrect (toast with no a11y considerations):**

```tsx
function Toast({ message, type }) {
  return (
    // Not in a live region — screen reader doesn't know it appeared
    // Auto-dismisses in 3s — may not be read in time
    <div className={`toast toast-${type}`}>
      {message}
      <button onClick={dismiss}>×</button>
    </div>
  )
}
```

**Correct (accessible toast notification):**

```tsx
function Toast({ message, type, onDismiss }) {
  return (
    <div
      role={type === 'error' ? 'alert' : 'status'}
      aria-live={type === 'error' ? 'assertive' : 'polite'}
      aria-atomic="true"
      className={`toast toast-${type}`}
    >
      <p>{message}</p>
      <button onClick={onDismiss} aria-label="Dismiss notification">
        <XIcon aria-hidden="true" />
      </button>
    </div>
  )
}

// Toast container — always in DOM, receives toasts dynamically
function ToastContainer({ toasts }) {
  return (
    <section aria-label="Notifications" className="toast-container">
      {toasts.map((t) => (
        <Toast key={t.id} {...t} />
      ))}
    </section>
  )
}
```

Give auto-dismiss timers at least 5 seconds, and pause the timer on hover/focus. For critical error messages, don't auto-dismiss at all — require explicit user action.

Reference: [WCAG 4.1.3 Status Messages](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html)
