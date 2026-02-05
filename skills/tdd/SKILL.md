---
name: TDD
description: Guide Test-Driven Development workflow (Red-Green-Refactor) for new features, bug fixes, and refactoring. Identifies test improvement opportunities and applies pytest best practices.
author: AINA Project
version: 2.0.0
tags: [TDD, test driven development, testing, red-green-refactor, pytest, code-quality, coverage]
---

# Test-Driven Development Skill

## Overview

This skill guides the complete Test-Driven Development (TDD) workflow using the Red-Green-Refactor cycle. It handles new features, bug fixes, legacy code, and identifies opportunities to refactor existing tests.

**Core Principles:**
- **Test First**: Never write production code without a failing test
- **One Test at a Time**: Focus on one failing test before moving to the next
- **Baby Steps**: Make the smallest possible changes to move from red to green
- **Continuous Improvement**: Regularly identify and implement test quality improvements
- **Fast Feedback**: Run tests frequently to maintain development flow

## When to Use

Invoke this skill when:
- Implementing a new feature or function
- Fixing a bug (write reproducing test first)
- Adding tests to legacy code
- Reviewing code for test refactoring opportunities
- Improving existing test quality and organization

## Development Scenarios

### 1. New Feature Development

Follow the Red-Green-Refactor cycle:

#### 🔴 RED - Write a Failing Test

1. **Understand requirements** before writing any code
2. **Write the smallest test** that defines the desired behavior
3. **Run the test** to confirm it fails for the expected reason
4. **Do NOT write** any production code until you have a failing test

```bash
# Write the test first
# Then run it to confirm failure
uv run pytest tests/feature/test_new_function.py -v
```

#### 🟢 GREEN - Make the Test Pass

1. **Write minimal production code** to make the test pass
2. **Focus on making it work**, not making it perfect
3. **Avoid over-engineering** at this stage
4. **Run the test** to confirm it passes
5. **Iterate** until all tests pass

```bash
# Run the specific test
uv run pytest tests/feature/test_new_function.py::test_new_function -v

# Run full suite when green
uv run pytest
```

#### 🔵 REFACTOR - Improve the Code

1. **Clean up both test and production code**
2. **Remove duplication** and improve design
3. **Apply design patterns** and best practices
4. **Ensure all tests still pass** after refactoring
5. **List refactoring opportunities** (see Refactoring Opportunities section)

```bash
# Verify after refactoring
uv run pytest --cov=src --cov-report=term-missing
```

### 2. Bug Fixes

**Critical**: Never fix a bug without writing a test first.

1. **Write a test that reproduces the bug**
2. **Verify the test fails** (Red phase)
3. **Fix the bug** in the implementation
4. **Run tests**, iterate until green
5. **Check for refactoring opportunities**

```python
# Example: Bug fix workflow
# RED - Write failing test that reproduces bug
def test_calculate_total_with_negative_price_raises_error():
    items = [Item("Coke", -1.50)]
    with pytest.raises(ValueError, match="Price cannot be negative"):
        calculate_total(items)

# Verify it fails first
# Then implement fix
# Then verify test passes
```

### 3. Legacy Code

When adding tests to untested code:

1. **Write characterization tests** that capture current behavior
2. **Run tests to establish baseline**
3. **Make small changes** with test coverage
4. **Refactor incrementally** with test safety net

```bash
# Start with characterization tests
uv run pytest tests/legacy/test_old_module.py -v

# Add coverage incrementally
uv run pytest --cov=src/legacy_module --cov-report=term-missing
```

## Test Refactoring Opportunities

After each TDD cycle (or when reviewing existing tests), search for these improvement opportunities:

### Identify Opportunities

Check for:

- **Redundant tests**: Similar test logic that can be consolidated with parametrization
- **Duplicate fixtures**: Common test data defined in multiple files
- **Missing parametrization**: Multiple tests for similar scenarios
- **File organization**: Tests that could be better consolidated
- **Best practice violations**: Testing private methods, vague assertions, etc.
- **Slow tests**: Tests that could be optimized or marked with `@pytest.mark.slow`
- **Hardcoded values**: Test data that should use fixtures or factories

### Refactoring Process

When refactoring existing tests:

1. **Capture baseline metrics**:
   ```bash
   bin/ci-local 2>&1 | tee baseline.txt
   grep "passed" baseline.txt  # Note test count
   grep "Cover" baseline.txt   # Note coverage %
   ```

2. **Prioritize changes** by impact and isolation:
   - High impact, isolated changes first (parametrization, shared fixtures)
   - Medium impact changes (consolidating test files)
   - Complex changes last (large file reorganization)

3. **Apply refactoring patterns** (see Patterns section)

4. **Verify coverage maintained or improved**:
   ```bash
   uv run pytest --cov=src --cov-report=term-missing
   ```

