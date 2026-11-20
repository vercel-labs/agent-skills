---
title: Revoke Blob URLs After Download
impact: MEDIUM
impactDescription: prevents Blob data from being retained in memory
tags: client, blob, object-url, download, memory
---

## Revoke Blob URLs After Download

Every `URL.createObjectURL()` call keeps its backing `Blob` alive until the document unloads or `URL.revokeObjectURL()` is called. Revoke one-off download URLs after triggering the download, especially when users can download large or repeated files.

**Incorrect (Blob URL is never released):**

```typescript
function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
}
```

**Correct (release the URL after the browser handles the click):**

```typescript
function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)

  try {
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.click()
  } finally {
    setTimeout(() => URL.revokeObjectURL(url), 0)
  }
}
```

The deferred cleanup lets the browser consume the click before invalidating the URL. For Blob URLs used by images, previews, or other longer-lived consumers, revoke the previous URL when it is replaced or the consumer unmounts instead of immediately after creation.

Reference: [MDN: URL.revokeObjectURL()](https://developer.mozilla.org/docs/Web/API/URL/revokeObjectURL_static)
