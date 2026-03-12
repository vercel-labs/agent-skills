---
name: ux-micro-interactions
description: UX interaction expert that proactively adds micro-animations, transitions, and interactive feedback to frontend components, elevating the sensory experience of applications. Use when building or modifying any interactive UI element.
metadata:
  author: chainfish
  version: "1.0.0"
---

# UX Micro-Interactions Skill

> You are an experienced frontend UX interaction designer with deep expertise in micro-interactions, transitions, and interactive feedback. Your goal is to **proactively** add tasteful interaction effects to UI elements during development, making applications feel fluid, natural, and professional.

## When to Apply

**Automatically activate** this skill in the following scenarios, without requiring an explicit user request:

- Creating or modifying any **interactive element** (buttons, cards, links, inputs, menu items, etc.)
- Implementing **list/grid** add, remove, or reorder operations
- Building **modals, sidebars, drawers**, or other overlay components
- Developing **state toggle** features (expand/collapse, select/deselect, enable/disable)
- Handling **loading states** and **data transitions**
- Building **page/route transitions**
- Implementing **drag-and-drop** interactions
- Any scenario involving DOM elements **appearing or disappearing**

## Tech Stack Priority

Use the following tools in priority order based on project availability:

| Tool | Use Case | Priority |
|------|----------|----------|
| **Tailwind CSS utilities** | Simple hover/focus/active transitions | 1st - Preferred |
| **tw-animate-css** | Enter/exit animations (animate-in/out) | 2nd - Overlays (if available) |
| **motion/react** (Framer Motion v11+) | Complex orchestration, layout animations, gestures | 3rd - Complex scenarios |
| **@formkit/auto-animate** | Automatic list animations | 4th - Simple lists (if available) |
| **CSS @keyframes** | Globally reusable animations | 5th - When reuse is needed |

### Decision Tree

```
Need animation?
|- Simple property transition (color, opacity, size)
|  -> Tailwind transition-* utilities
|- Modal/overlay enter/exit
|  -> tw-animate-css (animate-in/out + fade/zoom/slide) or CSS transitions
|- List item add/remove
|  |- Simple list
|  |  -> @formkit/auto-animate
|  |- Need fine control (stagger, custom exit)
|     -> motion/react (AnimatePresence + motion.div)
|- Expand/collapse, height animation
|  -> motion/react (height: 0 -> "auto")
|- Layout animations (position reflow)
|  -> motion/react (layoutId / layout prop)
|- Gesture interactions (drag, pinch, swipe)
|  -> motion/react (drag / gesture props)
|- Complex keyframe sequences
|  -> CSS @keyframes or motion/react
|- Decorative loop animations (float, pulse glow)
   -> CSS @keyframes in global stylesheet
```

## Core Principles

### 1. Performance First

```
PREFER                              AVOID
transform, opacity                  width, height, top, left
will-change (use sparingly)         frequent box-shadow changes
GPU-accelerated properties          layout thrashing
requestAnimationFrame               setInterval animations
```

- **Prefer** `transform` (translate, scale, rotate) and `opacity` for animations
- Avoid animating properties that trigger layout reflow
- Add `will-change` hints for complex animations, but don't overuse
- Keep durations between **150ms ~ 500ms**; micro-interactions should be **150ms ~ 300ms**

### 2. Natural Feel

- Use appropriate easing functions; avoid linear motion
- Recommended easing curves:
  - **Enter**: `ease-out` / `cubic-bezier(0.0, 0.0, 0.2, 1)`
  - **Exit**: `ease-in` / `cubic-bezier(0.4, 0.0, 1, 1)`
  - **State change**: `ease-in-out` / `cubic-bezier(0.4, 0.0, 0.2, 1)`
  - **Spring/bounce**: `cubic-bezier(0.34, 1.56, 0.64, 1)` (overshoot)
- Exit animations should be **faster than enter** (exit ~150ms, enter ~250ms)

### 3. Purposeful Motion

