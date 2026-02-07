---
title: External Calls Must Use Typed Clients with Timeouts
impact: MEDIUM
impactDescription: prevents unbounded I/O and silent failures
tags: boundaries, http, timeout, typed-clients
---

## External Calls Must Use Typed Clients with Timeouts

**Impact: MEDIUM (prevents unbounded I/O and silent failures)**

Every external call (HTTP, queues, databases) MUST be time-bound and go through
shared abstractions. Outbound HTTP calls MUST use typed clients with timeouts
and retries. Never use raw `fetch` or `http` without wrapping.

**Incorrect (raw fetch without timeout):**

```typescript
// ❌ No timeout, no retry, no typing
async function getUser(id: string) {
  const response = await fetch(`https://api.example.com/users/${id}`);
  const data = await response.json();
  return data; // unknown type
}
```

If the upstream service hangs, this call hangs forever, blocking the event loop
and eventually cascading into a full service outage.

**Correct (typed client with timeout and retry):**

```typescript
// ✅ Typed client with timeout and structured error handling
import { setTimeout } from 'node:timers/promises';

interface UserApiClient {
  getUser(id: string): Promise<User>;
}

class HttpUserApiClient implements UserApiClient {
  constructor(
    private readonly baseUrl: string,
    private readonly timeoutMs: number = 5000,
  ) {}

  async getUser(id: string): Promise<User> {
    const controller = new AbortController();
    const timeout = setTimeout(this.timeoutMs).then(() => controller.abort());

    const response = await fetch(`${this.baseUrl}/users/${id}`, {
      signal: controller.signal,
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new ExternalServiceError({
        code: 'USER_API_ERROR',
        status: response.status,
      });
    }

    return response.json() as Promise<User>;
  }
}
```

**Rules:**
- All external calls must have explicit timeouts
- HTTP clients must be typed (input and output types)
- Use `AbortController` / `AbortSignal` for timeout control
- Wrap external service errors in domain-appropriate error types

Reference: [Node.js — fetch with AbortSignal](https://nodejs.org/api/globals.html#fetch)
