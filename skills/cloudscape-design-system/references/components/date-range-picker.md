---
scraped_at: '2026-04-20T08:47:45+00:00'
section: components
source_url: https://cloudscape.design/components/date-range-picker/index.html.md
title: Date range picker
---

# Date range picker

With the date range picker, users can specify a date and time range.

 [Get design library](/get-started/for-designers/design-resources/index.html.md) [Browse code](https://github.com/cloudscape-design/components/tree/main/src/date-range-picker)
The API properties for this component are found here: [API Properties](https://cloudscape.design/components/date-range-picker/index.html.json)

## Development guidelines

#### State management

The date range picker component is controlled. Set the `value` property and the `onChange` listener to store its value in the state of your application. Learn more about the [state management](/get-started/dev-guides/state-management/index.html.md) of Cloudscape components.

If you are new to test utility classes, you can learn more in the [introduction article](/get-started/testing/introduction/index.html.md).
## Unit testing APIs

DateRangePickerWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findDropdown | [DrpDropdownWrapper](/index.html.md) &#124; null | - | options:* expandToViewport (boolean) - Use this when the component under test is rendered with an `expandToViewport` flag. |
| findLabel | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> | Alias for findTrigger | - |
| findTrigger | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> | Returns the trigger element that can be used to open the picker dropdown. | - |
| openDropdown | - | - | - | DrpDropdownWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findApplyButton | [ButtonWrapper](/components/button/index.html.md) | - | - |
| findCancelButton | [ButtonWrapper](/components/button/index.html.md) | - | - |
| findClearButton | [ButtonWrapper](/components/button/index.html.md) &#124; null | - | - |
| findCurrentDay | [CalendarDateWrapper](/index.html.md) | Returns the day container that corresponds to the current day. | - |
| findCurrentMonth | [CalendarDateWrapper](/index.html.md) | Returns the month container that corresponds to the current month. | - |
| findCustomRelativeRangeDuration | [InputWrapper](/components/input/index.html.md) &#124; null | - | - |
| findCustomRelativeRangeUnit | [SelectWrapper](/components/select/index.html.md) &#124; null | - | - |
| findDateAt | [CalendarDateWrapper](/index.html.md) | Returns a day container on the calendar. | grid:the calendar grid. If only one calendar grid is visible (on small screens), use `'right'`.row:1-based row index of the day.column:1-based column index of the day. |
| findEndDateInput | [InputWrapper](/components/input/index.html.md) &#124; null | - | - |
| findEndTimeInput | [InputWrapper](/components/input/index.html.md) &#124; null | - | - |
| findHeader | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> | - | - |
| findMonthAt | [CalendarDateWrapper](/index.html.md) | Returns a month container on the calendar. | grid:the calendar grid. If only one calendar grid is visible (on small screens), use `'right'`.row:1-based row index of the month.column:1-based column index of the month. |
| findNextButton | [ButtonWrapper](/components/button/index.html.md) | - | - |
| findNextMonthButton | [ButtonWrapper](/components/button/index.html.md) | Alias for findNextButton for compatibility with previous versions. | - |
| findPreviousButton | [ButtonWrapper](/components/button/index.html.md) | - | - |
| findPreviousMonthButton | [ButtonWrapper](/components/button/index.html.md) | Alias for findPreviousButton for compatibility with previous versions. | - |
| findRelativeRangeRadioGroup | [RadioGroupWrapper](/components/radio-group/index.html.md) &#124; null | - | - |
| findSelectedEndDate | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findSelectedStartDate | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findSelectionModeSwitch | [SelectionModeSwitchWrapper](/index.html.md) | - | - |
| findStartDateInput | [InputWrapper](/components/input/index.html.md) &#124; null | - | - |
| findStartTimeInput | [InputWrapper](/components/input/index.html.md) &#124; null | - | - |
| findValidationError | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLSpanElement> &#124; null | - | - | CalendarDateWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findDisabledReason | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - | SelectionModeSwitchWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findModesAsSegments | [SegmentedControlWrapper](/components/segmented-control/index.html.md) | Returns the mode selector as a SegmentedControl wrapper.The mode selector is only rendered as a SegmentedControl on wide viewports. On narrow viewports, use findModesAsSelect() instead. | - |
| findModesAsSelect | [SelectWrapper](/components/select/index.html.md) | Returns the mode selector as a Select wrapper.The mode selector is only rendered as a Select on narrow viewports. On wide viewports, use findModesAsSegments() instead. | - |
## Integration testing APIs

DateRangePickerWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findDropdown | [DrpDropdownWrapper](/index.html.md) | - | options:* expandToViewport (boolean) - Use this when the component under test is rendered with an `expandToViewport` flag. |
| findLabel | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Alias for findTrigger | - |
| findTrigger | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Returns the trigger element that can be used to open the picker dropdown. | - | DrpDropdownWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findApplyButton | [ButtonWrapper](/components/button/index.html.md) | - | - |
| findCancelButton | [ButtonWrapper](/components/button/index.html.md) | - | - |
| findClearButton | [ButtonWrapper](/components/button/index.html.md) | - | - |
| findCurrentDay | [CalendarDateWrapper](/index.html.md) | Returns the day container that corresponds to the current day. | - |
| findCurrentMonth | [CalendarDateWrapper](/index.html.md) | Returns the month container that corresponds to the current month. | - |
| findCustomRelativeRangeDuration | [InputWrapper](/components/input/index.html.md) | - | - |
| findCustomRelativeRangeUnit | [SelectWrapper](/components/select/index.html.md) | - | - |
| findDateAt | [CalendarDateWrapper](/index.html.md) | Returns a day container on the calendar. | grid:the calendar grid. If only one calendar grid is visible (on small screens), use `'right'`.row:1-based row index of the day.column:1-based column index of the day. |
| findEndDateInput | [InputWrapper](/components/input/index.html.md) | - | - |
| findEndTimeInput | [InputWrapper](/components/input/index.html.md) | - | - |
| findHeader | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findMonthAt | [CalendarDateWrapper](/index.html.md) | Returns a month container on the calendar. | grid:the calendar grid. If only one calendar grid is visible (on small screens), use `'right'`.row:1-based row index of the month.column:1-based column index of the month. |
| findNextButton | [ButtonWrapper](/components/button/index.html.md) | - | - |
| findNextMonthButton | [ButtonWrapper](/components/button/index.html.md) | Alias for findNextButton for compatibility with previous versions. | - |
| findPreviousButton | [ButtonWrapper](/components/button/index.html.md) | - | - |
| findPreviousMonthButton | [ButtonWrapper](/components/button/index.html.md) | Alias for findPreviousButton for compatibility with previous versions. | - |
| findRelativeRangeRadioGroup | [RadioGroupWrapper](/components/radio-group/index.html.md) | - | - |
| findSelectedEndDate | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findSelectedStartDate | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findSelectionModeSwitch | [SelectionModeSwitchWrapper](/index.html.md) | - | - |
| findStartDateInput | [InputWrapper](/components/input/index.html.md) | - | - |
| findStartTimeInput | [InputWrapper](/components/input/index.html.md) | - | - |
| findValidationError | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - | CalendarDateWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findDisabledReason | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - | SelectionModeSwitchWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findModesAsSegments | [SegmentedControlWrapper](/components/segmented-control/index.html.md) | Returns the mode selector as a SegmentedControl wrapper.The mode selector is only rendered as a SegmentedControl on wide viewports. On narrow viewports, use findModesAsSelect() instead. | - |
| findModesAsSelect | [SelectWrapper](/components/select/index.html.md) | Returns the mode selector as a Select wrapper.The mode selector is only rendered as a Select on narrow viewports. On wide viewports, use findModesAsSegments() instead. | - |
## General guidelines

### Do

- The component can be used as a ﬁlter on a collection of items such as [table](/components/table/index.html.md)   and [card](/components/cards/index.html.md)   . See the demo for [table view with date range picker filter](/examples/react/table-date-filter.html)  .
- When there is a default value of date and time range applied across a dataset, ensure that this value is represented in the date range picker as well.
- Activate both relative and absolute date-time range selection in the overlay if a user can use either selection mechanisms for the use case. Otherwise, activate only absolute or only relative date range selection as required.
- For scenarios using absolute date-time range selection: always include the required input format in the constraint text, along with any other format constraints. Provide information about any other constraints in the placeholder text.
- Use client side validation to prevent an inverted range submission (when an end date is before a start date).
- When using relative range, set the pre-configured ranges based on the majority of the users' most frequent choices.
- Follow the guidelines for [timestamps](/patterns/general/timestamps/index.html.md)   to decide which format to use.
- Follow the guidelines for [disabled and read-only states](/patterns/general/disabled-and-read-only-states/index.html.md)  .

### Don't

- If a use case does not require users to set a custom absolute or relative range, don't use the date range picker component. Instead, to provide pre-configured relative ranges only, use the [select](/components/select/index.html.md)   component.

## Features

### Ways to select a date and time range

Users can configure a date and time range in two different ways:

- #### Absolute range

  Users define the start and end of a date and time range.  

  For example: Filter a set of resources created between July 7, 2020 and September 12, 2020.
- #### Relative range

  Users specify a time range from the current point in time.  

  For example: Filtering a data set to show resources updated in the last 5 minutes.

### Trigger

Users can open or close the component overlay, and displays the selected date and time range in the component.

- #### Date and time format

  The absolute date range time interval is shown with two options:  

  - ISO format: ISO time intervals use the [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601)     format: *YYYY-MM-DDThh:mm:ss±hh:mmZ - YYYY-MM-DDThh:mm:ss±hh:mmZ. *     For month range, use: *YYYY-MM - YYYY-MM.*    

    - In the ISO time interval, *T*       is used as a divider between the date and time and *Z*       is the zone designator for the zero UTC offset.
    - For example: *2010-01-28T14:32:35\+03:00 - 2010-01-31T12:27:18\+03:00*
  - Human-readable format: it can vary according to the locale. In US English, it follows this pattern: *Month DD, YYYY, hh:mm:ss (UTC±h:mm) - Month DD, YYYY, hh:mm:ss (UTC±h:mm). *     For month range, use: *Month, YYYY - Month, YYYY.*    

    - For example: J *anuary 31, 2010, 14:32:00 (UTC\+3:30) - January 31, 2012, 14:32:00 (UTC\+3:30)*

  The time offset represents the time difference relative to Coordinated Universal Time (UTC). Showing the time offset is optional.  

  The relative date range is shown as Last N units of time, where N is the range duration and units of time can be seconds, minutes, and so on. For example: *Last 5 minutes.*
- #### Placeholder text

  When there is no date or time range applied to the component, use the placeholder text to suggest the actions a user can perform.  

  For example, when the component is used as a filter on a collection of items, use this text: *Filter by a date and time range*  .

### Overlay

The overlay displays different controls so users can configure a date and time range. It's opened by the component trigger.

- #### Selection mechanism

  A [segmented control](/components/segmented-control/index.html.md)   that allows users to toggle between selecting a date and time range using the absolute or the relative range.
- #### Absolute range

**Day calendar**  

  Two visual grids showing dates from consecutive months where users can select the start and end date of their date range. The current month is displayed to the right by default.  

**Month calendar**  

  Two visual grids showing months from consecutive years where users can select the start and end month of their month range. The current year is displayed to the right by default.  

**Date states**  

  Each date in the grid can be in any of the following states:  

  - **Selected:**     The date that has been chosen by the user or provided as a default.    

    - Start and end date: The two ends of the selected date range.
    - In-between dates: Dates within the selected date range.
  - **Disabled:**     Dates that cannot be selected by the user. For more information about disabled dates, follow the guidelines for [date picker](/components/date-picker/index.html.md)    .
  - **Disabled with reason:**     You can use a tooltip with disabled dates to explain why they are unavailable.
  - **Today:**     Today's date, set automatically by the component.

**Inputs**  

  Users can enter or modify the start and end date and the start and end time for the absolute date and time range in these inputs. When users select the start and end dates in the calendar, the selected values are automatically reflected in the date inputs.  

  - The component uses [time input](/components/time-input/index.html.md)     for start and end time and [date picker](/components/date-picker/index.html.md)     input for start and end dates.
  - Use form field labels to clearly communicate to users the purpose of each input.
  - Use placeholder text to indicate the accepted date and time format.
  - Use constraint text below input fields to inform users about any restrictions on the value of date or time that they can enter.
  - To enable date range selection alone, use `dateOnly`     property to hide time inputs from the overlay.

  In day calendar, the time inputs default to *00:00:00*   for start time and *23:59:59*   for end time. In month calendar, the selected range spans from the first day of the start month to the last day of the end month.
- #### Relative range

**Pre-configured ranges**  

  Users can select commonly used relative ranges from a radio group, with an option to set a custom relative range. Provide the custom range option as the last one in the radio group.  

**Custom range**  

  Users can enter the range duration and select the unit of time such as seconds, minutes, and so on, to set a custom relative range. Use form field labels to inform users about the purpose of the respective input field and select.
- #### Footer

  A set of component level controls for users to perform the desired action on the selected date and time range are shown in the footer.  

  - **Clear and dismiss **     - optional: Remove the current value of date and time range set in the component and show data from all time. Don't use this button if the dataset does not allow users to see data from all time.    

    - For example, don't show this button when using the component on an event history table which can only show data for previous 90 days due to API constraints.
  - **Cancel**     : Disregard any changes made by the user.
  - **Apply**     : Confirm the date and time range selection made by the user.

### Validation

Validate a selection after users apply a date and time range.

- #### Client side errors

  If the date and time range applied by users returns an error after client side validation occurs **,**   show a contextual [alert](/components/alert/index.html.md)   above the overlay footer to display the error message. For example:  

  - The selected date range is too large. Select a range smaller than 30 days.
  - The selected date range is incomplete. Select a start and end date for the date range.
- #### Server side errors

  If the date and time range applied by users returns an error after it is submitted to the server and server-side validation occurs, show the component trigger in error state with corresponding error message below it.

[View Documentation](/patterns/general/errors/validation/index.html.md)

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

- When the component is used as a form field, use a label to describe its purpose.  

  - For example:* Maintenance window*

#### Description

- Use description text below the component label to inform users about the purpose of the selected range.  

  - For example: *Provide the date and time range for service maintenance window. Users will be unable to access the service during this time.*
- Don't use the description to show constraints on date and time range. Use [constraint text](/components/form-field/index.html.md)   instead.
- Avoid directive text that states the obvious, such as *Enter a date and time range*  .
- Follow the writing guidelines for [form field](/components/form-field/index.html.md)  .

#### Placeholder text

- Use placeholder text to show the suggested user action in the trigger.  

  - If the component is used as a filter, use this text: *Filter by a date and time range*
  - If the component is used as a form field, use this text: *Select a date and time range*

#### Segmented control

- Use the text: Absolute range and Relative range for the respective segments.
- Follow writing guidelines for [segmented control](/components/segmented-control/index.html.md)  .

#### Radio group label

- Show a label for radio group in relative range.
- Use this text: *Choose a range*
- Follow the writing guidelines for [form field](/components/form-field/index.html.md)  .

#### Radio group items

- For labels of pre-configured ranges, use the format: *Last \[duration\] \[unit of time\]*  

  - For example: *Last 5 minutes*
- For the custom range option provided last in the radio group:  

  - For the label, use this text: *Custom range *
  - Use description text below the label to provide more information about the custom range to users.    

    - For example: *Set a custom range in the past*
- Follow the writing guidelines for [radio group](/components/radio-group/index.html.md)  .

#### Custom range form field labels

- Show labels for custom relative range form fields.
- For the custom duration input field, use this text: *Duration*
- For the select, use this text: *Unit of time*

#### Custom range input placeholder text

- To suggest the immediate action users can take, use this text: *Enter duration*   in the duration input field.

#### Custom range select options

- Show the accepted units of time in the select as options.  

  - For example: *minutes*     , *days*     , *weeks*     , *months*
- Use lowercase characters.
- Don't use *(s)*   or *(es)*   at the end of a noun to signify both the singular and plural form of the noun.

#### Date and time input labels

- Show labels for respective date and time inputs.
- Use this text:  

  - *Start date*
  - *Start time*
  - *End date*
  - *End time*

#### Date and time input placeholder text

- Show the accepted date format using uppercase characters, in the appropriate language.  

  - For example: *YYYY/MM/DD *     in English for day range picker.
  - For example: *YYYY/MM*     in English for month range picker.
- Show the accepted time format using lowercase characters, in the appropriate language.  

  - For example: *hh:mm:ss *     in English.
- Follow the writing guidelines for [placeholder text](/components/input/index.html.md)  .

#### Constraint text

- Use constraint text below date and time inputs to inform users about the length of range accepted and the required time format whenever applicable.  

  - For example: *Range must be between 6 - 30 days. Use 24-hour format.*
- Keep constraint text brief and up to two lines.
- Follow the writing guidelines for [form field](/components/form-field/index.html.md)  .

#### Error text

- Use complete sentences and terminal punctuation for error text.
- Follow the writing guidelines for [error messages](/patterns/general/errors/error-messages/index.html.md)  .

#### Action buttons

- Use this text:  

  - *Clear and dismiss*
  - *Cancel*
  - *Apply*
- Follow the writing guidelines for [button](/components/button/index.html.md)  .

#### Disabled reasons

- Follow the guidelines for [short in-context disabled reasons](/patterns/general/disabled-and-read-only-states/index.html.md)  .

## Accessibility guidelines

### General accessibility guidelines

- Follow the guidelines on alternative text and Accessible Rich Internet Applications (ARIA) regions for each component.
- Make sure to define ARIA labels aligned with the language context of your application.
- Don't add unnecessary markup for roles and landmarks. Follow the guidelines for each component.
- Provide keyboard functionality to all available content in a logical and predictable order. The flow of information should make sense.

### Component-specific guidelines

- Follow the accessibility guidelines for [form field](/components/form-field/index.html.md)  .

#### Alternative text

- Provide alternative text for the previous and next month buttons using nextMonthAriaLabel and previousMonthAriaLabel fields on the `i18nStrings`   property.  

  - For example: *Previous month and Next month.*
- Provide alternative text to be announced on the today's date in the calendar using todayAriaLabel field on the `i18nStrings`   property.  

  - For example: *Today.*

## Component Documentation and API

[All Components](https://cloudscape.design/components/index.html.md) ([API](https://cloudscape.design/components/index.html.json))
