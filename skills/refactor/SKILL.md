---
name: refactor
description: Refactor code to make architecture and implementation simpler using TDD methodology. Preserves functionality through tests.
author: AINA Project
version: 1.0.0
tags: [refactoring, tdd, code-quality, simplification]
---

# Refactor Skill

## Overview

This skill refactors code to make architecture and implementation simpler while **preserving all functionality**. It follows Test-Driven Development (TDD) methodology.

**Core Principles:**
- Functionality is preserved through comprehensive tests
- Changes are made in small, incremental iterations
- Each iteration follows a full TDD cycle (Red-Green-Refactor)
- All tests, type checks, and lint checks must pass before completion

## When to Use

Invoke this skill when:
- Code has become complex or difficult to understand
- Functions or classes have multiple responsibilities
- Code smells are detected (duplication, long functions, etc.)
- Architecture needs simplification
- You want to improve maintainability without changing behavior

## Prerequisites

**Before starting refactoring:**

1. **Tests must exist**: If no tests exist for the code, request them first
2. **Tests must pass**: Verify `uv run pytest` passes before starting
3. **Understand the code**: Read and understand what the code does
4. **Create a backup**: Optionally commit current state before changes

## Refactoring Process

### Phase 1: Analysis

1. **Read the target code** thoroughly to understand its purpose
2. **Identify code smells**:
   - Functions with multiple responsibilities
   - Duplicated code
   - Magic numbers or hardcoded values
   - Complex conditional logic
   - Poor naming or unclear intent
   - Missing type hints
   - Business logic mixed with I/O
3. **List refactoring opportunities** (wait for user approval before implementing)

### Phase 2: TDD Cycle for Each Change

For **each discrete refactoring iteration**:

#### 🔴 RED (if applicable)
- If adding new simplified behavior, write a failing test first
- If only simplifying existing code, skip to GREEN phase
- Run tests to confirm the new test fails

#### 🟢 GREEN
- Make **minimal changes** to pass the tests
- Focus on making tests pass, not perfection
- Run `uv run pytest` after each small change
- Iterate until tests are green

#### 🔵 REFACTOR
- Apply simplification while keeping tests green
- Extract functions, improve naming, reduce complexity
- **Continuously run tests** after each small change
- Never batch multiple changes - one small step at a time

#### ✅ VERIFY
- Run `uv run pytest` to ensure all tests pass
- Run `uv run ruff check src/` for lint checks
- Run `uv run mypy src/` for type checks
- If any check fails, fix and repeat verification

### Phase 3: Final Verification

After all refactoring iterations complete:

```bash
# Run full CI pipeline until everything passes
bin/ci-local
```

This runs:
1. Lint checks (`ruff`)
2. Static type checks (`mypy`)
3. Tests with coverage (`pytest`)

**Repeat** until all checks pass with no errors.

## Code Smells to Detect

| Smell | Detection | Refactoring |
|-------|-----------|-------------|
| Long function | >20 lines or multiple responsibilities | Extract smaller functions |
| Duplicated code | Similar logic in multiple places | Extract to shared function |
| Magic numbers | Hardcoded numeric values | Replace with named constants |
| Poor naming | Unclear variable/function names | Use descriptive names |
| Mutable defaults | Default args like `[]` or `{}` | Use `None` and initialize inside |
| Mixed concerns | Business logic with I/O | Separate into layers |
| Missing types | Functions without type hints | Add comprehensive type hints |
| Complex conditionals | Nested if/else logic | Use guard clauses or pattern matching |
| Imperative style | Manual loops, mutations | Use functional patterns |

## Refactoring Patterns

### Single Responsibility Principle

Extract functions so each has one clear purpose:

```python
# Before - Multiple responsibilities
def process_order(items, tax_rate, user):
    subtotal = sum(item.price for item in items)
    tax = subtotal * tax_rate
    total = subtotal + tax
    send_email(user.email, f"Order total: {total}")
    update_inventory(items)
    return total

# After - Single responsibilities
def calculate_subtotal(items: list[Item]) -> float:
    return sum(item.price for item in items)

def calculate_tax(subtotal: float, tax_rate: float) -> float:
    return subtotal * tax_rate

def calculate_total(items: list[Item], tax_rate: float) -> float:
    subtotal = calculate_subtotal(items)
    return subtotal + calculate_tax(subtotal, tax_rate)
```

### Replace Magic Numbers with Constants

```python
# Before
def calculate_total(items):
    return sum(item.price for item in items) * 1.08

# After
DEFAULT_TAX_RATE = 0.08

def calculate_total(items: list[Item]) -> float:
    return sum(item.price for item in items) * (1 + DEFAULT_TAX_RATE)
```

### Prefer Functional Patterns

```python
# Before - Imperative
result = []
for item in items:
    if item.is_active:
        result.append(item.price)

# After - Functional
def get_active_item_prices(items: list[Item]) -> Iterator[float]:
    return (item.price for item in items if item.is_active)
```

### Separate Business Logic from I/O

```python
# Before - Mixed concerns
def process_user(user_id):
    user = db.query(User).get(user_id)
    formatted = f"Name: {user.name}, Email: {user.email}"
    print(formatted)

# After - Separated
def format_user_info(user: User) -> str:
    return f"Name: {user.name}, Email: {user.email}"

def display_user(user_id: int) -> None:
    user = db.query(User).get(user_id)
    print(format_user_info(user))
```

## Verification Commands

```bash
# Run tests
uv run pytest

# Run specific test file
uv run pytest tests/agents/test_email.py

# Run tests with coverage
uv run pytest --cov=src --cov-report=term-missing

# Run lint checks
uv run ruff check src/

# Run type checks
uv run mypy src/

# Run all checks (full CI pipeline)
bin/ci-local
```

## Examples

### Example 1: Extract Function for Single Responsibility

**Iteration 1:**
1. 🔴 Write test for extracted function behavior
2. 🟢 Extract function and make test pass
3. 🔵 Verify all existing tests still pass
4. ✅ Run `bin/ci-local`

**Iteration 2:**
1. Extract next piece of logic
2. Run tests after extraction
3. Continue until all responsibilities separated

### Example 2: Replace Magic Numbers

**Iteration 1:**
1. Identify magic number (e.g., `0.08` for tax rate)
2. Add constant: `DEFAULT_TAX_RATE = 0.08`
3. Replace usage with constant
4. Run tests to verify

**Iteration 2:**
1. Find next magic number
2. Extract to constant
3. Run tests to verify
4. Continue until no magic numbers remain

## Important Notes

1. **Never skip tests**: Always run tests after each change
2. **One change at a time**: Make smallest possible changes
3. **Functionality preserved**: If tests pass, behavior is preserved
4. **Ask for approval**: List opportunities, wait before implementing
5. **Don't remove code**: Never remove unrelated functionality


