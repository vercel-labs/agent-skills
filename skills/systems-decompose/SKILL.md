---
name: systems-decompose
description: Systematic feature decomposition for React/Next.js applications. Use before implementing new features to map data flow, define interfaces, enumerate error states, and clarify boundaries. Prevents architectural drift and ensures robust implementations. Triggers on feature planning, architecture decisions, or when breaking down complex tasks.
license: CC-BY-SA-4.0
metadata:
  author: Sunny Patneedi
  version: "1.0.0"
  source: https://github.com/sunnypatneedi/claude-starter-kit
---

# Systems Decomposition

A systematic approach to decomposing features before implementation. Complements Vercel's React best practices by ensuring solid architecture from the start.

## When to Apply

Use this skill **before** writing code when:
- Planning new features or API endpoints
- Breaking down complex user stories
- Making architectural decisions
- Designing component interfaces
- Planning data fetching strategies
- Integrating external services

**Perfect for**: Next.js API routes, React Server Components, data mutations, external integrations.

## Why This Matters

Without decomposition, you risk:
- ❌ Undefined error states discovered in production
- ❌ Unclear boundaries leading to tight coupling
- ❌ Missing edge cases causing bugs
- ❌ Waterfall requests (see Vercel's `async-` rules)
- ❌ Poor resilience when dependencies fail

With decomposition, you get:
- ✅ Clear interfaces with type safety
- ✅ All error states handled upfront
- ✅ Parallel operations identified early
- ✅ Resilient failure handling
- ✅ Better architecture, less refactoring

## The Decomposition Framework

### 1. Context Setting

**Questions to answer:**
- What feature are we building?
- Who triggers it? (User action, webhook, cron, system event)
- What's the desired outcome?
- What systems are involved?

**Example (Next.js API route):**
```
Feature: Send marketing email to user
Trigger: User clicks "Subscribe" button
Outcome: User added to mailing list, confirmation sent
Systems: Database, Email API (SendGrid), User auth
```

### 2. Data Flow Mapping

Map the complete flow from trigger to output:

```
[Trigger] → [Input] → [Validation] → [Transform] → [Side Effects] → [Output]
```

**For each step, define:**

**Input:**
- What data comes in?
- What format? (JSON, FormData, query params)
- Required vs optional fields

**Validation:**
- Schema validation (use Zod for type safety)
- Business rules (e.g., email not already subscribed)
- Authorization checks

**Transform:**
- What processing happens?
- What external APIs are called?
- Can operations run in parallel? (Use Promise.all() per Vercel's `async-parallel`)

**Side Effects:**
- Database writes
- External API calls (SendGrid, Stripe, etc.)
- Cache updates
- Event emissions

**Output:**
- Success response format
- Error response format
- Status codes

### 3. Interface Contracts

Define explicit schemas using Zod (works with Next.js validation):

**Input Schema:**
```typescript
import { z } from 'zod';

const SubscribeInput = z.object({
  email: z.string().email(),
  firstName: z.string().min(1),
  marketingConsent: z.boolean(),
});

type SubscribeInput = z.infer<typeof SubscribeInput>;
```

**Output Schema:**
```typescript
const SubscribeOutput = z.object({
  success: z.boolean(),
  subscriptionId: z.string().optional(),
  error: z.object({
    code: z.enum(['ALREADY_SUBSCRIBED', 'INVALID_EMAIL', 'SERVICE_UNAVAILABLE']),
    message: z.string(),
  }).optional(),
});
```

### 4. Error Enumeration

List **ALL** possible errors upfront:

**Validation Errors:**
- `INVALID_EMAIL` - Email format invalid
- `MISSING_CONSENT` - Marketing consent not provided

**Business Logic Errors:**
- `ALREADY_SUBSCRIBED` - Email already in database
- `BLOCKED_DOMAIN` - Corporate email not allowed

**External Service Errors:**
- `EMAIL_SERVICE_DOWN` - SendGrid API unavailable
- `EMAIL_RATE_LIMIT` - SendGrid rate limit hit

**System Errors:**
- `DATABASE_ERROR` - Database connection failed
- `TIMEOUT` - Operation exceeded 10s limit

**For each error:**
- HTTP status code
- User-facing message
- Retry strategy (yes/no)
- Logging priority

### 5. Boundary Clarification

Define what this component **owns** vs **uses**:

**Owns:**
- Input validation
- Subscription logic
- Error response formatting

**Does NOT Own:**
- Email sending (SendGrid owns this)
- User authentication (Next-Auth owns this)
- Email template rendering (template service owns this)

**Integration Points:**
- SendGrid API (async, can fail)
- Database (async, can fail)
- Auth middleware (sync, can fail)

### 6. Dependency Analysis

For each external dependency:

**SendGrid API:**
- **Type**: HTTP API (async)
- **Failure mode**: Timeout, 5xx errors
- **Recovery**: Retry with exponential backoff (use Vercel's resilience patterns)
- **Fallback**: Queue for later processing
- **Circuit breaker**: After 3 failures, stop trying for 1 minute

**Database:**
- **Type**: PostgreSQL (async)
- **Failure mode**: Connection error, query timeout
- **Recovery**: Retry once, then fail
- **Fallback**: Return degraded service message
- **Transaction**: Yes (ensure atomicity)

### 7. Parallel Operations

Identify operations that can run concurrently (Vercel's `async-parallel` pattern):

**Can run in parallel:**
```typescript
const [user, existingSubscription] = await Promise.all([
  db.user.findUnique({ where: { id: userId } }),
  db.subscription.findUnique({ where: { email } }),
]);
```

**Must run sequentially:**
```typescript
// Must check first, then create
const existing = await db.subscription.findUnique({ where: { email } });
if (existing) throw new AlreadySubscribedError();
const subscription = await db.subscription.create({ data: { email } });
```

## Next.js Specific Patterns

### Server Components

**Decompose data fetching:**
```typescript
// Good: Parallel fetches at boundary
async function DashboardPage() {
  const [user, stats, activity] = await Promise.all([
    getUser(),
    getStats(),
    getActivity(),
  ]);

  return <Dashboard user={user} stats={stats} activity={activity} />;
}
```

**Define Suspense boundaries:**
```typescript
// Decompose into independent Suspense boundaries
<Suspense fallback={<UserSkeleton />}>
  <UserProfile />
</Suspense>
<Suspense fallback={<StatsSkeleton />}>
  <Stats />
</Suspense>
```

### API Routes

**Decompose error handling:**
```typescript
export async function POST(request: Request) {
  try {
    // 1. Parse & validate input
    const body = await request.json();
    const input = SubscribeInput.parse(body);

    // 2. Check business rules
    const existing = await checkExisting(input.email);
    if (existing) {
      return NextResponse.json(
        { error: { code: 'ALREADY_SUBSCRIBED', message: 'Already subscribed' } },
        { status: 409 }
      );
    }

    // 3. Execute (with parallel ops)
    const [subscription, emailResult] = await Promise.all([
      createSubscription(input),
      sendWelcomeEmail(input.email),
    ]);

    // 4. Return success
    return NextResponse.json({ success: true, subscriptionId: subscription.id });

  } catch (error) {
    // Enumerate all error types
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: { code: 'INVALID_INPUT', message: 'Validation failed' } },
        { status: 400 }
      );
    }
    if (error instanceof SendGridError) {
      // Log but don't block subscription
      logger.error('SendGrid failed', { error });
      return NextResponse.json({ success: true, emailFailed: true });
    }
    // Unexpected errors
    logger.error('Unexpected error', { error });
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Something went wrong' } },
      { status: 500 }
    );
  }
}
```

## Checklist

Before implementing, ensure you have:

- [ ] **Context**: Clear problem statement and desired outcome
- [ ] **Data Flow**: Mapped trigger → input → validation → transform → output
- [ ] **Interfaces**: Zod schemas for inputs and outputs
- [ ] **Errors**: Enumerated ALL possible error states with status codes
- [ ] **Boundaries**: Defined ownership and integration points
- [ ] **Dependencies**: Analyzed each external service with failure modes
- [ ] **Parallelism**: Identified operations that can use Promise.all()
- [ ] **Resilience**: Circuit breakers and retry logic for external services

## Integration with Vercel Best Practices

This decomposition approach complements Vercel's React best practices:

**Eliminates Waterfalls** → Decomposition identifies parallel operations early
**Bundle Optimization** → Clear boundaries enable code splitting
**Server-Side Performance** → Plan async operations before implementing
**Client-Side Fetching** → Design loading states and error boundaries upfront
**Re-render Optimization** → Define component boundaries and data dependencies

## Examples

See the `examples/` directory for complete decompositions:
- `examples/newsletter-subscription.md` - API route with external service
- `examples/dashboard-page.md` - Server Component with parallel fetches
- `examples/payment-flow.md` - Multi-step process with Stripe integration

## Resources

- [Vercel React Best Practices](../react-best-practices/) - Apply after decomposition
- [Next.js Data Fetching](https://nextjs.org/docs/app/building-your-application/data-fetching)
- [Zod for Type Safety](https://zod.dev/)
- [Error Handling Patterns](https://www.patterns.dev/posts/error-handling)

---

**Attribution:** Based on systems thinking principles from [Claude Starter Kit](https://github.com/sunnypatneedi/claude-starter-kit) by Sunny Patneedi and Contributors. Licensed under CC-BY-SA-4.0.
