# Sections

This file defines all sections, their ordering, impact levels, and descriptions.
The section ID (in parentheses) is the filename prefix used to group rules.

---

## 1. Semantic HTML (semantic)

**Impact:** CRITICAL
**Description:** Semantic HTML is the foundation of web accessibility. Without proper semantics, assistive technologies cannot convey page structure, navigation, or purpose to users. This is the single highest-impact area.

## 2. Keyboard Navigation (keyboard)

**Impact:** CRITICAL
**Description:** All interactive functionality must be operable via keyboard alone. Motor-impaired users, power users, and screen reader users all depend on keyboard access. Broken keyboard support completely blocks access.

## 3. ARIA Attributes (aria)

**Impact:** HIGH
**Description:** ARIA fills gaps where native HTML semantics are insufficient. Correct ARIA usage provides essential context to assistive technologies for custom widgets and dynamic interfaces.

## 4. Forms & Inputs (form)

**Impact:** HIGH
**Description:** Forms are the primary way users interact with web applications. Inaccessible forms block users from completing critical tasks like sign-up, checkout, and search.

## 5. Images & Media (media)

**Impact:** MEDIUM-HIGH
**Description:** Images and media convey information that must be available in alternative formats. Missing alt text and captions exclude blind and deaf users from content.

## 6. Color & Contrast (color)

**Impact:** MEDIUM-HIGH
**Description:** Sufficient color contrast and non-color indicators ensure content is perceivable by users with low vision, color blindness, and those in challenging lighting conditions.

## 7. Focus Management (focus)

**Impact:** MEDIUM
**Description:** Proper focus management ensures keyboard and screen reader users can navigate dynamic interfaces, modals, and route changes without losing their place.

## 8. Rendering & Layout (rendering)

**Impact:** MEDIUM
**Description:** Responsive layouts that reflow at high zoom levels and adapt to viewport constraints ensure content is accessible to low-vision users who rely on browser zoom.

## 9. Dynamic Content & Live Regions (dynamic)

**Impact:** MEDIUM
**Description:** Dynamic content updates must be communicated to assistive technologies. Without live regions and proper announcements, screen reader users miss critical UI changes.

## 10. Next.js Specific Patterns (nextjs)

**Impact:** MEDIUM
**Description:** Next.js provides built-in accessibility features and patterns. Using them correctly ensures accessible routing, images, metadata, and server-rendered content.

## 11. Testing & Validation (testing)

**Impact:** LOW-MEDIUM
**Description:** Automated and manual accessibility testing catches issues early and prevents regressions. Integrating a11y checks into CI/CD ensures ongoing compliance.
