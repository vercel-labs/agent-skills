---
scraped_at: '2026-04-20T08:49:00+00:00'
section: components
source_url: https://cloudscape.design/components/popover/index.html.md
title: Popover
---

# Popover

Provides on-demand contextual information about elements or events.

 [Get design library](/get-started/for-designers/design-resources/index.html.md) [Browse code](https://github.com/cloudscape-design/components/tree/main/src/popover)
The API properties for this component are found here: [API Properties](https://cloudscape.design/components/popover/index.html.json)

## Development guidelines

For text triggers, the color of the underline is inherited from the text color of the container. You can wrap the popover component:

- in a [box component](/components/box/index.html.md)   with the appropriate `color`   property for common use cases (for example, when the popover trigger is a [status indicator](/components/status-indicator/index.html.md)   ).
- in an element with a custom CSS color declaration. Use our [design tokens](/foundation/visual-foundation/design-tokens/index.html.md)   to select a color that is part of the system.

If you are new to test utility classes, you can learn more in the [introduction article](/get-started/testing/introduction/index.html.md).
## Unit testing APIs

PopoverWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findContent | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | options:* renderWithPortal (boolean) - Flag to find the content when the popover is rendered with a portal |
| findDismissButton | [ButtonWrapper](/components/button/index.html.md) &#124; null | - | options:* renderWithPortal (boolean) - Flag to find the dismiss button when the popover is rendered with a portal |
| findHeader | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | options:* renderWithPortal (boolean) - Flag to find the header when the popover is rendered with a portal |
| findTrigger | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> | - | - |
## Integration testing APIs

PopoverWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findContent | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | options:* renderWithPortal (boolean) - Flag to find the content when the popover is rendered with a portal |
| findDismissButton | [ButtonWrapper](/components/button/index.html.md) | - | options:* renderWithPortal (boolean) - Flag to find the dismiss button when the popover is rendered with a portal |
| findHeader | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | options:* renderWithPortal (boolean) - Flag to find the header when the popover is rendered with a portal |
| findTrigger | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
## General guidelines

### Do

- Use a popover to only provide supplemental, non-essential information. Users should be able to complete related tasks without viewing popover content.
- Always show a dismiss button when links or interactive elements are included in the content area.
- Popovers should only be triggered by user interactions with text or buttons.
- Use the [primary link](/components/link/index.html.md)   variant instead of the [secondary link](/components/link/index.html.md)   variant in popovers to help users distinguish links from other surrounding text content.
- Always use a header when the popover can be dismissed.

### Don't

- Don't use popovers to provide help content. Follow the guidelines for the [help system](/patterns/general/help-system/index.html.md)   instead.
- Don't use popovers for content that requires users to read a lot of  text or focus for long periods of time. Instead, use a [modal](/components/modal/index.html.md)   to better focus  users' attention.
- Don't launch a modal from within a popover.
- Don't launch a popover from within a popover.
- Don't include [info links](/components/link/index.html.md)   in a popover. Instead, provide help content at page level.

## Features

### Content

- #### Header - optional

  Include a header in the popover when you want to catch the user's attention, or for accessibility in a popover that can be dismissed in order to provide a screen reader with a clear boundary between the interface content and the actionable popover content. The header should accurately summarize the content, and be no longer than one sentence. Use the content area to provide details.
- #### Content area

  Use the content area for text or elements (such as a [Learn more link](/components/link/index.html.md)   ) that provide more detail or meta information about the referenced resource, event, or other content.  

  Follow the guidelines for [loading and refreshing](/patterns/general/loading-and-refreshing/index.html.md)   when asynchronously loading content into a popover.

### Controls

- #### Trigger

  Interacting with the trigger element shows the popover.  

  Popover triggers can be text or buttons:  

  - Text triggers should be used for most popovers and are distinguished by a dashed underline.
  - [Buttons](/components/button/index.html.md)     should only be used when the user is initiating a small, self-contained action. The popover then shows the result in-context.    

    - For example: Copying code to the clipboard
- #### Dismiss button - optional

  The dismiss button allow users to dismiss the popover, and is shown by default. It is required when links and interactive elements are contained in the content area, and when contained text is longer than a short sentence. When the dismiss button is disabled, users can dismiss the popover by clicking anywhere outside the popover or by pressing the *Esc*   key.

### Size and position

- #### Size

  Defines the maximum width a popover will expand to based on the content it contains. There are three maximum widths: small, medium, and large. The popover will never expand past the maximum width, though it will shrink to a smaller width to best fit its content.  

  Make sure to choose an appropriate width for the popover based on the content it contains:  

  - **Small (210px)**     - For single words or short sentences    

    - For example: A success message after the user clicks or taps on a copy to clipboard button.
  - **Medium (310px)**     - For short descriptive paragraphs    

    - For example: Providing details about the status of resources in a table.
  - **Large (460px)**     - For large amounts of content    

    - For example: Displaying detailed information on a resource feature using a [key-value pair](/components/key-value-pairs/index.html.md)       list.

  Set the `fixedWidth`   property to `true`   if you want to force the popover to expand to the maximum size you set.  

  A popover has no maximum height, and will vertically expand to accommodate all of its content.
- #### Position

  Defines where the popover will open in reference to its trigger. The popover can be placed in four positions: to the right, left, top, or bottom of the trigger. The popover defaults to showing to the right of its trigger.  

  If the popover does not fit on the screen using the set position, it will automatically reposition itself so the entire popover is shown in the viewport. In small viewports, the popover will shrink to fit the available viewport width.

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

#### Trigger

- Text-only triggers should be no more than 30 characters.  

  - For example: *Failed*     , which triggers a popover that provides details on the state of a resource.
- Button triggers should only be one or two words.  

  - For example: *Copy*
- Follow the writing guidelines for [button](/components/button/index.html.md)  .

#### Header

- Follow the writing guidelines for [header](/components/header/index.html.md)  .

#### Content

- Popover content text should be brief, ideally no longer than 150 characters for the small size and 300 characters for the large.
- Use consistent terminology, and avoid jargon.
- Use the content space to give users the information they need to progress through the UI and make informed decisions. Communicate about the functionality or suggested action relating to the corresponding UI component.
- Include terminal punctuation for complete sentences, or for a mix of a sentence fragment followed by a complete sentence. Don't use terminal punctuation for a single sentence fragment.  

  - For example:    

    - *Code copied*
    - *This instance contains insufficient memory. Stop the instance, choose a different instance type with more memory, and restart it.*

## Accessibility guidelines

### General accessibility guidelines

- Follow the guidelines on alternative text and Accessible Rich Internet Applications (ARIA) regions for each component.
- Make sure to define ARIA labels aligned with the language context of your application.
- Don't add unnecessary markup for roles and landmarks. Follow the guidelines for each component.
- Provide keyboard functionality to all available content in a logical and predictable order. The flow of information should make sense.

### Component-specific guidelines

#### Header

- For screen reader accessibility, use a header in popovers that can be dismissed.

#### Dismiss button

- If your popover includes links or interactive elements, you must always include the dismiss button. If you do not include the dismiss button, the popover could become a keyboard trap (users will be unable to focus away from popover using the keyboard alone, trapping them in the popover element).
- Provide alternative text for the dismiss button according to the alternative text guidelines using `dismissAriaLabel`   property.

#### Trigger

- When using a text-only trigger, the popover component will assign all necessary ARIA attributes.
- For button triggers, follow the guidelines for [button accessibility](/components/button/index.html.md)  .

## Component Documentation and API

[All Components](https://cloudscape.design/components/index.html.md) ([API](https://cloudscape.design/components/index.html.json))
