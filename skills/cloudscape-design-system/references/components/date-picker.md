---
scraped_at: '2026-04-20T08:47:43+00:00'
section: components
source_url: https://cloudscape.design/components/date-picker/index.html.md
title: Date picker
---

# Date picker

With the date picker, users can enter or choose a date value.

 [Get design library](/get-started/for-designers/design-resources/index.html.md) [Browse code](https://github.com/cloudscape-design/components/tree/main/src/date-picker)
The API properties for this component are found here: [API Properties](https://cloudscape.design/components/date-picker/index.html.json)

## Development guidelines

#### Date and time input

Creating a combined date and time input with appropriate styling and accessibility hints
currently requires some additional markup - see the [single page create example](/examples/react/form.html)
for an example of how to achieve this.

#### State management

The date picker component is controlled. Set the `value` property and the `onChange` listener to store its value in the state of your application. Learn more about the [state management](/get-started/dev-guides/state-management/index.html.md) of Cloudscape components.

If you are new to test utility classes, you can learn more in the [introduction article](/get-started/testing/introduction/index.html.md).
## Unit testing APIs

DatePickerWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| blur | - | - | - |
| findCalendar | [CalendarWrapper](/components/calendar/index.html.md) &#124; null | - | options:* expandToViewport (boolean) - Use this when the component under test is rendered with an `expandToViewport` flag. |
| findCalendarDropdown | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findNativeInput | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLInputElement> | - | - |
| findOpenCalendarButton | [ButtonWrapper](/components/button/index.html.md) | - | - |
| focus | - | - | - |
| getInputValue | string | Gets the value of the component.Returns the current value of the input. | - |
| isDisabled | boolean | - | - |
| setInputValue | - | Sets the value of the component and calls the onChange handler.The value needs to use the "YYYY/MM/DD" format,but the subsequent onChange handler will contain the value in the "YYYY-MM-DD" format. | value:The value the input is set to, using the "YYYY/MM/DD" format. |
## Integration testing APIs

DatePickerWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findCalendar | [CalendarWrapper](/components/calendar/index.html.md) | - | options:* expandToViewport (boolean) - Use this when the component under test is rendered with an `expandToViewport` flag. |
| findCalendarDropdown | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findNativeInput | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findOpenCalendarButton | [ButtonWrapper](/components/button/index.html.md) | - | - |
## General guidelines

### Do

- When using a date picker along with a [time input](/components/time-input/index.html.md)   , use only one label and description for both date and time, and place the date picker before the time input. For more information, see the [API documentation](/components/date-picker/index.html.md)   and [single page create example](/examples/react/form.html)  .
- Always include the required input format in the constraint text, along with any other format constraints. You should also include the format in the placeholder text.
- Follow the guidelines for [disabled and read-only states](/patterns/general/disabled-and-read-only-states/index.html.md)  .

## Features

- #### Date picker input

  Users can input a date in two ways: by entering a date in the input field or by choosing a date from the calendar overlay.  

  - Forward slashes (/) are used to separate the year, month, and day. These populate automatically as the user enters a value.
  - Other delimiters such as hyphens (-), periods (.), and spaces ( ) are also accepted, but will be replaced by a forward slash (/).

  Follow the guidelines for [input](/components/input/index.html.md)  .
- #### Granularity

**Date picker**  

  Used to select a day within a calendar year by entering a day in the input field ( *YYYY/MM/DD*   ) or by choosing a day from the calendar overlay.  

**Month picker**  

  Used to select a month within a calendar year by entering a month in the input field ( *YYYY/MM*   ) or by choosing a month from the calendar overlay.
- #### Placeholder text

  Use placeholder text to indicate the accepted date format.  

  - For example: *YYYY/MM/DD*
  - For example: *YYYY/MM*

  Follow the guidelines for [input](/components/input/index.html.md)  .
- #### Calendar overlay

  The calendar overlay is a visual grid that allows users to choose a date using the mouse or keyboard. It's invoked by the calendar button.  

  The overlay is dismissed when a user chooses a date or navigates outside the overlay. The chosen date populates the input field.  

  Each date in the grid can have any of the following states:  

  - Selected - The day or month that has been chosen by the user or provided as a default.
  - Disabled - Days or months that cannot be selected by the user.
  - Disabled with reason - You can use a tooltip with disabled days or months to explain why they are unavailable.
  - Current - The current day or month. This is set by the date picker component.
  - Inactive - Trailing days of the next or previous month. These dates are set by the date picker component and can be selected by the user.
- #### Selected date

  The selected day or month is the currently selected date value. It can either be chosen or typed by the user, or you can provide a value as a default. This date appears in the input and calendar overlay with the selected state treatment.  

  The value in the input will appear in the format: *YYYY/MM/DD*   or *YYYY/MM*   , but the actual value will be sent in the format: *YYYY-MM-DD*   or *YYYY-MM*  .
- #### Disabled date - optional

  An disabled date is any date that cannot be selected by the user. Disabled dates appear in the calendar overlay with the disabled state treatment and cannot be selected.  

  Use disabled dates to reinforce constraints for dates that will not be accepted. For example: If an acceptable date can only be in the future, you could make days prior to today disabled.  

  Note that this only makes dates disabled in the calendar. A user could still type an disabled date into the input, so you should always re-validate user input and provide [validation feedback](/patterns/general/errors/validation/index.html.md)  .
- #### Locale - optional

  The locale determines the language used in the calendar overlay and in the Open calendar button aria label, for example month and day-of-week names. It doesn't affect the date input/display format, which will always be *YYYY/MM/DD*  .  

  The date picker automatically determines the locale from the page and browser, so in most cases you should not need to supply it.
- #### Start of the week - optional

  Start of the week determines which day denotes the first day of a week. This value is automatically determined from the locale, so in most cases you don't need to supply it.
- #### Validation - optional

  Error and warning messages are displayed per input field, below the input field, and above any constraint text. Use standard form field [validation](/patterns/general/errors/validation/index.html.md)  .

### Additional building blocks

The items listed below are part of the [form field](/components/form-field/index.html.md) component, which should be used together with the date picker component. Follow the guidelines for [form fields](/components/form-field/index.html.md).

- #### Form field label

  A label is a short description that specifies what the corresponding date is for. For example: *Regional launch date*   ; *Maintenance window start time*   ; or *API expiration*
- #### Form field description - optional

  A description is a broader explanation of the label that describes what the date or date and time input are used for and why it's important.
- #### Form field constraint text - optional

  Use constraint text for date or date and input constraints, such as accepted date format.

### States

- #### Disabled

  Use the disabled state when users cannot interact with input and to prevent users from modifying the value.
- #### Read-only

  Use the read-only state when the input data is not to be modified by the user but they still need to view it.

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

#### Label

- Always include a label to specify what the date or date and time value is for.
- Use descriptive labels, such as the name of the resource or process.  

  - For example:* *    

    - *Regional launch date*
    - *Maintenance window start time*
    - *API expiration*
- Follow the writing guidelines for [form field](/components/form-field/index.html.md)  .

#### Description

- Avoid directive text that states the obvious, such as *Enter a date*  .
- Follow the writing guidelines for [form field](/components/form-field/index.html.md)  .

#### Constraint text

- Follow the writing guidelines for [form field](/components/form-field/index.html.md)  .

#### Placeholder text

- Show the accepted date format using uppercase characters, in the appropriate language.  

  - For example: *YYYY/MM/DD*     in English.
- Follow the writing guidelines for [placeholder text](/components/input/index.html.md)  .

#### Error text

- Follow the guidelines for [validation](/patterns/general/errors/validation/index.html.md)  .

#### Disabled reasons

- Follow the guidelines for [short in-context disabled reasons](/patterns/general/disabled-and-read-only-states/index.html.md)  .

## Accessibility guidelines

### General accessibility guidelines

- Follow the guidelines on alternative text and Accessible Rich Internet Applications (ARIA) regions for each component.
- Make sure to define ARIA labels aligned with the language context of your application.
- Don't add unnecessary markup for roles and landmarks. Follow the guidelines for each component.
- Provide keyboard functionality to all available content in a logical and predictable order. The flow of information should make sense.

### Component-specific guidelines

#### Alternative text

- Provide alternative text for the Open calendar button using the `openCalendarAriaLabel`   property. Include the description of the date in the label, as well as the currently selected date.  

  - For example: Choose certificate expiry date, selected date is Thursday, March 4, 2021.
- Provide alternative text for the previous and next month buttons using the `nextMonthAriaLabel`   and the `previousMonthAriaLabel`   properties.  

  - For example:* Previous month and Next month.*
- Provide alternative text to be announced on the today's date in the calendar using the `todayAriaLabel`   property.  

  - For example: *Today.*

## Component Documentation and API

[All Components](https://cloudscape.design/components/index.html.md) ([API](https://cloudscape.design/components/index.html.json))
