---
title: Use Autocomplete Attributes for Common Fields
impact: MEDIUM-HIGH
impactDescription: Autocomplete enables autofill, reducing effort for motor-impaired and cognitive-disability users
tags: form, autocomplete, autofill, cognitive, motor
wcag: "1.3.5 Level AA"
---

## Use Autocomplete Attributes for Common Fields

**Impact: MEDIUM-HIGH (Autocomplete enables autofill, reducing effort for motor-impaired and cognitive-disability users)**

Add the `autoComplete` attribute to inputs that collect common personal information. This enables browser autofill, which reduces typing effort for motor-impaired users and cognitive load for users with memory difficulties.

**Incorrect (no autocomplete on personal data fields):**

```tsx
function CheckoutForm() {
  return (
    <form>
      <label htmlFor="name">Full Name</label>
      <input id="name" type="text" />
      <label htmlFor="email">Email</label>
      <input id="email" type="email" />
      <label htmlFor="address">Address</label>
      <input id="address" type="text" />
      <label htmlFor="cc">Credit Card</label>
      <input id="cc" type="text" />
    </form>
  )
}
```

**Correct (autocomplete attributes on all applicable fields):**

```tsx
function CheckoutForm() {
  return (
    <form>
      <label htmlFor="name">Full Name</label>
      <input id="name" type="text" autoComplete="name" />
      <label htmlFor="email">Email</label>
      <input id="email" type="email" autoComplete="email" />
      <label htmlFor="address">Address</label>
      <input id="address" type="text" autoComplete="street-address" />
      <label htmlFor="cc">Credit Card</label>
      <input id="cc" type="text" autoComplete="cc-number" inputMode="numeric" />
    </form>
  )
}
```

Common autocomplete values: `name`, `email`, `tel`, `street-address`, `postal-code`, `country`, `cc-number`, `cc-exp`, `username`, `new-password`, `current-password`.

Reference: [WCAG 1.3.5 Identify Input Purpose](https://www.w3.org/WAI/WCAG22/Understanding/identify-input-purpose.html)
