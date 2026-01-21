# Systems Decomposition Skill

Systematic feature decomposition for React/Next.js applications. Use **before** implementing to ensure solid architecture and prevent common pitfalls.

## Quick Start

```bash
npx add-skill vercel-labs/agent-skills#systems-decompose
```

Or install manually:
```bash
cp -r skills/systems-decompose ~/.claude/skills/
```

## What It Does

Guides you through decomposing features into:
- **Data flow maps** - Trigger → Input → Validation → Transform → Output
- **Interface contracts** - Zod schemas for type safety
- **Error enumeration** - ALL possible error states defined upfront
- **Boundary clarification** - What this component owns vs uses
- **Dependency analysis** - Failure modes and recovery strategies
- **Parallel operations** - Identify Promise.all() opportunities

## Why Use This

**Before decomposition:**
- ❌ Discover errors in production
- ❌ Unclear boundaries cause tight coupling
- ❌ Miss edge cases
- ❌ Create waterfall requests
- ❌ Poor resilience when dependencies fail

**After decomposition:**
- ✅ Handle all error states upfront
- ✅ Clear interfaces with type safety
- ✅ Identify parallel operations early
- ✅ Build resilient systems
- ✅ Better architecture, less refactoring

## Perfect For

- Next.js API routes
- React Server Components
- Data fetching strategies
- External service integrations
- Complex user flows
- Payment processing
- Multi-step forms

## Complements Vercel Best Practices

- **Eliminates Waterfalls** → Identifies parallel operations early
- **Bundle Optimization** → Clear boundaries enable code splitting
- **Server Performance** → Plans async operations before implementing
- **Error Handling** → Enumerates all error states upfront

## Example Usage

**Scenario:** Building a newsletter subscription API route

```typescript
// 1. Context
Feature: Subscribe user to newsletter
Trigger: User submits email form
Outcome: User added to SendGrid, confirmation email sent

// 2. Data Flow
[Form Submit]
  → [Validate email/consent]
  → [Check not already subscribed]
  → [Promise.all: Create DB record + Send email]
  → [Return success with subscription ID]

// 3. Error Enumeration
INVALID_EMAIL (400) - Email format invalid
MISSING_CONSENT (400) - Marketing consent required
ALREADY_SUBSCRIBED (409) - Email already exists
EMAIL_SERVICE_DOWN (503) - SendGrid unavailable
DATABASE_ERROR (500) - Connection failed
```

See [`SKILL.md`](./SKILL.md) for complete framework and Next.js-specific patterns.

## Integration with Other Skills

Use in sequence:
1. **systems-decompose** (this skill) - Plan architecture
2. **react-best-practices** - Implement following performance patterns
3. **web-design-guidelines** - Ensure accessible, performant UI

## Attribution

Based on systems thinking principles from [Claude Starter Kit](https://github.com/sunnypatneedi/claude-starter-kit) by Sunny Patneedi and Contributors.

Licensed under **CC-BY-SA-4.0** to ensure improvements flow back to the community.

## Contributing

Found this useful? Consider:
- ⭐ Star this repo
- 🐛 Report issues
- 💡 Suggest improvements
- 🤝 Contribute examples

---

**Learn more**: [Full Documentation](./SKILL.md) | [Examples](./examples/)