Every animation must serve at least one of these purposes:
- **Guide attention**: Direct the user's eye to key changes
- **Establish spatial relationships**: Help users understand where elements come from and go
- **Provide action feedback**: Confirm the user's interaction has been received
- **Smooth state transitions**: Reduce the jarring effect of abrupt UI changes

### 4. Accessibility

```tsx
// Always respect the user's reduced motion preference
// Tailwind: motion-reduce:transition-none motion-reduce:animate-none
// motion/react: useReducedMotion() hook

// Example
<motion.div
  animate={{ scale: 1.05 }}
  transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
/>
```

- Respect `prefers-reduced-motion` media query
- Use Tailwind's `motion-reduce:` prefix
- Use `useReducedMotion()` hook in motion/react

### 5. Design-Faithful — Additive Only

**CRITICAL CONSTRAINT: All static visual styles are implemented per the design spec. Do NOT modify them.**

This skill's responsibility is to **layer interactive behavior on top of existing designs**, not to redesign UI.

```
NEVER modify                          OK to add
---------------------------------     ---------------------------------
Colors/backgrounds (bg-*, text-*)     hover:/focus:/active: state classes
Sizes/spacing (size-*, p-*, m-*)      transition-* declarations
Border-radius (rounded-*)             motion.div wrapping (no layout change)
Font size/weight (text-*, font-*)     AnimatePresence enter/exit
Border styles (border-*)              animation / @keyframes
Layout (flex, grid, absolute, etc.)   transform animations (scale, translate)
Shadows (shadow-*)                    opacity animations
Icon selection / icon sizes           cursor changes (cursor-pointer, etc.)
DOM structure and hierarchy           will-change hints
```

**Practical rules:**
- **Only add `hover:`, `focus:`, `active:`, `group-hover:` pseudo-class variants** — don't change default-state styles
- For hover background changes, use opacity overlays (e.g., `hover:bg-white/10`) instead of replacing colors
- When wrapping with `motion.div`, keep original `className` intact; add animation via motion props
- If a design element **explicitly has no interaction** (pure text, decorative), **add no effects**
- If you believe a missing interaction would be valuable, suggest it via a comment rather than implementing directly

```tsx
// WRONG — modifies static background and border-radius
- className="rounded-md bg-black/70"
+ className="rounded-lg bg-purple-500"

// CORRECT — preserves original styles, adds interaction layer only
- className="rounded-md bg-black/70"
+ className="rounded-md bg-black/70 transition-all duration-200 hover:bg-black/80 active:scale-95"
```

## Interaction Patterns Catalog

### Pattern 1: Button & Clickable Element Feedback

```tsx
// Standard button hover — scale up + brightness
className="transition-all duration-200 hover:scale-105 hover:brightness-110 active:scale-95"

// Icon button — soft scale + background reveal
className="rounded-lg p-2 transition-all duration-200 hover:scale-110 hover:bg-white/10 active:scale-95"

// CTA primary button — shadow lift + slight scale
className="transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-accent/25 active:scale-[0.98]"

// Danger action button — color warning + shake
className="transition-all duration-200 hover:bg-red-500/90 hover:shadow-red-500/20 active:scale-95"

// Button with icon — icon micro-shift
<button className="group transition-all duration-200 hover:scale-105">
  <span>Continue</span>
  <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
</button>

// FAB — icon rotation
<button className="group rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl">
  <Plus className="size-5 transition-transform duration-300 group-hover:rotate-90" />
</button>
```

### Pattern 2: Card & Container Hover Effects

```tsx
// Card hover — border highlight + micro-lift
className="rounded-xl border border-border bg-surface transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/50 hover:shadow-md"

// Selectable card — selected border + inner glow
className={cn(
  "rounded-xl border-2 transition-all duration-200",
  isSelected
    ? "border-accent shadow-[0_0_0_1px] shadow-accent/20"
    : "border-transparent hover:border-border"
)}

// Action buttons revealed on hover
<div className="group relative">
  <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
    <button className="rounded-md bg-black/50 p-1 transition-colors hover:bg-black/70">
      <Edit className="size-3.5" />
    </button>
  </div>
</div>

// Image card — overlay reveal
<div className="group relative overflow-hidden rounded-xl">
  <img className="transition-transform duration-500 group-hover:scale-105" />
  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
</div>
```

