# Sections

This file defines all sections, their ordering, impact levels, and descriptions.
The section ID (in parentheses) is the filename prefix used to group rules.

---

## 1. Core Rendering (rendering)

**Impact:** CRITICAL  
**Description:** Fundamental React Native rendering rules. Violations cause
runtime crashes or broken UI.

## 2. Animation Performance (animation)

**Impact:** HIGH  
**Description:** GPU-accelerated animations and avoiding render thrashing during
gestures and scroll.

## 3. List Performance (list)

**Impact:** HIGH  
**Description:** Optimizing virtualized lists (FlatList, LegendList) for smooth
scrolling and fast updates.

## 4. State Management (react-state)

**Impact:** MEDIUM  
**Description:** Patterns for managing React state to avoid stale closures and
unnecessary re-renders.

## 5. React Compiler (react-compiler)

**Impact:** MEDIUM  
**Description:** Compatibility patterns for React Compiler with React Native and
Reanimated.

## 6. Layout & Measurement (measure)

**Impact:** MEDIUM  
**Description:** Measuring view dimensions synchronously and handling layout
changes.

## 7. Design System (design-system)

**Impact:** MEDIUM  
**Description:** Architecture patterns for building maintainable component
libraries.

## 8. User Interface (menus)

**Impact:** MEDIUM  
**Description:** Native UI patterns for accessible, platform-consistent
interfaces.

## 9. Monorepo (monorepo)

**Impact:** MEDIUM  
**Description:** Dependency management and native module configuration in
monorepos.

## 10. Scroll (scroll)

**Impact:** HIGH  
**Description:** Tracking scroll position without causing render thrashing.

## 11. Imports (imports)

**Impact:** LOW  
**Description:** Import patterns for maintainability and easy refactoring.
