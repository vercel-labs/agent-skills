# Example: Newsletter Subscription API

Complete systems decomposition for a Next.js API route that subscribes users to a newsletter.

## 1. Context

**Feature**: Newsletter subscription via API route
**Trigger**: User submits email form on landing page
**Outcome**: User added to database and SendGrid mailing list
**Systems**: Next.js API route, PostgreSQL, SendGrid API, user authentication

## 2. Data Flow

```
[User Form Submit]
  ↓
[POST /api/subscribe]
  ↓
[Validate Input: email, firstName, consent]
  ↓
[Check Auth: Is user logged in?]
  ↓
[Check Business Rules: Already subscribed?]
  ↓
[Parallel Operations]
    ├─→ [Create DB Record]
    └─→ [Add to SendGrid List]
  ↓
[Return Response: Success + Subscription ID]
```

## 3. Interface Contracts

### Input Schema (Zod)

```typescript
import { z } from 'zod';

const SubscribeInput = z.object({
  email: z.string().email('Invalid email format'),
  firstName: z.string().min(1, 'First name required').max(50),
  lastName: z.string().max(50).optional(),
  marketingConsent: z.boolean().refine(val => val === true, {
    message: 'Marketing consent required',
  }),
  source: z.enum(['landing', 'blog', 'checkout']).default('landing'),
});

type SubscribeInput = z.infer<typeof SubscribeInput>;
```

### Output Schema

```typescript
const SubscribeOutput = z.discriminatedUnion('success', [
  // Success response
  z.object({
    success: z.literal(true),
    subscriptionId: z.string(),
    message: z.string(),
  }),
  // Error response
  z.object({
    success: z.literal(false),
    error: z.object({
      code: z.enum([
        'INVALID_INPUT',
        'ALREADY_SUBSCRIBED',
        'BLOCKED_DOMAIN',
        'EMAIL_SERVICE_UNAVAILABLE',
        'DATABASE_ERROR',
        'INTERNAL_ERROR',
      ]),
      message: z.string(),
      details: z.any().optional(),
    }),
  }),
]);
```

## 4. Error Enumeration

| Error Code | HTTP Status | User Message | Retry? | Action |
|------------|-------------|--------------|--------|--------|
| `INVALID_INPUT` | 400 | "Please check your email and try again" | No | Show validation errors |
| `ALREADY_SUBSCRIBED` | 409 | "You're already subscribed!" | No | Redirect to preferences |
| `BLOCKED_DOMAIN` | 403 | "Corporate emails not allowed" | No | Show message |
| `EMAIL_SERVICE_UNAVAILABLE` | 503 | "Service temporarily down. Try again shortly." | Yes | Queue for retry |
| `DATABASE_ERROR` | 500 | "Something went wrong. Please try again." | Yes | Retry once |
| `INTERNAL_ERROR` | 500 | "Unexpected error occurred" | No | Alert team |

## 5. Boundary Clarification

### This Component OWNS:
- Input validation (email format, consent)
- Business logic (check already subscribed)
- Error response formatting
- Retry logic for SendGrid
- Database transaction management

### This Component DOES NOT OWN:
- Email delivery (SendGrid owns this)
- Email template design (Marketing owns this)
- User authentication (NextAuth owns this)
- Database schema (Migrations own this)

### Integration Points:
- **SendGrid API** - Async, can timeout, requires retry
- **Database** - Async, must be transactional
- **Auth Middleware** - Sync, provides user context

## 6. Dependency Analysis

### SendGrid API

**Type**: External HTTP API (async)
**Failure Modes**:
- Network timeout (> 5s)
- Rate limit exceeded (429)
- Service down (5xx)

**Recovery Strategy**:
```typescript
// Retry with exponential backoff
const addToSendGrid = async (email: string, firstName: string) => {
  const maxRetries = 3;
  const baseDelay = 1000;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await sendGridClient.contacts.add({
        email,
        firstName,
        listId: process.env.SENDGRID_LIST_ID,
      });
    } catch (error) {
      if (attempt === maxRetries - 1) throw error;
      await sleep(baseDelay * Math.pow(2, attempt));
    }
  }
};
```

**Circuit Breaker**: After 5 consecutive failures, stop trying for 2 minutes

### PostgreSQL Database

**Type**: Database (async)
**Failure Modes**:
- Connection pool exhausted
- Query timeout (> 10s)
- Constraint violation (unique email)