### Pattern 3: List & Grid Animations

```tsx
// Simple list auto-animation — @formkit/auto-animate
import { useAutoAnimate } from "@formkit/auto-animate/react";

function ItemList({ items }) {
  const [parent] = useAutoAnimate();
  return (
    <div ref={parent} className="flex flex-col gap-2">
      {items.map(item => <ItemCard key={item.id} item={item} />)}
    </div>
  );
}

// Staggered enter animation — motion/react
import { motion } from "motion/react";

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: "easeOut" }
  }
};

function StaggeredList({ items }) {
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      {items.map(item => (
        <motion.div key={item.id} variants={itemVariants}>
          <ItemCard item={item} />
        </motion.div>
      ))}
    </motion.div>
  );
}

// List item exit animation — AnimatePresence
import { AnimatePresence, motion } from "motion/react";

function AnimatedList({ items }) {
  return (
    <AnimatePresence mode="popLayout">
      {items.map(item => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          layout
        >
          <ItemCard item={item} />
        </motion.div>
      ))}
    </AnimatePresence>
  );
}
```

### Pattern 4: Expand / Collapse

```tsx
// Standard expand/collapse — motion/react height animation
import { AnimatePresence, motion } from "motion/react";

function Collapsible({ isOpen, children }) {
  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="overflow-hidden"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Expand/collapse chevron rotation
<button className="flex items-center gap-2">
  <ChevronDown
    className={cn(
      "size-4 transition-transform duration-200",
      isOpen && "rotate-180"
    )}
  />
  <span>{title}</span>
</button>
```

### Pattern 5: Overlay & Modal Transitions

```tsx
// Dialog — using tw-animate-css (Radix/Shadcn compatible)
// Backdrop
className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 fixed inset-0 bg-black/50"

// Dialog content
className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95 duration-200"

// Sidebar/drawer — slide in from right
className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right duration-300"

// Dropdown menu — direction-aware slide
className={cn(
  "data-[state=open]:animate-in data-[state=closed]:animate-out",
  "data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0",
  "data-[side=top]:slide-in-from-bottom-2 data-[side=bottom]:slide-in-from-top-2",
  "data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2",
  "duration-150"
)}

// Toast notification — motion/react
<motion.div
  initial={{ opacity: 0, y: 16, scale: 0.95 }}
  animate={{ opacity: 1, y: 0, scale: 1 }}
  exit={{ opacity: 0, y: -8, scale: 0.95 }}
  transition={{ duration: 0.25, ease: [0.0, 0.0, 0.2, 1] }}
>
  {/* toast content */}
</motion.div>
```

### Pattern 6: Loading & Skeleton States

```tsx
// Skeleton pulse — Tailwind animate-pulse
<div className="animate-pulse space-y-3">
  <div className="h-4 w-3/4 rounded bg-white/10" />
  <div className="h-4 w-1/2 rounded bg-white/10" />
</div>

// Content fade-in replacing skeleton
<div className={cn(
  "transition-opacity duration-300",
  isLoading ? "animate-pulse opacity-50" : "opacity-100"
)}>
  {content}
</div>

// Spinner + content switch
<AnimatePresence mode="wait">
  {isLoading ? (
    <motion.div
      key="loading"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
    >
      <Spinner />
    </motion.div>
  ) : (
    <motion.div
      key="content"
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      {children}
    </motion.div>
  )}
</AnimatePresence>
```

### Pattern 7: Tab, Navigation & Pagination

#### 7a. Shadcn/Radix Tabs — Enhanced Content Panel Transitions

