# Web Design Guidelines

**Version 1.0.0**  
Engineering  
January 2026

> **Note:**  
> This document is mainly for agents and LLMs to follow when maintaining,  
> generating, or refactoring web UI code. Humans  
> may also find it useful, but guidance here is optimized for automation  
> and consistency by AI-assisted workflows.

---

## Abstract

Comprehensive web design guidelines for building accessible, performant, and user-friendly interfaces. Contains rules across 8 categories covering accessibility, layout, typography, color, interaction, responsive design, performance, and animation. Each rule includes detailed explanations, real-world examples comparing incorrect vs. correct implementations, and impact assessments to guide automated code generation and review.

---

## Table of Contents

1. [Accessibility](#1-accessibility) — **CRITICAL**
   - 1.1 [Provide Alt Text for Images](#11-provide-alt-text-for-images)
4. [Color](#4-color) — **MEDIUM-HIGH**
   - 4.1 [Ensure Sufficient Color Contrast](#41-ensure-sufficient-color-contrast)
8. [Animation & Motion](#8-animation-&-motion) — **LOW-MEDIUM**
   - 8.1 [Use Framer Motion or CSS for Animations](#81-use-framer-motion-or-css-for-animations)
9. [Section 9](#9-section-9) — **HIGH**
   - 9.1 [Prefer Tailwind CSS for Styling](#91-prefer-tailwind-css-for-styling)

---

## 1. Accessibility

**Impact: CRITICAL**

Accessibility is fundamental to inclusive design. These rules ensure web content is perceivable, operable, understandable, and robust for all users, including those using assistive technologies.

### 1.1 Provide Alt Text for Images

**Impact: CRITICAL**

All images must have descriptive alt text that conveys the purpose and content of the image. Screen readers rely on alt text to describe images to users who cannot see them. Empty or missing alt text makes content inaccessible.

**Incorrect:**

```html
<img src="logo.png">

<img src="chart.png" alt="">

<img src="hero.jpg" alt="image">
```

**Correct:**

```html
<img src="logo.png" alt="Company Logo">

<img src="chart.png" alt="Bar chart showing Q4 revenue increased 25% compared to Q3">

<img src="hero.jpg" alt="Team collaborating around a whiteboard in modern office">
```

**Decorative Images:**

```html
<!-- For purely decorative images, use empty alt to hide from screen readers -->
<img src="decorative-border.png" alt="" role="presentation">
```

Reference: [https://www.w3.org/WAI/WCAG21/Understanding/non-text-content.html](https://www.w3.org/WAI/WCAG21/Understanding/non-text-content.html)

---

## 4. Color

**Impact: MEDIUM-HIGH**

Color conveys meaning and creates visual appeal. These rules ensure proper contrast, consistent usage, and accessibility compliance.

### 4.1 Ensure Sufficient Color Contrast

**Impact: CRITICAL**

Text must have sufficient contrast against its background to be readable. WCAG 2.1 requires a minimum contrast ratio of 4.5:1 for normal text and 3:1 for large text (18px+ or 14px+ bold).

**Incorrect:**

```css
/* Low contrast - fails WCAG */
.text-light {
  color: #999999;
  background-color: #ffffff;
  /* Contrast ratio: 2.85:1 */
}

.button-subtle {
  color: #aaaaaa;
  background-color: #dddddd;
  /* Contrast ratio: 1.47:1 */
}
```

**Correct:**

```css
/* Sufficient contrast - passes WCAG AA */
.text-readable {
  color: #595959;
  background-color: #ffffff;
  /* Contrast ratio: 7:1 */
}

.button-accessible {
  color: #1a1a1a;
  background-color: #dddddd;
  /* Contrast ratio: 11.9:1 */
}
```

**Example: checking contrast programmatically**

```typescript
function getContrastRatio(color1: string, color2: string): number {
  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return (lighter + 0.05) / (darker + 0.05);
}

// Minimum ratios
const NORMAL_TEXT_MIN = 4.5;
const LARGE_TEXT_MIN = 3.0;
```

Reference: [https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)

---

## 8. Animation & Motion

**Impact: LOW-MEDIUM**

Animation enhances user experience when used appropriately. These rules cover timing, easing, and motion preferences.

### 8.1 Use Framer Motion or CSS for Animations

**Impact: MEDIUM-HIGH**

Use Framer Motion for complex, interactive animations and transitions. For simple state-based animations (fade, slide, scale), use CSS with Tailwind utilities. Framer Motion provides declarative animation API, gesture support, and layout animations, while CSS is better for simple transitions.

**Choice Guidelines:**

- **Use Framer Motion for:** Complex sequences, gestures (drag/swipe), layout animations, orchestration, exit animations

- **Use CSS for:** Simple fade/slide, hover effects, loading states, basic transitions

**Correct: Framer Motion for modal with exit animation**

```tsx
import { motion, AnimatePresence } from 'framer-motion'

function Modal({ isOpen, onClose, children }: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="bg-white rounded-xl p-6 m-4"
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
```

**Correct: gesture-driven interactions**

```tsx
import { motion } from 'framer-motion'

function SwipeableCard({ onSwipe, children }: SwipeableCardProps) {
  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={1}
      onDragEnd={(e, { offset, velocity }) => {
        const swipe = Math.abs(offset.x) * velocity.x
        if (swipe > 10000) {
          onSwipe(offset.x > 0 ? 'right' : 'left')
        }
      }}
      className="bg-white rounded-xl p-6 shadow-lg cursor-grab active:cursor-grabbing"
    >
      {children}
    </motion.div>
  )
}
```

**Correct: layout animations with shared layout**

```tsx
import { motion, AnimatePresence } from 'framer-motion'

function ExpandableCard({ isExpanded, onToggle }: ExpandableCardProps) {
  return (
    <motion.div
      layout // Automatically animates layout changes
      className="bg-white rounded-xl p-6 cursor-pointer"
      onClick={onToggle}
    >
      <motion.h2 layout="position" className="text-xl font-bold">
        Title
      </motion.h2>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p className="mt-4">Expanded content here...</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
```

**Correct: stagger children with orchestration**

```tsx
import { motion } from 'framer-motion'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

function StaggeredList({ items }: { items: string[] }) {
  return (
    <motion.ul
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-2"
    >
      {items.map((text) => (
        <motion.li
          key={text}
          variants={item}
          className="p-4 bg-white rounded-lg shadow"
        >
          {text}
        </motion.li>
      ))}
    </motion.ul>
  )
}
```

**Correct: scroll-triggered animations**

```tsx
import { motion, useScroll, useTransform } from 'framer-motion'

function ParallaxSection({ children }: { children: React.ReactNode }) {
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], [0, -300])
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.5, 0])
  
  return (
    <motion.section style={{ y, opacity }}>
      {children}
    </motion.section>
  )
}
```

**Correct: simple fade/slide with Tailwind**

```tsx
function FadeInBox({ show, children }: { show: boolean; children: React.ReactNode }) {
  return (
    <div
      className={`
        transition-all duration-300 ease-out
        ${show 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-5 pointer-events-none'
        }
      `}
    >
      {children}
    </div>
  )
}
```

**Correct: hover effects**

```tsx
function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="
      bg-white rounded-xl p-6 shadow-lg
      transition-all duration-200
      hover:shadow-xl hover:scale-105
      active:scale-100
    ">
      {children}
    </div>
  )
}
```

**Correct: loading skeleton with CSS animation**

```css
/* globals.css */
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
```

**Correct: tab transition with CSS**

```tsx
function Tabs({ activeTab, setActiveTab }: TabsProps) {
  return (
    <div className="relative">
      <div className="flex gap-4 border-b">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              px-4 py-2 relative transition-colors
              ${activeTab === tab.id ? 'text-blue-500' : 'text-gray-500'}
            `}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div className="
                absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500
                animate-in slide-in-from-left duration-200
              " />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
```

1. **Exit animations needed** - AnimatePresence handles unmount animations

2. **Gesture support** - Drag, swipe, pan with physics

3. **Layout animations** - Automatic FLIP animations with `layout` prop

4. **Orchestration** - Stagger, sequence, delay multiple animations

5. **Scroll-linked** - Parallax, scroll-triggered animations

6. **Complex sequences** - Multi-step animations with variants

1. **Simple transitions** - Fade, slide, scale between states

2. **Hover effects** - Button hover, card lift

3. **Loading states** - Spinners, skeletons, progress bars

4. **Performance critical** - CSS runs on compositor thread

5. **Infinite loops** - Spinners, pulsing indicators

**Incorrect: imperative animation with refs**

```tsx
function BadAnimation() {
  const ref = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    // ❌ Imperative, hard to maintain
    let opacity = 0
    const animate = () => {
      opacity += 0.05
      if (ref.current) ref.current.style.opacity = String(opacity)
      if (opacity < 1) requestAnimationFrame(animate)
    }
    animate()
  }, [])
  
  return <div ref={ref}>Content</div>
}
```

**Incorrect: CSS for complex gestures**

```tsx
// ❌ CSS can't handle drag physics properly
function DragCard() {
  return (
    <div className="cursor-grab active:cursor-grabbing" draggable>
      {/* Native drag is clunky, no physics */}
    </div>
  )
}
```

**Correct: respect prefers-reduced-motion in Framer Motion**

```tsx
import { motion, useReducedMotion } from 'framer-motion'

function AnimatedComponent() {
  const shouldReduceMotion = useReducedMotion()
  
  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
    >
      Content
    </motion.div>
  )
}
```

**Correct: global CSS for reduced motion**

```css
/* globals.css */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Installation:**

```bash
npm install framer-motion
```

**Common variant patterns:**

```tsx
// lib/motion-variants.ts
export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
}

export const scaleIn = {
  initial: { scale: 0.8, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0.8, opacity: 0 },
}

export const slideInLeft = {
  initial: { x: -100, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: -100, opacity: 0 },
}

// Usage
import { motion } from 'framer-motion'
import { fadeInUp } from '@/lib/motion-variants'

function Component() {
  return (
    <motion.div {...fadeInUp} transition={{ duration: 0.3 }}>
      Content
    </motion.div>
  )
}
```

**Benefits of Framer Motion:**

1. **Declarative** - Animation defined in props, not imperative code

2. **Exit animations** - AnimatePresence handles unmounting gracefully

3. **Layout animations** - Automatic FLIP for layout changes

4. **Gesture support** - Drag, pan, swipe with physics out of the box

5. **TypeScript support** - Fully typed API

6. **Performance** - Hardware-accelerated, optimized for React

**Benefits of CSS:**

1. **Smaller bundle** - No JavaScript library (~50KB saved)

2. **Better performance** - Runs on compositor thread

3. **Simple to reason about** - State → className mapping

4. **Tailwind integration** - Utility classes for everything

Reference: [https://www.framer.com/motion/](https://www.framer.com/motion/)

---

## 9. Section 9

**Impact: HIGH**

### 9.1 Prefer Tailwind CSS for Styling

**Impact: HIGH**

Use Tailwind CSS utility classes instead of custom CSS or inline styles. Tailwind provides a consistent design system, reduces CSS bundle size through purging, and improves developer velocity with auto-complete and no naming conflicts.

**Incorrect: custom CSS with naming conflicts**

```tsx
// styles.css
.button {
  padding: 12px 24px;
  border-radius: 8px;
  background-color: #3b82f6;
  color: white;
  font-weight: 600;
}

.button:hover {
  background-color: #2563eb;
}

.button-large {
  padding: 16px 32px;
  font-size: 18px;
}

// Component
import './styles.css'

function Button({ size = 'default' }) {
  return (
    <button className={`button ${size === 'large' ? 'button-large' : ''}`}>
      Click me
    </button>
  )
}
```

**Incorrect: inline styles - no reusability**

```tsx
function Button() {
  return (
    <button
      style={{
        padding: '12px 24px',
        borderRadius: '8px',
        backgroundColor: '#3b82f6',
        color: 'white',
        fontWeight: 600,
      }}
    >
      Click me
    </button>
  )
}
```

**Correct: Tailwind utility classes**

```tsx
function Button({ size = 'default' }: { size?: 'default' | 'large' }) {
  return (
    <button
      className={`
        rounded-lg bg-blue-500 text-white font-semibold 
        hover:bg-blue-600 active:bg-blue-700
        transition-colors duration-150
        ${size === 'large' ? 'px-8 py-4 text-lg' : 'px-6 py-3'}
      `}
    >
      Click me
    </button>
  )
}
```

**Correct: with clsx for conditional classes**

```tsx
import clsx from 'clsx'

function Button({ 
  size = 'default', 
  variant = 'primary',
  disabled = false 
}: ButtonProps) {
  return (
    <button
      className={clsx(
        // Base styles
        'rounded-lg font-semibold transition-colors duration-150',
        // Size variants
        {
          'px-6 py-3 text-base': size === 'default',
          'px-8 py-4 text-lg': size === 'large',
          'px-4 py-2 text-sm': size === 'small',
        },
        // Color variants
        {
          'bg-blue-500 text-white hover:bg-blue-600': variant === 'primary',
          'bg-gray-200 text-gray-900 hover:bg-gray-300': variant === 'secondary',
          'bg-transparent border-2 border-blue-500 text-blue-500 hover:bg-blue-50': variant === 'outline',
        },
        // Disabled state
        disabled && 'opacity-50 cursor-not-allowed pointer-events-none'
      )}
      disabled={disabled}
    >
      Click me
    </button>
  )
}
```

**Correct: extract to reusable component variants with cva**

```tsx
import { cva, type VariantProps } from 'class-variance-authority'

const buttonVariants = cva(
  // Base styles
  'rounded-lg font-semibold transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        primary: 'bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700',
        secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 active:bg-gray-400',
        outline: 'bg-transparent border-2 border-blue-500 text-blue-500 hover:bg-blue-50',
        ghost: 'bg-transparent text-gray-700 hover:bg-gray-100',
        danger: 'bg-red-500 text-white hover:bg-red-600 active:bg-red-700',
      },
      size: {
        small: 'px-4 py-2 text-sm',
        default: 'px-6 py-3 text-base',
        large: 'px-8 py-4 text-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  }
)

type ButtonProps = VariantProps<typeof buttonVariants> & {
  children: React.ReactNode
  disabled?: boolean
}

function Button({ variant, size, disabled, children }: ButtonProps) {
  return (
    <button className={buttonVariants({ variant, size })} disabled={disabled}>
      {children}
    </button>
  )
}
```

**Tailwind configuration for design system:**

```js
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          900: '#1e3a8a',
        },
        // Custom brand colors
        brand: {
          light: '#f0f9ff',
          DEFAULT: '#0ea5e9',
          dark: '#0369a1',
        },
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
```

**Correct: responsive design with Tailwind**

```tsx
function Card({ title, description, image }: CardProps) {
  return (
    <div className="
      bg-white rounded-xl shadow-lg overflow-hidden
      hover:shadow-xl transition-shadow duration-300
      
      /* Mobile: stack vertically */
      flex flex-col
      
      /* Tablet: side by side */
      md:flex-row
      
      /* Desktop: larger spacing */
      lg:p-6
    ">
      <img 
        src={image} 
        alt={title}
        className="
          w-full h-48 object-cover
          md:w-1/3 md:h-auto
        "
      />
      <div className="p-4 md:p-6 lg:p-8">
        <h3 className="text-xl md:text-2xl lg:text-3xl font-bold mb-2">
          {title}
        </h3>
        <p className="text-gray-600 text-sm md:text-base">
          {description}
        </p>
      </div>
    </div>
  )
}
```

**Correct: custom utilities via @layer**

```css
/* globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer utilities {
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  
  .text-balance {
    text-wrap: balance;
  }
}

@layer components {
  .btn-primary {
    @apply px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold;
    @apply hover:bg-blue-600 active:bg-blue-700;
    @apply transition-colors duration-150;
    @apply disabled:opacity-50 disabled:cursor-not-allowed;
  }
}
```

**Benefits of Tailwind CSS:**

1. **Consistency** - Design tokens ensure consistent spacing, colors, and sizing

2. **No naming conflicts** - No need to invent class names (BEM, SMACSS)

3. **Smaller bundles** - Purge removes unused CSS (typically 5-10KB final size)

4. **Better DX** - IntelliSense auto-complete for all utilities

5. **Responsive by default** - Breakpoint prefixes (sm:, md:, lg:, xl:, 2xl:)

6. **Dark mode ready** - Built-in dark: prefix for dark mode variants

7. **Maintainable** - All styles co-located with components

Reference: [https://tailwindcss.com/docs](https://tailwindcss.com/docs)

---

## References

1. [https://www.w3.org/WAI/WCAG21/quickref/](https://www.w3.org/WAI/WCAG21/quickref/)
2. [https://developer.mozilla.org/en-US/docs/Web/Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
3. [https://web.dev/learn/design/](https://web.dev/learn/design/)
4. [https://web.dev/learn/accessibility/](https://web.dev/learn/accessibility/)
5. [https://www.nngroup.com/articles/](https://www.nngroup.com/articles/)
6. [https://tailwindcss.com/docs](https://tailwindcss.com/docs)
7. [https://tailwindcss.com/docs/animation](https://tailwindcss.com/docs/animation)
8. [https://www.framer.com/motion/](https://www.framer.com/motion/)
9. [https://www.framer.com/motion/gestures/](https://www.framer.com/motion/gestures/)
10. [https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_animations](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_animations)
11. [https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)
