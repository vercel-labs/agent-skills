---
scraped_at: '2026-04-20T08:49:13+00:00'
section: components
source_url: https://cloudscape.design/components/segmented-control/index.html.md
title: Segmented control
---

# Segmented control

With a segmented control, users can toggle between different ways of formatting a piece of content or data.

 [Get design library](/get-started/for-designers/design-resources/index.html.md) [Browse code](https://github.com/cloudscape-design/components/tree/main/src/segmented-control)
The API properties for this component are found here: [API Properties](https://cloudscape.design/components/segmented-control/index.html.json)

## Development guidelines

#### State management

The segmented control component is controlled. Set the `selectedId` property and the `onChange` listener to store its selected option in the state of your application. Learn more about the [state management](/get-started/dev-guides/state-management/index.html.md) of Cloudscape components.

If you are new to test utility classes, you can learn more in the [introduction article](/get-started/testing/introduction/index.html.md).
## Unit testing APIs

SegmentedControlWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findSegmentById | [SegmentWrapper](/index.html.md) &#124; null | Finds the segment with the given ID. | id:ID of the element to return. |
| findSegments | Array<[ElementWrapper](/index.html.md)> | - | - |
| findSelectedSegment | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - | SegmentWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findDisabledReason | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
## Integration testing APIs

SegmentedControlWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findSegmentById | [SegmentWrapper](/index.html.md) | Finds the segment with the given ID. | id:ID of the element to return. |
| findSegments | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[ElementWrapper](/get-started/testing/core-classes/index.html.md)> | - | - |
| findSelectedSegment | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - | SegmentWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findDisabledReason | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
## General guidelines

### Do

- Segmented controls should be used to change the way a piece of content or data is formatted on the page. It doesn't trigger changes to the content or data itself.
- Use icons consistently for all segments. Either include icons for all  segments or don't include icons at all.
- Place the segmented control above the content it's related to. Keep it  close enough to the content area so that the visual relationship is  clear to users.
- When a view type isn't available, we recommend to still allow users to trigger that segment and communicate the reasons why it's unavailable in the content area. If this practice isn't applicable, you can deactivate the segment in the segmented control.
- Follow the guidelines for [disabled and read-only states](/patterns/general/disabled-and-read-only-states/index.html.md)  .

### Don't

- Don't use segmented control as [tabs](/components/tabs/index.html.md)   or [actions in headers](/components/header/index.html.md)  .
- Avoid using more than three segments within one segmented control. If  there are more than three viewing options, use a [select](/components/select/index.html.md)   instead.
- Don't deactivate more than one segment. Make sure users have at least two options to choose from.

## Features

- #### Segments

  A segmented control consists of two to three segments, each of which functions as a mutually exclusive button. The segments represent different view types of the related content, such as the chart types of a dataset.
- #### Label

  Each segmented control should have a label for the entire control. In the standard view, when all segments are visible, the label is hidden and used as an `aria-label`   on the group of segments. When space is limited in a narrow containers, and the component is displayed as a select, the label will be visible and displayed above the select component. If this causes misalignment issues with adjacent elements (for example, surrounding buttons), you can instead use `ariaLabelledBy`   on a label that is always hidden.
- #### Icon - optional

  Icons can be used to help users visualize and recognize the concepts. When the icons are self-explanatory enough, text can be omitted as long as you provide alternative text describing the view type. The alternative text is crucial since it's displayed on the interface as the label of each option when the segmented control gets replaced with a [select](/components/select/index.html.md)   component in narrow containers.  

  For example: The horizontal view, vertical view, and full view icons in the [icon set](/foundation/visual-foundation/iconography/index.html.md)   can be used to represent the respective layout type.
- #### Disabled reason - optional

  You can use a tooltip with disabled segment to explain why the segment is unavailable.

### States

- #### Selected

  The segment that is currently selected. A segmented control can have only one selected segment at a time.  

  We recommend you set the first segment to be selected by default.
- #### Unselected

  Any segment that is currently not selected and can be selected when triggered.
- #### Disabled

  The segment that can't be selected by users. Use the disabled state to prevent the user from selecting a segment.

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

#### Segment text

- The text of each segment should be a precise description of the view type.  

  - For example: Use *Line chart*     and *Bar chart*     as the segment text for line chart and bar chart.
- Limit each segment text to a maximum of two words.

#### Disabled reasons

- Follow the guidelines for [short in-context disabled reasons](/patterns/general/disabled-and-read-only-states/index.html.md)  .

## Accessibility guidelines

### General accessibility guidelines

- Follow the guidelines on alternative text and Accessible Rich Internet Applications (ARIA) regions for each component.
- Make sure to define ARIA labels aligned with the language context of your application.
- Don't add unnecessary markup for roles and landmarks. Follow the guidelines for each component.
- Provide keyboard functionality to all available content in a logical and predictable order. The flow of information should make sense.

### Component-specific guidelines

#### Keyboard interaction

- The default keyboard functionality is to focus on the selected segment within the control when tabbed.
- When the focus is on one segment, using the tab key will move the focus to the content area.
- The arrows can be used to shift focus to other segments within the control. When the focus is on a segment, pressing the enter key or space key performs the view change.

#### Labels and alt text

- When a segment has an icon without `text`   , make sure you define `iconAlt`   text for the segment.
- Define a label for the entire segmented control either with the `label`   or `ariaLabelledBy`   property, see [the API](/components/segmented-control/index.html.md)   for the descriptions of both. Don't use both `label`   and `ariaLabelledBy`   at the same time.

## Component Documentation and API

[All Components](https://cloudscape.design/components/index.html.md) ([API](https://cloudscape.design/components/index.html.json))