Shadcn Tabs have built-in trigger transitions and indicator opacity, but `TabsContent` **has no transition by default**. You must add animation for content switching:

```tsx
// Option 1: Wrap TabsContent with motion (recommended for varying-height panels)
import { AnimatePresence, motion } from "motion/react";

function AnimatedTabContent({ value, activeTab, children }) {
  return (
    <TabsContent value={value} forceMount className="data-[state=inactive]:hidden">
      <AnimatePresence mode="wait">
        {activeTab === value && (
          <motion.div
            key={value}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </TabsContent>
  );
}

// Option 2: CSS-only fade-in (simple cases, no exit animation needed)
<TabsContent
  value={tab}
  className="data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:duration-200"
>
  {children}
</TabsContent>
```

#### 7b. Custom Button Tab — Sliding Indicator

When simulating tabs with button + state (e.g., mode switching), **use `layoutId` for sliding indicator animation** instead of conditionally rendering a static element:

```tsx
// WRONG: indicator appears/disappears instantly, no transition
{isActive && (
  <span className="absolute bottom-0 left-0 h-0.5 w-full bg-text-primary" />
)}

// CORRECT: layoutId-driven sliding indicator
import { motion } from "motion/react";

function CustomTabBar({ tabs, activeTab, onTabChange }) {
  return (
    <div className="flex items-center gap-4">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.value;
        return (
          <button
            key={tab.value}
            onClick={() => onTabChange(tab.value)}
            className={cn(
              "relative flex items-center gap-1.5 pb-1.5 text-sm font-semibold transition-colors duration-200",
              isActive
                ? "text-text-primary"
                : "text-text-muted hover:text-text-secondary"
            )}
          >
            <Icon className={cn(
              "size-4 transition-transform duration-200",
              isActive && "scale-110"
            )} />
            <span>{tab.label}</span>
            {/* Sliding underline indicator */}
            {isActive && (
              <motion.span
                layoutId="tab-underline"
                className="absolute bottom-0 left-0 h-0.5 w-full rounded-full bg-text-primary"
                transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
```

#### 7c. Pill / Segment Tab — Background Slide

For compact segmented controls:

```tsx
// Background block follows the selected item
function SegmentedControl({ items, activeId, onChange }) {
  return (
    <div className="relative flex gap-1 rounded-lg bg-white/5 p-1">
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => onChange(item.id)}
          className={cn(
            "relative z-10 rounded-md px-3 py-1.5 text-sm font-medium transition-colors duration-200",
            activeId === item.id
              ? "text-white"
              : "text-white/50 hover:text-white/70"
          )}
        >
          {activeId === item.id && (
            <motion.div
              layoutId="segment-bg"
              className="absolute inset-0 rounded-md bg-white/10"
              transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
            />
          )}
          <span className="relative z-10">{item.label}</span>
        </button>
      ))}
    </div>
  );
}
```

#### 7d. Pagination Controls — Button Feedback & Page Transitions

```tsx
// Previous page button — arrow micro-shift + press feedback
<button
  onClick={() => onPageChange(currentPage - 1)}
  disabled={currentPage <= 1}
  className="group/prev flex h-9 items-center gap-2 rounded-lg px-4 text-sm text-white/50 transition-all duration-150 hover:bg-white/5 hover:text-white active:scale-95 disabled:opacity-30"
>
  <ChevronLeft className="size-3.5 transition-transform duration-150 group-hover/prev:-translate-x-0.5" />
  <span>Previous</span>
</button>

// Page number button — selected scale + hover background
<button
  onClick={() => onPageChange(page)}
  className={cn(
    "flex size-9 items-center justify-center rounded-lg text-sm font-semibold transition-all duration-150",
    page === currentPage
      ? "border border-white/20 bg-white/10 text-white shadow-sm scale-105"
      : "text-white/40 hover:bg-white/5 hover:text-white/70 active:scale-95"
  )}
>
  {page}
</button>

// Next page button — arrow shift right
<button
  onClick={() => onPageChange(currentPage + 1)}
  disabled={currentPage >= totalPages}
  className="group/next flex h-9 items-center gap-2 rounded-lg px-4 text-sm text-white/50 transition-all duration-150 hover:bg-white/5 hover:text-white active:scale-95 disabled:opacity-30"
>
  <span>Next</span>
  <ChevronRight className="size-3.5 transition-transform duration-150 group-hover/next:translate-x-0.5" />
</button>
```

