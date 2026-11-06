---
scraped_at: '2026-04-20T08:50:13+00:00'
section: foundation
source_url: https://cloudscape.design/foundation/core-principles/bidirectionality/index.html.md
title: Bidirectionality
---

# Bidirectionality

Bidirectional design adjusts the visual presentation and functionality of an interface based on the text direction native to the user's preferred language.

## Introduction

### What is a bidirectional interface?

A bidirectional interface supports both Left-to-right (LTR) and Right-to-left (RTL) text and element flow. Elements that visually indicate direction such as iconography and illustrations adjust their presentation to align with the text direction. A common example of a bidirectional interface is a localized website that supports an RTL language such as [Wikipedia in Arabic](https://ar.wikipedia.org/wiki/%D8%A7%D9%84%D9%84%D8%BA%D8%A9_%D8%A7%D9%84%D8%B9%D8%B1%D8%A8%D9%8A%D8%A9) . For more examples navigate to a [Cloudscape demo](/demos/index.html.md) and choose the Right-to-left direction setting.

### Why is bidirectionality important?

More than 500 million people speak an RTL language. Arabic is the most widely used, with over 300 million native speakers, making it the fifth most spoken language globally. Adding support for bidirectionality to an interface enables customers to consume application content in the direction that aligns with their preferred language. This reduces cognitive friction and increases ease of use while expanding the size of the potential market for an application.

## Key concepts

### Logical dimensions

Physical dimensions (for example, top, right) define properties and values using *direction-absolute* terminology. By comparison, logical dimensions (for example, block-start, inline-end) provide a mechanism for defining the same properties and values using *direction-relative* terminology. The **block dimension** refers to the axis perpendicular to the flow of text. The **inline dimension** refers to the axis parallel to the flow of text. Migrating to logical dimensions when defining properties and values in an application enables a single codebase to create a compliant outcome for both LTR and RTL customers.

The list below provides a quick reference for learning the syntactical conversion between physical dimensions and their logical equivalents:

- **Physical dimension**   | **Logical dimension**  

  - `top`     | `block-start`
  - `bottom`     | `block-end`
  - `left`     | `inline-start`
  - `right`     | `inline-end`

### Mirroring

Mirroring refers to adjustments in an interface that occur when the direction is changed from LTR to RTL. In a bidirectional interface the LTR and RTL implementations should be a mirror image of one another. All elements responsible for layout and text should be mirrored. Any elements that indicate direction, progress, or passage of time (such as iconography and illustrations) should also be mirrored. The example below demonstrates how the `BreadcrumbGroup` component is mirrored in RTL.

<-nav->

1. [LTR Breadcrumb group](about:blank/index.html.md)
2. ...
3. [Page 1](about:blank/index.html.md)
4. Page 2

1. [LTR Breadcrumb group](about:blank/index.html.md)
2. [Page 1](about:blank/index.html.md)
3. Page 2

</-nav->

<-nav->

1. [RTL Breadcrumb group](about:blank/index.html.md)
2. ...
3. [Page 1](about:blank/index.html.md)
4. Page 2

1. [RTL Breadcrumb group](about:blank/index.html.md)
2. [Page 1](about:blank/index.html.md)
3. Page 2

</-nav->
However, certain types of content should **not** be mirrored and should remain consistent across both directions:

- Text that is not translated (for example, "DynamoDB")
- Code (for example, JavaScript, SQL)
- Numbers (for example, telephone numbers, zip codes)
- Email addresses
- Iconography and illustrations of physical objects (for example, magnifying glass, keyboard)

## General guidelines

- **Deep dive into the bidirectionality subject matter**   and evaluate several real world examples including the [Cloudscape demos](/demos/index.html.md)   . Some additional references are provided below in the *Sources *   section.
- **Incorporate bidirectionality into your design process**   . Pay attention to aspects of your designs that should be mirrored at implementation and communicate this to developers. Creating multiple designs for LTR and RTL is not necessary, but certain elements (such as illustrations) may require a version for each direction in order to be adequately mirrored.
- **Incorporate bidirectionality into your development process**   . This should include updates to your development environment (such as linters) and adding bidirectionality to your code review checklists. For further details refer to the [Right-to-left development guide](/get-started/dev-guides/bidirectionality/index.html.md)  .
- **Incorporate bidirectionality into your testing process**   . This should include both manual and automated testing of your interface in RTL. Utilize a native speaker of a RTL language to evaluate the integration of your localization effort with the user experience. For further details on testing refer to the testing guidance in the [Right-to-left development guide](/get-started/dev-guides/bidirectionality/index.html.md)  .

## System tools

### Bidirectional components

All Cloudscape components are bidirectional by default. There is no implementation effort as they automatically respond to the direction inherited from your application.

### Demos

The Cloudscape demos have a direction setting that enables changing the document direction between LTR and RTL. This can be used to evaluate how text and element flow are mirrored in Cloudscape components.

## Sources

### Terminology

- [Bidirectional](https://developer.mozilla.org/en-US/docs/Glossary/BiDi)   (BiDi)
- [Left-to-right](https://developer.mozilla.org/en-US/docs/Glossary/LTR)   (LTR)
- [Right-to-left](https://developer.mozilla.org/en-US/docs/Glossary/RTL)   (RTL)

### Guidance

- [RTL Styling 101](https://rtlstyling.com/posts/rtl-styling/)   , by Ahmad Shadeed
- [Bidirectionality](https://m2.material.io/design/usability/bidirectionality.html#mirroring-layout)   , by Material Design
- [Right to left](https://developer.apple.com/design/human-interface-guidelines/right-to-left)   , by Apple
