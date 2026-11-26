---
scraped_at: '2026-04-20T08:48:20+00:00'
section: components
source_url: https://cloudscape.design/components/hotspot/index.html.md
title: Hotspot
---

# Hotspot

In hands-on tutorials, hotspots are invisible containers that mark the spots where hotspot icons should be placed. Hotspot icons are rendered by the annotation context and are used to open and close annotation popovers.

 [Get design library](/get-started/for-designers/design-resources/index.html.md) [Browse code](https://github.com/cloudscape-design/components/tree/main/src/hotspot) [View in demo](/examples/react/onboarding.html)
The API properties for this component are found here: [API Properties](https://cloudscape.design/components/hotspot/index.html.json)

## Development guidelines

This component is a part of the [Hands-on Tutorials pattern](/patterns/general/onboarding/hands-on-tutorials/index.html.md) , together with the [Annotation Context](/components/annotation-context/index.html.md) and [Tutorial Panel](/components/tutorial-panel/index.html.md) components. Place the hotspot component around elements that you want to annotate in your tutorials. A hotspot element that is not used in the currently launched tutorial will not render anything except the content of its `children` slot. A single hotspot element can be used in multiple different tutorials.

Refer to the source code of [the official Cloudscape Hands-on tutorials demo](/examples/react/onboarding.html) for comparison.

If you are new to test utility classes, you can learn more in the [introduction article](/get-started/testing/introduction/index.html.md).
## Unit testing APIs

HotspotWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findAnnotation | [AnnotationWrapper](/index.html.md) &#124; null | - | - |
| findTrigger | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> | - | - | AnnotationWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findContent | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> | - | - |
| findDismissButton | [ButtonWrapper](/components/button/index.html.md) | - | - |
| findFinishButton | [ButtonWrapper](/components/button/index.html.md) | - | - |
| findHeader | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> | - | - |
| findNextButton | [ButtonWrapper](/components/button/index.html.md) | - | - |
| findPreviousButton | [ButtonWrapper](/components/button/index.html.md) | - | - |
| findStepCounter | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> | - | - |
## Integration testing APIs

HotspotWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findAnnotation | [AnnotationWrapper](/index.html.md) | - | - |
| findTrigger | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - | AnnotationWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findContent | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findDismissButton | [ButtonWrapper](/components/button/index.html.md) | - | - |
| findFinishButton | [ButtonWrapper](/components/button/index.html.md) | - | - |
| findHeader | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findNextButton | [ButtonWrapper](/components/button/index.html.md) | - | - |
| findPreviousButton | [ButtonWrapper](/components/button/index.html.md) | - | - |
| findStepCounter | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - | The Hotspot component provides both the annotation popover and the hotspot affordance. There is no separate component for the annotation popover.
## General guidelines

### Do

- Use hotspots only in the context of a [hands-on tutorial](/patterns/general/onboarding/hands-on-tutorials/index.html.md)  .

### Don't

- Avoid placing hotspots next to inactive elements. Placing hotspots with inactive elements can cause confusion, because inactive elements aren't interactive.
- Don't place hotspots in [modals](/components/modal/index.html.md)  .

## Features

- #### Hotspot icon

  Hotspot icons are visual affordances that open and close annotation popovers. After a tutorial is launched, the [annotation context](/components/annotation-context/index.html.md)   automatically renders hotspot icons for any hotspots that belong to that tutorial. When the tutorial is dismissed, the icons disappear.
- #### Side

  Specify where the hotspot should be placed in relation to a page element. The hotspot can be placed either to the top-right or top-left of the page content or element that it refers to.
- #### Direction

  Specify the direction that the associated annotation popover should open in. To learn more about the features of annotation popovers, follow the guidelines for [annotation context.](/components/annotation-context/index.html.md)

## Accessibility guidelines

### General accessibility guidelines

- Follow the guidelines on alternative text and Accessible Rich Internet Applications (ARIA) regions for each component.
- Make sure to define ARIA labels aligned with the language context of your application.
- Don't add unnecessary markup for roles and landmarks. Follow the guidelines for each component.
- Provide keyboard functionality to all available content in a logical and predictable order. The flow of information should make sense.






## Task 1: Create a bucket

Create a bucket name. Bucket names can consist only of lowercase letters, numbers, dots (.), and hyphens (-). Step 1/3 Next

## Component Documentation and API

[All Components](https://cloudscape.design/components/index.html.md) ([API](https://cloudscape.design/components/index.html.json))