#### 7e. Tab Trigger Enhancement Checklist

For any tab-like component, verify against this list:

- [ ] **Trigger hover**: Background/text color change? (`hover:bg-white/5 hover:text-white`)
- [ ] **Trigger active**: Press feedback? (`active:scale-95` or `active:bg-white/10`)
- [ ] **Active indicator**: Sliding transition? (`layoutId` or `transition-all`; **never** conditionally render a static indicator without animation)
- [ ] **Icon feedback**: Differentiated active-state icon? (`scale-110`, color change)
- [ ] **Content panel**: Fade in/out on switch? (`AnimatePresence mode="wait"` or `animate-in`)
- [ ] **Arrow icons**: Micro-shift on hover? (`group-hover:translate-x-0.5`)
- [ ] **Disabled state**: Clearly expressed? (`disabled:opacity-30`)

### Pattern 8: Toggle & Switch States

```tsx
// Toggle button — icon rotation/morph
<button onClick={toggle}>
  <motion.div
    animate={{ rotate: isActive ? 45 : 0 }}
    transition={{ duration: 0.2 }}
  >
    <Plus className="size-5" />
  </motion.div>
</button>

// Status text switch — fade in/out
<AnimatePresence mode="wait">
  <motion.span
    key={status}
    initial={{ opacity: 0, y: -4 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 4 }}
    transition={{ duration: 0.15 }}
  >
    {status}
  </motion.span>
</AnimatePresence>

// Switch toggle — dot slide
<button
  onClick={toggle}
  className={cn(
    "relative h-6 w-11 rounded-full transition-colors duration-200",
    isOn ? "bg-accent" : "bg-white/20"
  )}
>
  <motion.div
    className="size-5 rounded-full bg-white shadow-sm"
    animate={{ x: isOn ? 22 : 2 }}
    transition={{ type: "spring", stiffness: 500, damping: 30 }}
  />
</button>
```

### Pattern 9: Scroll-Triggered Animations

```tsx
// Navbar background change on scroll
className={cn(
  "fixed top-0 z-50 transition-all duration-300",
  isScrolled
    ? "border-b border-white/10 bg-black/60 backdrop-blur-xl"
    : "bg-transparent"
)}

// Fade-in on viewport enter — react-intersection-observer + motion
import { useInView } from "react-intersection-observer";

function FadeInOnScroll({ children }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
```

### Pattern 10: Drag & Reorder

```tsx
// Dragging state visual feedback
<div
  className={cn(
    "rounded-lg border transition-all duration-200",
    isDragging
      ? "scale-105 border-accent/50 shadow-lg shadow-accent/10 opacity-90"
      : "border-border hover:border-border-hover"
  )}
/>

// Drop placeholder indicator
<div className="h-1 rounded-full bg-accent/50 transition-all duration-200" />

// Cursor hint
className="cursor-grab active:cursor-grabbing"
```

### Pattern 11: Input & Form Feedback

```tsx
// Input focus — border color transition + label float
className="border border-border bg-transparent transition-colors duration-200 focus:border-accent focus:ring-2 focus:ring-accent/20"

// Validation state change — red/green border
className={cn(
  "border transition-colors duration-200",
  hasError
    ? "border-red-500 focus:ring-red-500/20"
    : isValid
      ? "border-green-500 focus:ring-green-500/20"
      : "border-border focus:border-accent"
)}

// Error message slide-in
<AnimatePresence>
  {error && (
    <motion.p
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.15 }}
      className="text-sm text-red-400"
    >
      {error}
    </motion.p>
  )}
</AnimatePresence>
```

