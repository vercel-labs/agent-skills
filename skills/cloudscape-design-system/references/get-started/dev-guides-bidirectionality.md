---
scraped_at: '2026-04-20T08:50:47+00:00'
section: get-started
source_url: https://cloudscape.design/get-started/dev-guides/bidirectionality/index.html.md
title: Bidirectionality
---

# Bidirectionality

Right-to-left development requirements and best practices for building bidirectional interfaces.

## Introduction

A bidirectional interface supports both Left-to-right (LTR) and Right-to-left (RTL) text and element flow. Prior to reading this development guide be sure to read the [Bidirectionality article](/foundation/core-principles/bidirectionality/index.html.md) under the core principles, which will provide necessary context to understand the implementation details provided in this guide.

## Bidirectionality of Cloudscape components

Cloudscape components do not declare a direction of either LTR or RTL. Instead, the direction is inherited from the context in which the components are used. There is no direction-specific API or implementation effort required to enable RTL support. Component APIs that declare directionality (such as `<Popover position="left" />` ) use [physical dimension naming conventions](/foundation/core-principles/bidirectionality/index.html.md) but are implemented using logical dimension behavior. These APIs support both LTR and RTL automatically.

In a bidirectional interface, a Cloudscape component renders according to the closest ancestor element that declares a value for direction. In a typical web application, the `<html>` element determines the language and direction of the document from the values of the `lang` and `dir` attributes (for example, `lang="en"` , `dir="ltr"` ). This direction is inherited by all descendent elements in the application. However, direction can also be re-declared using the `dir` attribute on any element to change the direction in an application subtree.

The example below demonstrates how two instances of the Cloudscape `Toggle` component can render in different directions in the same application based on the direction inherited from the closest ancestor.

I'm an LTR toggle I'm an RTL toggle
```
<div>
  <div dir="ltr">
    <SpaceBetween alignItems='start' direction='vertical' size='m'>
      <Toggle checked>I'm an LTR toggle</Toggle>

      <div dir="rtl">
        <Toggle checked>I'm an RTL toggle</Toggle>
      </div>
    </SpaceBetween>
  </div>
</div>
```

## Building custom components

### Logical properties

Custom CSS should use [logical properties](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_logical_properties_and_values) instead of physical properties in all circumstances. This allows a single property and value declaration (for example, `margin-inline-start: 10px` ) to automatically mirror the interface when switching from LTR to RTL. The list below provides a quick reference for learning the syntactical conversion between physical properties and their logical equivalents:

- **Physical property**   | **Logical property**  

  - min- *height*     | min- **block-size**
  - margin- **top**     | margin- **block-start**
  - border- **bottom**     | border- **block-end**
  - max- **width**     | max- **inline-size**
  - padding- **left**     | padding- **inline-start**
  - border- **right**     | padding- **inline-end**

