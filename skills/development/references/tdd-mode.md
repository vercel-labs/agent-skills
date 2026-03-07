# TDD Mode

Use when test coverage is critical, or when requirements are well-defined but implementation approach is unclear. Replaces the standard Phase 6-7 flow.

## The Red-Green-Refactor Loop

### 1. Red — Write a failing test
```
TaskCreate:
  subject: "Write failing test for [feature]"
  description: "Create test that defines expected behavior. Test MUST fail initially."
```

### 2. Green — Write minimal code to pass
```
TaskCreate:
  subject: "Implement [feature] to pass test"
  description: "Write minimum code to make the test pass. No more."
  addBlockedBy: ["<red-task-id>"]
```

### 3. Refactor — Clean up while keeping tests green
```
TaskCreate:
  subject: "Refactor [feature] implementation"
  description: "Improve code quality. Tests must stay green."
  addBlockedBy: ["<green-task-id>"]
```

### 4. Repeat for each feature/behavior

## Benefits
- Tests define the spec before implementation
- Prevents over-engineering (only write what's needed to pass)
- Immediate feedback loop
- Higher confidence in code correctness
