---
title: Build Forms That Work Without JavaScript
impact: MEDIUM
impactDescription: forms functional before hydration and with JS disabled
tags: server, server-actions, forms, progressive-enhancement, accessibility
---

## Build Forms That Work Without JavaScript

**Impact: MEDIUM (forms functional before hydration and with JS disabled)**

Use the `action` prop on `<form>` to invoke Server Actions natively. This makes forms work before React hydrates and when JavaScript is disabled, improving both performance and accessibility.

**Incorrect (requires JavaScript to submit):**

```tsx
'use client'

import { createComment } from './actions'

function CommentForm() {
  async function handleClick() {
    const input = document.getElementById('comment') as HTMLInputElement
    await createComment(input.value)
  }

  return (
    <div>
      <input id="comment" />
      <button onClick={handleClick}>Post</button>
    </div>
  )
}
```

**Correct (works with or without JavaScript):**

```tsx
import { createComment } from './actions'

function CommentForm() {
  return (
    <form action={createComment}>
      <input name="comment" required />
      <button type="submit">Post</button>
    </form>
  )
}
```

The form submits as a native HTML form before hydration. After hydration, React intercepts the submission and handles it client-side with transition support.

**For actions that need additional data, use hidden inputs:**

```tsx
import { deletePost } from './actions'

function DeleteButton({ postId }: { postId: string }) {
  return (
    <form action={deletePost}>
      <input type="hidden" name="postId" value={postId} />
      <button type="submit">Delete</button>
    </form>
  )
}
```

**Why this matters:**

- Forms work during the gap between page load and hydration
- Users on slow connections or devices can interact immediately
- Screen readers and assistive technologies work with native forms out of the box
- Reduces client-side JavaScript needed for basic form handling

Reference: [React form action](https://react.dev/reference/react-dom/components/form)
