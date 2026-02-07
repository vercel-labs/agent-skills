---
title: Public TypeScript Surfaces Must Have Explicit Types — No any
impact: MEDIUM
impactDescription: prevents type safety erosion across module boundaries
tags: boundaries, typescript, any, type-safety
---

## Public TypeScript Surfaces Must Have Explicit Types — No any

**Impact: MEDIUM (prevents type safety erosion across module boundaries)**

Public TypeScript surfaces (exported functions, class methods, interfaces) MUST
have explicit types. `any` is never allowed on public APIs. It defeats the
purpose of TypeScript and allows invalid data to flow unchecked across module
boundaries.

**Incorrect (any in public API):**

```typescript
// libs/guard/ingestion/domain/src/index.ts
// ❌ any in exported function
export function processEvent(event: any): any {
  return { id: event.id, hash: computeHash(event) };
}

// ❌ any in exported interface
export interface EventRepository {
  findById(id: string): Promise<any>;
  create(event: any): Promise<void>;
}

// ❌ Implicit any via missing return type
export function parsePayload(raw) {  // implicit any parameter
  return JSON.parse(raw);            // returns any
}
```

**Correct (explicit types everywhere):**

```typescript
// libs/guard/ingestion/domain/src/index.ts
// ✅ Explicit input and output types
export function processEvent(event: ValidatedEventInput): ProcessedEvent {
  return { id: event.id, hash: computeHash(event) };
}

// ✅ Typed interface
export interface EventRepository {
  findById(id: string): Promise<StoredEvent | undefined>;
  create(event: BufferedEvent): Promise<void>;
}

// ✅ Explicit parameter and return types
export function parsePayload(raw: string): Record<string, unknown> {
  return JSON.parse(raw) as Record<string, unknown>;
}
```

**When you need flexibility, use `unknown` instead of `any`:**

```typescript
// ❌ any — skips type checking
function handleData(data: any) {
  data.foo.bar.baz(); // No error, crashes at runtime
}

// ✅ unknown — requires type narrowing
function handleData(data: unknown) {
  if (typeof data === 'object' && data !== null && 'foo' in data) {
    // Type-safe access after narrowing
  }
}
```

Reference: [TypeScript — unknown vs any](https://www.typescriptlang.org/docs/handbook/2/types-from-types.html)
