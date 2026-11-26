---
scraped_at: '2026-04-20T08:52:32+00:00'
section: patterns
source_url: https://cloudscape.design/patterns/general/help-system/index.html.md
title: Help system
---

# Help system

The help system pattern allows users to easily and quickly access help within the interface and current workflow.

## Key UX concepts

### Help and content ramp

The objective of the help system is to provide instructional content that answers these common user questions:

- **What is this?**
- **Why do I care?**
- **How do I make the right decision?**

These questions can apply to an entire page, to a specific section, or to a specific element.

The help system is also a content strategy to help users make smart decisions without overloading them with information. It provides a content ramp that progressively discloses more information as users need it. It is not simply about using the help panel. The system starts with the UI text on the page and eventually leads to external documentation. Another way to think of the content ramp is in terms of sizes or steps up the ramp, as it increases in both the depth of information and user's required attention.

## Small (bites)

The first step of the ramp is UI text on the page, which requires minimal effort for the user to read and act upon. This includes all the text on the page such as headers, descriptions, form field labels, placeholder text, and constraint text.

A A A B B C
#### A. Headers

The header for the page and sections, as well as labels for [form fields](/components/form-field/index.html.md) and [key-value pairs](/components/key-value-pairs/index.html.md) . Headers explain the subject or task in a concise manner.

#### B. Descriptions - optional

Since descriptions in the UI directly impact content density, only share information necessary for the user to inform their action in the corresponding section or element.

#### C. Input placeholders

An example that help users make decisions for an input.

#### D. Form field constraint text (not shown)

A line of text, below an input, explaining requirements and constraints of the form control.

#### E. Form field error text (not shown)

An explanation for a triggered validation error displayed below the form field.

## Medium (snack)

The second step of the ramp is content in the [help panel](/components/help-panel/index.html.md) , which extends the UI text on the page. The help panel content provides information that helps users understand concepts more fully, make good decisions, and complete tasks quickly without leaving the console for external information. This step is explicitly organized to focus on either the page, a specific section, or a specific element.

A A A B
#### A. Info links

- Info links are the triggers that open the help panel and display the corresponding content.
- An info link should always be anchored to [headers](/components/header/index.html.md)   or [form field labels](/components/form-field/index.html.md)  .

#### B. Help panel

- An extension to the UI text on the page. Aside from answering the 3 main user questions ("What is this?", "Why do I care?" and, "How do I make the right decision?"), the help panel should have in-depth information to answer additional questions such as:  

  - What do I need to do before starting the task?
  - What will the task accomplish?
  - Why is the task required? If the task is optional, how do I decide if I should do it?
  - What are the consequences of certain decisions (cost or otherwise)?
  - Why is a form field required? If a form field is optional, how do I decide if I should do it?
  - How do I decide which values to choose from a form field?
  - Definitions of products or services.
  - Descriptions of how products or services relate to each other.
  - Additional knowledge and documentation that could help customers make more informed decisions as they progress through the corresponding UI section or element.
- Display page-level content as the default in the help panel.
- The content should change when the user has either triggered an info link on the page or navigated to a new page.
- When the user closes the help panel and later reopens it within the same page view, the content should remain the same as what was previously shown. The content should not automatically switch back to the default content.

## Large (meal)

The third step of the ramp is in-depth documentation or related resources. These sources of information should typically be service documentation that navigate the user to a new tab.

A B
#### A. Learn more links - optional

- [External links](/components/link/index.html.md)   to relevant service documentation. These links may be used with information in transitional elements like [alerts](/components/alert/index.html.md)   , [flashes](/components/flashbar/index.html.md)   , and [modals](/components/modal/index.html.md)  .
- If a content ramp with the help panel cannot be implemented, stand-alone learn more links may be used as a fallback. These links should be placed after descriptions.

#### B. Learn more footer

- A list of links at the bottom of the help panel that go to relevant help topics in the service documentation.
- The links may go to other content, such as pricing pages or support pages, when absolutely necessary.
- In multipage create flows, provide links that go to the corresponding procedure or set of procedures in the service documentation.

## General guidelines

### Do

- Display page-level help content as the default [help panel](/components/help-panel/index.html.md)   content.
- Always include a page-level info link except for service homepage, even if it is the only one available on the page.
- In a multistep create flow, include the [help panel](/components/help-panel/index.html.md)   in every step.
- The [help panel](/components/help-panel/index.html.md)   content should change when the user has either triggered an info link on the page or navigated to a new page.
- When the user closes the [help panel](/components/help-panel/index.html.md)   and later reopens it within the same page view, the content should remain the same as what was previously shown. The content should not automatically switch back to the default content.
- Always place info links next to the appropriate header rather than descriptions or other elements.
- Always make the header of the help panel consistent with the header of the corresponding page, section, or element. This provides a quick reference point between the content on the page and the help panel.
- Learn more links must always navigate the user to the resource in a new tab.

### Don't

- Don't include a help panel on a service homepage.
- Don't use the stand-alone learn more links on pages that also have help panel content unless the link is used within a transitional [alert](/components/alert/index.html.md)   , [flash](/components/flashbar/index.html.md)   , or [modal](/components/modal/index.html.md)  .
- Don't include an empty [help panel](/components/help-panel/index.html.md)   on the page.

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

#### Page headers

- For [detail pages](/patterns/resource-management/details/index.html.md)   , [table views](/patterns/resource-management/view/table-view/index.html.md)   , and [card views](/patterns/resource-management/view/card-view/index.html.md)   , start the header with a noun to describe the subject of the page.
- For [create](/patterns/resource-management/create/index.html.md)   or [edit resource](/patterns/resource-management/edit/index.html.md)   flows, start the header with a verb to describe the primary action.

#### Container headers and descriptions

- Follow the writing guidelines for [headers](/components/header/index.html.md)  .

#### Form field labels and description

- Necessary descriptions should be 1-2 lines of text.  

  - For example: *These configurations are optional, and default settings have been defined to help you get started with your cluster. Turn off 'Use defaults' to modify these settings now.*
- Follow the writing guidelines for [form fields](/components/form-field/index.html.md)  .

#### Input placeholders

- Follow the writing guidelines for [inputs](/components/input/index.html.md)  .

#### Constraint text

- Follow the writing guidelines for [form fields](/components/form-field/index.html.md)  .

#### Info links

- Follow the writing guidelines for [info links](/components/link/index.html.md)  .

## Accessibility guidelines

### General accessibility guidelines

- Follow the guidelines on alternative text and Accessible Rich Internet Applications (ARIA) regions for each component.
- Make sure to define ARIA labels aligned with the language context of your application.
- Don't add unnecessary markup for roles and landmarks. Follow the guidelines for each component.
- Provide keyboard functionality to all available content in a logical and predictable order. The flow of information should make sense.

### Component-specific guidelines

#### Links

- Follow the accessibility guidelines for [links](/components/link/index.html.md)  .

#### Help panel

- Follow the accessibility guidelines for [help panel](/components/help-panel/index.html.md)  .