## Refactoring Patterns

### Parametrization

Replace multiple similar tests with a single parametrized test.

**Before**:
```python
def test_create_model_groq():
    """Test creating a Groq model."""
    with patch("agno.models.groq.Groq", create=True):
        result = create_model(ModelProvider.GROQ, "llama-3.3-70b")
        assert result is not None

def test_create_model_openrouter():
    """Test creating an OpenRouter model."""
    with patch("agno.models.openrouter.OpenRouter", create=True):
        result = create_model(ModelProvider.OPENROUTER, "deepseek/r1")
        assert result is not None
```

**After**:
```python
@pytest.mark.parametrize("provider,model_class,base_id", [
    (ModelProvider.GROQ, "agno.models.groq.Groq", "llama-3.3-70b"),
    (ModelProvider.OPENROUTER, "agno.models.openrouter.OpenRouter", "deepseek/r1"),
], ids=["groq", "openrouter"])
def test_create_model_for_providers(provider, model_class, base_id):
    """Test creating models for all providers."""
    with patch(model_class, create=True):
        result = create_model(provider, base_id)
        assert result is not None
```

### Shared Fixtures

Extract duplicated fixtures to `tests/conftest.py`.

**Before** (duplicated in multiple files):
```python
# In test_file1.py
@pytest.fixture
def sample_token():
    return "123456789:ABCdefGHIjklMNOpqrsTUVwxyz"

# In test_file2.py
@pytest.fixture
def sample_token():
    return "123456789:ABCdefGHIjklMNOpqrsTUVwxyz"
```

**After** (in `tests/conftest.py`):
```python
@pytest.fixture
def sample_token() -> str:
    """Provide sample Telegram bot token for testing."""
    return "123456789:ABCdefGHIjklMNOpqrsTUVwxyz"
```

### Custom Markers

Use markers for test categorization.

```python
@pytest.mark.slow
def test_heavy_computation():
    result = perform_heavy_calculation()
    assert result > 0

@pytest.mark.integration
def test_database_connection():
    db = connect_to_database()
    assert db.is_connected()

# Run fast tests only: pytest -m "not slow"
# Run integration tests: pytest -m integration
```

## Verification Checklist

After completing TDD cycles or test refactoring, verify:

- [ ] **All tests pass**: `uv run pytest`
- [ ] **Coverage maintained or improved**: `uv run pytest --cov=src --cov-report=term-missing`
- [ ] **No mypy errors**: `uv run mypy src/`
- [ ] **No ruff errors**: `uv run ruff check src/`
- [ ] **Tests execute faster**: `uv run pytest --durations=10`

For complete verification, run the full CI pipeline:

```bash
bin/ci-local
```

## Best Practices

### Test Writing

- **Use descriptive test names**: `test_<function>_<scenario>_<expected_result>`
- **Focus on behavior**, not implementation details
- **Don't test private methods**
- **Use meaningful assertions** with clear error messages
- **Keep tests independent** and isolated
- **Avoid A/A/A comments** - test structure should be self-evident

### Test Organization

- **Place fixtures first** at the top of test files
- **Mirror source structure** in test directory layout
- **Group related tests** in classes or modules
- **Use appropriate fixture scopes** (function, class, module, session)
- **Parametrized tests last** in the file

### Code Quality

- **Use type hints** for all test function parameters
- **Use f-strings** for string formatting
- **Follow PEP 8** naming conventions
- **Use Google-style docstrings** for test classes
- **Never use mutable default arguments**

## Verification Commands

```bash
# Run all tests
uv run pytest

# Run specific test file
uv run pytest tests/models/test_registry.py -v

# Run specific test
uv run pytest tests/test_file.py::TestClass::test_function -vv

# Run with coverage
uv run pytest --cov=src --cov-report=term-missing --cov-report=html

# Run full CI pipeline
bin/ci-local

# Check test execution time
uv run pytest --durations=10

# Run fast tests only
uv run pytest -m "not slow"
```

## Important Notes

1. **Test First**: Always write tests before implementation
2. **Verify Red Phase**: Confirm tests fail before writing implementation
3. **One at a Time**: Focus on one failing test before moving to the next
4. **Maintain Coverage**: Coverage must never decrease during refactoring
5. **Small Changes**: Make incremental changes and run tests frequently
6. **List Refactoring Opportunities**: After green, identify but wait for user request before implementing

## Expected Outcomes

Following TDD methodology:

| Practice | Outcome |
|----------|---------|
| Test-first development | Better design, fewer bugs |
| Red-Green-Refactor cycle | Maintainable, clean code |
| One test at a time | Faster feedback, easier debugging |
| Test refactoring | 15-25% reduction in test redundancy |
| Coverage maintenance | Consistent or improved test coverage |

