---
scraped_at: '2026-04-20T08:49:19+00:00'
section: components
source_url: https://cloudscape.design/components/slider/index.html.md
title: Slider
---

# Slider

A slider enables users to select a value within a defined range.

 [Get design library](/get-started/for-designers/design-resources/index.html.md) [Browse code](https://github.com/cloudscape-design/components/tree/main/src/slider)
The API properties for this component are found here: [API Properties](https://cloudscape.design/components/slider/index.html.json)

## Development guidelines

To add an input or select next to a slider inside a form field, a small snippet of custom code is required. Make sure to provide a `controlId` to the input or select, as this is what allows the slider to be focused when selecting the form label.

```
<FormField label="Slider with input and validation">
  <div className="flex-wrapper">
    <div className="slider-wrapper">
      <Slider {...sliderProps} />
    </div>
    <SpaceBetween size="m" alignItems="center" direction="horizontal">
      <div className="control-wrapper">
        <Input {...inputProps} controlId="validation-input" />
      </div>
      <Box>Units</Box>
    </SpaceBetween>
  </div>
</FormField>
```

Use this as your custom CSS.

```
.flex-wrapper {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.slider-wrapper {
  flex: 1;
  max-inline-size: 800px;
}

.control-wrapper {
  max-inline-size: 70px;
}
```

For a stacked example, no custom code is required. See the "Slider with select" example for a working demo.

If you are new to test utility classes, you can learn more in the [introduction article](/get-started/testing/introduction/index.html.md).
## Unit testing APIs

SliderWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| blur | - | - | - |
| findNativeInput | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLInputElement> | - | - |
| focus | - | - | - |
| getInputValue | string | Gets the value of the component.Returns the current value of the input. | - |
| isDisabled | boolean | - | - |
| setInputValue | - | Sets the value of the component and calls the onChange handler | value:The value the input is set to. |
## Integration testing APIs

SliderWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findNativeInput | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
## General guidelines

### Do

- Use sliders to adjust values within a defined range, such as storage capacity.
- When providing a label for the slider, wrap it in a [form field](/components/form-field/index.html.md)   component.
- For sliders with large ranges, or where a precise numeric value is required, always include an input (for continuous sliders) or select (for stepped sliders) that also controls the slider value. This helps users choose an exact value and avoid unintended selection. See step 2 of the [wizard demo](/examples/react/wizard.html)  .
- In stepped sliders, ensure there is enough space between tick marks. Tick marks are a useful affordance for understanding value increments, but when placed too close together they create clutter and can cause unintended selection.
- Add reference values when displaying intermediary values along the slider is helpful. For example, in a slider with values from 0 - 100, it may be helpful to add reference values at 25, 50, and 75.
- For ordinal sliders (for example, sliders with ranges in a series like *None-Low-Medium-High*   ), every step should have a reference value.

### Don't

- Don't use reference values to show information that is imperative for a user to make a selection, as they are not always visible on smaller viewports. Instead, use the description field of the form field or the [help system](/patterns/general/help-system/index.html.md)   . Reference values are meant to show supplementary information only. The only exception to this is the ordinal-value based use case. For example, a stepped slider with the values *None, Low, Medium, High*  .
- Don't use reference labels for small numeric sliders. For example, a slider from 1-5 with reference labels 2, 3, and 4 will clutter the interface.

## Features

- #### Min and max

  The min and max are the range of values that the slider can be moved between. They are shown at the beginning and the end of the slider. They are numeric by default, but can be formatted to other units or strings.
- #### Steps - optional

  Steps are used to indicate the granularity of the value. When a slider is stepped, only values that match the step interval are valid. For example, if a user is only able to control the storage space of a data warehouse in increments of 10 GB, use a step value of 10.
- #### Reference values - optional

  Reference values are supplemental labels shown below the slider. These should be used for helping the user choose a selection more quickly in sliders with large ranges or for ordinal sliders. For example, *25%, 50%, 75%*   or *None*   , *Low, Medium, High.*   These values are numeric by default, but can be formatted to other units or strings.
- #### Tooltip

  The slider has a tooltip that shows the value on hover or focus. This guarantees that the user knows exactly what value they have selected at any point.

### States

- #### Disabled

  Use the disabled state when users cannot interact with the slider and to prevent users from modifying the value.
- #### Invalid

  Shows that there is an error with a value that the user entered into the slider.
- #### Read-only

  Use the read-only state when the slider is not to be modified by the user but they still need to view it.

## Writing guidelines

### General writing guidelines

- Use sentence case, but continue to capitalize proper nouns and brand names correctly in context.
- Use end punctuation, except in [headers](/components/header/index.html.md)   and [buttons](/components/button/index.html.md)   . Don't use exclamation points.
- Use present-tense verbs and active voice.
- Don't use *please*   , *thank you*   , ellipsis ( *...*   ), ampersand ( *&*   ), *e.g.*   , *i.e.*   , or *etc.*   in writing.
- Avoid directional language.  

  - For example: use *previous*     not *above*     , use *following*     not *below*    .
- Use device-independent language.  

  - For example: use *choose*     or *select*     not *click*    .

### Component-specific guidelines

- See [form field](/components/form-field/index.html.md)   for guidelines around label, description, and error text when placing the slider inside a form field.
- Keep reference label content short. There is not adequate space in the slider for lengthy descriptions. Instead, use the description field of the form field or the [help system](/patterns/general/help-system/index.html.md)  .

## Accessibility guidelines

### General accessibility guidelines

- Follow the guidelines on alternative text and Accessible Rich Internet Applications (ARIA) regions for each component.
- Make sure to define ARIA labels aligned with the language context of your application.
- Don't add unnecessary markup for roles and landmarks. Follow the guidelines for each component.
- Provide keyboard functionality to all available content in a logical and predictable order. The flow of information should make sense.

### Component-specific guidelines

- The slider should have a clear and concise label that accurately describes its purpose.
- If using a slider outside of a form field, always provide an `ariaLabel`   . Inside a form field, the slider will automatically receive an `ariaLabelledby`   unless specifically overridden.
- Provide an `ariaDescription`   when a slider has formatted reference values. For example, for a slider with reference values of *None, Low, Medium, High*   , provide the `ariaDescription`   "From None to High".

## Component Documentation and API

[All Components](https://cloudscape.design/components/index.html.md) ([API](https://cloudscape.design/components/index.html.json))
