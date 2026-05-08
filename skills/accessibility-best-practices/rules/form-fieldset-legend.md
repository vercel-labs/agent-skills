---
title: Group Related Inputs with Fieldset and Legend
impact: MEDIUM-HIGH
impactDescription: Without grouping, radio buttons and checkboxes lack context about what they control
tags: form, fieldset, legend, grouping, screen-reader
wcag: "1.3.1 Level A"
---

## Group Related Inputs with Fieldset and Legend

**Impact: MEDIUM-HIGH (Without grouping, radio buttons and checkboxes lack context about what they control)**

Use `<fieldset>` and `<legend>` to group related form controls, especially radio buttons and checkbox groups. The `<legend>` provides context that screen readers announce before each option in the group.

**Incorrect (radio group without fieldset/legend):**

```tsx
function ShippingForm() {
  return (
    <div>
      <p className="font-bold">Shipping Method</p>
      <label>
        <input type="radio" name="shipping" value="standard" /> Standard
      </label>
      <label>
        <input type="radio" name="shipping" value="express" /> Express
      </label>
      <label>
        <input type="radio" name="shipping" value="overnight" /> Overnight
      </label>
    </div>
  )
}
```

**Correct (fieldset with legend):**

```tsx
function ShippingForm() {
  return (
    <fieldset>
      <legend>Shipping Method</legend>
      <label>
        <input type="radio" name="shipping" value="standard" /> Standard (5-7 days)
      </label>
      <label>
        <input type="radio" name="shipping" value="express" /> Express (2-3 days)
      </label>
      <label>
        <input type="radio" name="shipping" value="overnight" /> Overnight
      </label>
    </fieldset>
  )
}
```

Screen readers will announce "Shipping Method, group" when entering the fieldset, then "Standard, radio button, 1 of 3" for each option. Without `<fieldset>`, each radio is announced without context.

Reference: [WCAG 1.3.1 Info and Relationships](https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html)
