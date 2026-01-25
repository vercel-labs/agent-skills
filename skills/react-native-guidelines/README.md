# React Native Best Practices

A structured repository for creating and maintaining React Native Best Practices optimized for agents and LLMs.

## Structure

- `rules/` - Individual rule files (one per rule)
  - `_sections.md` - Section metadata (titles, impacts, descriptions)
  - `_template.md` - Template for creating new rules
  - `area-description.md` - Individual rule files
- `metadata.json` - Document metadata (version, organization, abstract)
- __`AGENTS.md`__ - Compiled output (generated)

## Rules

### Core Rendering (CRITICAL)
- `rendering-text-in-text-component.md` - Wrap strings in Text components

### Animation Performance (HIGH)
- `animation-gpu-properties.md` - Animate transform/opacity instead of layout
- `scroll-position-no-state.md` - Never track scroll in useState

### List Performance (HIGH)
- `list-performance-callbacks.md` - Hoist callbacks to list root
- `list-performance-object-references.md` - Keep stable object references

### State Management (MEDIUM)
- `react-state-dispatcher.md` - Use dispatch updaters for state
- `react-state-fallback.md` - State should represent user intent only

### React Compiler (MEDIUM)
- `react-compiler-destructure-functions.md` - Destructure functions early
- `react-compiler-reanimated-shared-values.md` - Use .get()/.set() for shared values

### Layout & Measurement (MEDIUM)
- `measure-views.md` - Measuring view dimensions

### Design System (MEDIUM)
- `design-system-compound-components.md` - Use compound components
- `imports-design-system-folder.md` - Import from design system folder

### User Interface (MEDIUM)
- `menus.md` - Native dropdown and context menus with zeego

### Monorepo (MEDIUM)
- `monorepo-native-deps-in-app.md` - Install native deps in app directory
- `monorepo-single-dependency-versions.md` - Single dependency versions

## Creating a New Rule

1. Copy `rules/_template.md` to `rules/area-description.md`
2. Choose the appropriate area prefix:
   - `rendering-` for Core Rendering (Section 1)
   - `animation-` for Animation Performance (Section 2)
   - `list-` for List Performance (Section 3)
   - `react-state-` for State Management (Section 4)
   - `react-compiler-` for React Compiler (Section 5)
   - `measure-` for Layout & Measurement (Section 6)
   - `design-system-` for Design System (Section 7)
   - `menus-` for User Interface (Section 8)
   - `monorepo-` for Monorepo (Section 9)
   - `scroll-` for Scroll (Section 10)
   - `imports-` for Imports (Section 11)
3. Fill in the frontmatter and content
4. Ensure you have clear examples with explanations

## Rule File Structure

Each rule file should follow this structure:

```markdown
---
title: Rule Title Here
impact: MEDIUM
impactDescription: Optional description
tags: tag1, tag2, tag3
---

## Rule Title Here

Brief explanation of the rule and why it matters.

**Incorrect (description of what's wrong):**

```typescript
// Bad code example
```

**Correct (description of what's right):**

```typescript
// Good code example
```

Reference: [Link](https://example.com)
```

## File Naming Convention

- Files starting with `_` are special (excluded from build)
- Rule files: `area-description.md` (e.g., `animation-gpu-properties.md`)
- Section is automatically inferred from filename prefix
- Rules are sorted alphabetically by title within each section

## Impact Levels

- `CRITICAL` - Highest priority, causes crashes or broken UI
- `HIGH` - Significant performance improvements
- `MEDIUM` - Moderate performance improvements
- `LOW` - Incremental improvements