We recommend enforcing the use of logical properties in your CSS with a linter. Cloudscape recommends [Stylelint](https://stylelint.io/) in conjunction with the [stylelint-use-logical plugin](https://github.com/csstools/stylelint-use-logical) . You can replicate our development environment by reviewing the [.stylelintrc](https://github.com/cloudscape-design/components/blob/main/.stylelintrc) configuration file in our components repository. A separate or additional mechanism of enforcement will be required if your CSS is authored in JavaScript through a CSS-in-JS library or inline styles in JSX.

## Detecting direction in CSS

In order to mirror your interface you may need to detect an element's direction in CSS to apply direction-specific styles overrides. For example, your component may have custom iconography that indicates direction (such as an arrow icon) that needs to be mirrored in RTL. The [:dir() pseudo-class](https://developer.mozilla.org/en-US/docs/Web/CSS/:dir) allows you to query an element's directionality to apply these overrides. The sample HTML and CSS below demonstrate how to use `:dir()` to mirror an SVG using a `transform`.

< *Render an LTR and RTL Icon arrow in the website above a code block* >

```
<div>
  <div dir="ltr">
    <svg class="my-arrow-icon"></svg>
  </div>

  <div dir="rtl">
    <svg class="my-arrow-icon"></svg>
  </div>
</div>
```

```
// This transform will mirror the arrow icon in RTL
.my-arrow-icon:dir(rtl) {
  transform: scaleX(-1);
}
```

## Detecting direction in JavaScript

It may also be necessary to detect an element's direction in JavaScript if your application implements features that depend on keyboard events, mouse events, or APIs that involve coordinates, position, or direction. For example, an application may implement a keyboard event listener that modifies the interface when the left and right arrow keys are pressed. In a RTL document the functionality of the left and right arrow keys may need to be inverted. Since this functionality exists in the JavaScript layer, the direction must be detected there as well. The example below demonstrates how to use [getComputedStyle](https://developer.mozilla.org/en-US/docs/Web/API/Window/getComputedStyle) to query the direction of an HTML element:

```
if (getComputedStyle(element).direction === 'rtl') {
  // RTL code goes here
} else {
  // LTR code goes here
}
```

The following is a list of keyboard events, mouse events, and Web APIs that may require conditional code to implement RTL functionality. Note that this list is not comprehensive, and that all application features should be tested manually.

- **Keyboard events**  

  - Any usage of the left and/or right arrow keys
- **Mouse events**  

  - Resizing
  - Reordering
  - Drag and drop
- Web APIs that involve **coordinates**   , **position**   , or **direction**  

  - <a href="https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/offsetLeft"> `offsetLeft`</a>
  - <a href="https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollLeft"> `scrollLeft`</a>
  - <a href="https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientX"> `clientX`</a>
  - <a href="https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect"> `getBoundingClientRect`</a>
  - <a href="https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageX"> `pageX`</a>

## Testing guidance

### Changing the document direction

In order to test in RTL you need to update the value of the `dir` attribute in the HTML. This can be accomplished multiple ways:

- *If you have access to a developer environment...*  

  - Set the `dir="rtl"`     on the `html`     element in your index.html file
  - Or, add the following JavaScript line to your application entry point: `document.documentElement.setAttribute('dir', 'rtl')`
- *If you don't have access to a developer environment...*  

  - Open the application in your browser, right click and choose *Inspect*     . This will open the browser's web inspector which will give you access the HTML. The HTML element will be the first element on the page. Double-click into the element and set `dir="rtl"`    .
  - Or, you can run the following line in the web inspector console: `document.documentElement.setAttribute('dir', 'rtl')`

### RTL testing checklist

1. #### Does the component/feature mirror the visual presentation when switching to RTL?

  The RTL interface should be a mirror image of LTR interface.
2. #### Does the component/feature introduce new iconography?

  Confirm all iconography that indicates directionality is mirrored.
3. #### Does the component/feature use any illustrations or images?

  Confirm all illustrations or images that indicate directionality is mirrored.
4. #### Does the component/feature have keyboard events that use the left or right keys?

  Confirm the left/right arrow keys functionality is inverted in RTL if necessary
5. #### Does the component/feature have mouse events such resizing, reordering, or drag and drop?

  Confirm that all mouse events work as intended RTL.
6. #### Does the component/feature have any animations or transforms?

  Confirm that all animations and transforms that use the inline axis are inverted in RTL.
7. #### Does the component/feature use block or inline-block display property values?

  Confirm the rendering order of the DOM elements if mirrored in RTL.
8. #### Does the component/feature use any absolute or fixed positioning?

  Confirm the positioning is mirrored in RTL

## Sources

### Features

- [HTML lang attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/lang)
- [Logical Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_logical_properties_and_values)
- [Writing Mode](https://developer.mozilla.org/en-US/docs/Web/CSS/writing-mode)
- <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/dir"> HTML **dir** attribute</a>
- <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/direction"> CSS *direction* property</a>
- <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/:dir"> CSS *:dir()* pseudoclass</a>
- <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors"> CSS *\[dir\]* attribute selector</a>

### Strategies

- [Handling different text directions](https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Handling_different_text_directions)   , by MDN
- [Understanding logical properties and values](https://www.smashingmagazine.com/2018/03/understanding-logical-properties-values/)   , by Smashing Magazine
- [Deploying CSS logical properties on web apps](https://www.smashingmagazine.com/2022/12/deploying-css-logical-properties-on-web-apps/)   , by Smashing Magazine
- [Building multi-directional layouts](https://css-tricks.com/building-multi-directional-layouts/)   , by CSS Tricks
- [Supporting Right-to-Left languages with bidirectional CSS](https://andreidobrinski.com/blog/supporting-right-to-left-languages-with-bidirectional-css/)   , by Andrei Dobrinski
