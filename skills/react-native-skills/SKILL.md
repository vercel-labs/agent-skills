---
name: vercel-react-native-skills
description:
  React Native and Expo best practices for building performant mobile apps. Use
  when building React Native components, optimizing list performance,
  implementing animations, or working with native modules. Triggers on tasks
  involving React Native, Expo, mobile performance, or native platform APIs.
license: MIT
metadata:
  author: vercel
  version: '1.0.0'
---

# React Native Skills

Comprehensive best practices for React Native and Expo applications. Contains
rules across multiple categories covering performance, animations, UI patterns,
and platform-specific optimizations.

## When to Apply

Reference these guidelines when:

- Building React Native or Expo apps
- Optimizing list and scroll performance
- Implementing animations with Reanimated
- Working with images and media
- Configuring native modules or fonts
- Structuring monorepo projects with native dependencies

## Rule Categories by Priority

Sections, order and impact follow `rules/_sections.md` and the compiled `AGENTS.md`.

| Priority | Category                 | Impact   | Prefix               |
| -------- | ------------------------ | -------- | -------------------- |
| 1        | Core Rendering           | CRITICAL | `rendering-`         |
| 2        | List Performance         | HIGH     | `list-performance-`  |
| 3        | Animation                | HIGH     | `animation-`         |
| 4        | Scroll Performance       | HIGH     | `scroll-`            |
| 5        | Navigation               | HIGH     | `navigation-`        |
| 6        | React State              | MEDIUM   | `react-state-`       |
| 7        | State Architecture       | MEDIUM   | `state-`             |
| 8        | React Compiler           | MEDIUM   | `react-compiler-`    |
| 9        | User Interface           | MEDIUM   | `ui-`                |
| 10       | Design System            | MEDIUM   | `design-system-`     |
| 11       | Monorepo                 | LOW      | `monorepo-`          |
| 12       | Third-Party Dependencies | LOW      | `imports-`            |
| 13       | JavaScript               | LOW      | `js-`                |
| 14       | Fonts                    | LOW      | `fonts-`             |

## Quick Reference

### 1. Core Rendering (CRITICAL)

- `rendering-text-in-text-component` - Wrap text in Text components
- `rendering-no-falsy-and` - Avoid falsy && for conditional rendering

### 2. List Performance (HIGH)

- `list-performance-virtualize` - Use FlashList for large lists
- `list-performance-item-memo` - Memoize list item components
- `list-performance-callbacks` - Stabilize callback references
- `list-performance-inline-objects` - Avoid inline style objects
- `list-performance-function-references` - Extract functions outside render
- `list-performance-images` - Optimize images in lists
- `list-performance-item-expensive` - Move expensive work outside items
- `list-performance-item-types` - Use item types for heterogeneous lists

### 3. Animation (HIGH)

- `animation-gpu-properties` - Animate only transform and opacity
- `animation-derived-value` - Use useDerivedValue for computed animations
- `animation-gesture-detector-press` - Use Gesture.Tap instead of Pressable

### 4. Scroll Performance (HIGH)

- `scroll-position-no-state` - Never track scroll position in useState

### 5. Navigation (HIGH)

- `navigation-native-navigators` - Use native stack and native tabs over JS navigators

### 6. React State (MEDIUM)

- `react-state-minimize` - Minimize state subscriptions
- `react-state-dispatcher` - Use dispatcher pattern for callbacks
- `react-state-fallback` - Show fallback on first render

### 7. State Architecture (MEDIUM)

- `state-ground-truth` - State must represent ground truth

### 8. React Compiler (MEDIUM)

- `react-compiler-destructure-functions` - Destructure for React Compiler
- `react-compiler-reanimated-shared-values` - Handle shared values with compiler

### 9. User Interface (MEDIUM)

- `ui-expo-image` - Use expo-image for all images
- `ui-image-gallery` - Use Galeria for image lightboxes
- `ui-pressable` - Use Pressable over TouchableOpacity
- `ui-safe-area-scroll` - Handle safe areas in ScrollViews
- `ui-scrollview-content-inset` - Use contentInset for headers
- `ui-menus` - Use native context menus
- `ui-native-modals` - Use native modals when possible
- `ui-measure-views` - Use onLayout, not measure()
- `ui-styling` - Use StyleSheet.create or Nativewind

### 10. Design System (MEDIUM)

- `design-system-compound-components` - Use compound components over polymorphic children

### 11. Monorepo (LOW)

- `monorepo-native-deps-in-app` - Keep native dependencies in app package
- `monorepo-single-dependency-versions` - Use single versions across packages

### 12. Third-Party Dependencies (LOW)

- `imports-design-system-folder` - Organize design system imports

### 13. JavaScript (LOW)

- `js-hoist-intl` - Hoist Intl object creation

### 14. Fonts (LOW)

- `fonts-config-plugin` - Use config plugins for custom fonts

## How to Use

Read individual rule files for detailed explanations and code examples:

```
rules/list-performance-virtualize.md
rules/animation-gpu-properties.md
```

Each rule file contains:

- Brief explanation of why it matters
- Incorrect code example with explanation
- Correct code example with explanation
- Additional context and references

## Full Compiled Document

For the complete guide with all rules expanded: `AGENTS.md`