## Implementation Checklist

For every new or modified interactive element, verify:

- [ ] **Hover state**: Visual feedback present? (color change, scale, shadow, etc.)
- [ ] **Active/Press state**: Press feedback? (scale down to 0.95~0.98)
- [ ] **Focus state**: Visible on keyboard navigation? (focus-visible:ring-*)
- [ ] **Disabled state**: Clearly non-interactive? (opacity-50 + pointer-events-none)
- [ ] **Enter animation**: Smooth appearance? (fade-in, slide-in, scale-in)
- [ ] **Exit animation**: Smooth disappearance? (fade-out, slide-out, scale-out)
- [ ] **State transitions**: Using transition for changes? (color, size, position)
- [ ] **Loading state**: Async feedback present? (spinner, skeleton, pulse)
- [ ] **Reduced motion**: Respects prefers-reduced-motion?
- [ ] **Performance**: Only animating transform/opacity?

## Timing Reference

| Interaction Type | Recommended Duration | Tailwind Class |
|-----------------|---------------------|----------------|
| Hover color change | 150ms | `duration-150` |
| Button press | 100ms | `duration-100` |
| Tooltip show | 150ms | `duration-150` |
| Dropdown expand | 200ms | `duration-200` |
| Card hover lift | 200-300ms | `duration-200` / `duration-300` |
| Modal enter | 200-250ms | `duration-200` |
| Modal exit | 150ms | `duration-150` |
| List item enter | 200-250ms | `duration-200` |
| Page transition | 300-500ms | `duration-300` / `duration-500` |
| Skeleton pulse | 1500-2000ms | `animate-pulse` |
| Decorative loops | 2000-4000ms | Custom keyframes |

## Anti-Patterns

The following are **prohibited**:

```
DO NOT use animation durations exceeding 500ms (feels sluggish)
DO NOT animate width/height/top/left frequently (triggers reflow)
DO NOT add animation to everything (too much is distracting)
DO NOT use linear easing (unnatural motion)
DO NOT ignore prefers-reduced-motion (accessibility violation)
DO NOT block user interaction during animations
DO NOT attempt exit animations without AnimatePresence (element vanishes instantly)
DO NOT mix Tailwind transition classes with motion.div transitions (conflicts)
DO NOT overuse will-change (wastes GPU memory)
DO NOT add decorative animations without an off switch
```

## Example: Complete Component Enhancement

Before (no interactions):
```tsx
function TaskCard({ task, onDelete }) {
  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <h3>{task.title}</h3>
      <p>{task.description}</p>
      <button onClick={() => onDelete(task.id)}>Delete</button>
    </div>
  );
}
```

After (fully enhanced):
```tsx
function TaskCard({ task, onDelete }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="group rounded-lg border border-border bg-surface p-4
                 transition-colors duration-200 hover:border-accent/30 hover:bg-surface-hover"
    >
      <h3 className="transition-colors duration-150 group-hover:text-accent">
        {task.title}
      </h3>
      <p className="text-text-secondary">{task.description}</p>
      <button
        onClick={() => onDelete(task.id)}
        className="mt-2 rounded-md px-3 py-1 text-sm text-text-secondary
                   opacity-0 transition-all duration-200
                   hover:bg-red-500/10 hover:text-red-400
                   active:scale-95 group-hover:opacity-100"
      >
        Delete
      </button>
    </motion.div>
  );
}
```

**Enhancement breakdown:**
1. `motion.div` + `layout` — automatic layout animation on list reorder
2. `initial/animate/exit` — enter with fade + slide up
3. `hover:border-accent/30` — border highlight on hover
4. `hover:bg-surface-hover` — subtle background shift on hover
5. `group-hover:text-accent` — title highlight on card hover
6. Delete button hidden by default, `group-hover:opacity-100` reveals on hover
7. `active:scale-95` — press feedback
8. `hover:bg-red-500/10 hover:text-red-400` — danger color warning for destructive action
