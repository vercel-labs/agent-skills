---
scraped_at: '2026-04-20T08:49:23+00:00'
section: components
source_url: https://cloudscape.design/components/spinner/index.html.md
title: Spinner
---

# Spinner

A compact, looped animation giving the user feedback that a process is currently running.

 [Get design library](/get-started/for-designers/design-resources/index.html.md) [Browse code](https://github.com/cloudscape-design/components/tree/main/src/spinner) If you are new to test utility classes, you can learn more in the [introduction article](/get-started/testing/introduction/index.html.md).
The API properties for this component are found here: [API Properties](https://cloudscape.design/components/spinner/index.html.json)

## Unit testing APIs

SpinnerWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| No methods availableThis wrapper does not provide any additional methods. |  |  |  |
## Integration testing APIs

SpinnerWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| No methods availableThis wrapper does not provide any additional methods. |  |  |  |
## General guidelines

### Do

- Use a spinner instead of a progress bar when the length of the operation is unknown.
- Use a spinner when the operation is short (under 10 seconds); use a progress bar or non-blocking notification for longer operations.
- If the operation occurs after the user takes action with a button, embed the spinner within the [button](/components/button/index.html.md)  .

## Accessibility guidelines

### General accessibility guidelines

- Follow the guidelines on alternative text and Accessible Rich Internet Applications (ARIA) regions for each component.
- Make sure to define ARIA labels aligned with the language context of your application.
- Don't add unnecessary markup for roles and landmarks. Follow the guidelines for each component.
- Provide keyboard functionality to all available content in a logical and predictable order. The flow of information should make sense.

### Component-specific guidelines

#### Alternative text

- You can provide alternative text to communicate loading status by adding a hidden [live region component](/components/live-region/index.html.md)  .  

  - For example:    
`<LiveRegion hidden={true}>Loading table content.</LiveRegion>`

## Component Documentation and API

[All Components](https://cloudscape.design/components/index.html.md) ([API](https://cloudscape.design/components/index.html.json))