**Recovery Strategy**:
```typescript
// Use transaction with retry
const createSubscription = async (input: SubscribeInput) => {
  return await db.$transaction(async (tx) => {
    // Check if exists
    const existing = await tx.subscription.findUnique({
      where: { email: input.email },
    });

    if (existing) {
      throw new AlreadySubscribedError();
    }

    // Create new
    return await tx.subscription.create({
      data: {
        email: input.email,
        firstName: input.firstName,
        lastName: input.lastName,
        source: input.source,
        consentedAt: new Date(),
      },
    });
  }, {
    maxWait: 5000, // 5s max wait to start transaction
    timeout: 10000, // 10s transaction timeout
  });
};
```

## 7. Parallel Operations

### Can Run in Parallel

```typescript
// After validation, these are independent:
const [subscription, sendGridContact] = await Promise.all([
  createSubscription(input),
  addToSendGrid(input.email, input.firstName),
]);
```

### Must Run Sequentially

```typescript
// Must validate BEFORE creating
const input = SubscribeInput.parse(body); // First
const subscription = await createSubscription(input); // Then
```

## 8. Complete Implementation

```typescript
// app/api/subscribe/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const SubscribeInput = z.object({
  email: z.string().email(),
  firstName: z.string().min(1).max(50),
  lastName: z.string().max(50).optional(),
  marketingConsent: z.boolean().refine(val => val === true),
  source: z.enum(['landing', 'blog', 'checkout']).default('landing'),
});

export async function POST(request: NextRequest) {
  try {
    // 1. Parse and validate input
    const body = await request.json();
    const input = SubscribeInput.parse(body);

    // 2. Check if already subscribed (business rule)
    const existing = await db.subscription.findUnique({
      where: { email: input.email },
    });

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'ALREADY_SUBSCRIBED',
            message: "You're already subscribed!",
          },
        },
        { status: 409 }
      );
    }

    // 3. Execute operations in parallel
    const [subscription, sendGridResult] = await Promise.all([
      createSubscription(input),
      addToSendGrid(input.email, input.firstName).catch(err => {
        // Log but don't block on SendGrid failure
        logger.error('SendGrid failed, will retry async', { error: err });
        return null;
      }),
    ]);

    // 4. Return success
    return NextResponse.json({
      success: true,
      subscriptionId: subscription.id,
      message: 'Successfully subscribed!',
    });

  } catch (error) {
    // 5. Handle all enumerated error types
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_INPUT',
            message: 'Please check your email and try again',
            details: error.errors,
          },
        },
        { status: 400 }
      );
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      logger.error('Database error', { error });
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'DATABASE_ERROR',
            message: 'Something went wrong. Please try again.',
          },
        },
        { status: 500 }
      );
    }

    // Unexpected errors - alert team
    logger.error('Unexpected subscription error', { error });
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Unexpected error occurred',
        },
      },
      { status: 500 }
    );
  }
}
```

## 9. Testing Checklist

Based on the decomposition, test:

**Happy Path:**
- ✅ Valid input creates subscription
- ✅ User receives welcome email
- ✅ Returns subscription ID

**Validation Errors:**
- ✅ Invalid email format returns 400
- ✅ Missing consent returns 400
- ✅ Missing firstName returns 400

**Business Logic:**
- ✅ Duplicate email returns 409
- ✅ Includes helpful message

**External Service Failures:**
- ✅ SendGrid down doesn't block subscription
- ✅ Logs error for async retry
- ✅ Returns 503 if critical

**Database Failures:**
- ✅ Connection error returns 500
- ✅ Transaction rollback on failure
- ✅ Proper error logging

**Performance:**
- ✅ Parallel operations complete in < 2s
- ✅ No waterfall requests
- ✅ Timeout after 10s

## 10. Monitoring & Alerts

Based on error enumeration:

**Alert on:**
- `DATABASE_ERROR` rate > 1% of requests
- `EMAIL_SERVICE_UNAVAILABLE` for > 5 minutes
- `INTERNAL_ERROR` any occurrence (unexpected)

**Track metrics:**
- P50, P95, P99 latency
- Success rate by error code
- SendGrid retry rate
- Database connection pool usage

---

This decomposition took 10 minutes upfront but saved hours of refactoring and prevented production incidents.
