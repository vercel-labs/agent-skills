# Sections

This file defines all sections, their ordering, impact levels, and descriptions.
The section ID (in parentheses) is the filename prefix used to group rules.

---

## 1. Core Rendering (rendering)

**Impact:** CRITICAL  
**Description:** Fundamental React Native rendering rules. Violations cause
runtime crashes or broken UI.

## 2. List Performance (list-performance)

**Impact:** HIGH  
**Description:** Optimizing virtualized lists (FlatList, LegendList, FlashList)
for smooth scrolling and fast updates.

## 3. Animation (animation)

**Impact:** HIGH  
**Description:** GPU-accelerated animations, Reanimated patterns, and avoiding
render thrashing during gestures.

## 4. Scroll Performance (scroll)

**Impact:** HIGH  
**Description:** Tracking scroll position without causing render thrashing.

## 5. React State (react-state)

**Impact:** MEDIUM  
**Description:** Patterns for managing React state to avoid stale closures and
unnecessary re-renders.

## 6. State Architecture (state)

**Impact:** MEDIUM  
**Description:** Ground truth principles for state variables and derived values.

## 7. React Compiler (react-compiler)

**Impact:** MEDIUM  
**Description:** Compatibility patterns for React Compiler with React Native and
Reanimated.

## 8. User Interface (ui)

**Impact:** MEDIUM  
**Description:** Native UI patterns for images, menus, modals, styling, and
platform-consistent interfaces.

## 9. Design System (design-system)

**Impact:** MEDIUM  
**Description:** Architecture patterns for building maintainable component
libraries.

## 10. Monorepo (monorepo)

**Impact:** LOW  
**Description:** Dependency management and native module configuration in
monorepos.

## 11. Third-Party Dependencies (imports)

**Impact:** LOW  
**Description:** Wrapping and re-exporting third-party dependencies for
maintainability.

## 12. JavaScript (js)

**Impact:** LOW  
**Description:** Micro-optimizations like hoisting expensive object creation.

## 13. Fonts (fonts)

**Impact:** LOW  
**Description:** Native font loading for improved performance.
