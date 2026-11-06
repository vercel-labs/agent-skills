---
scraped_at: '2026-04-20T08:48:37+00:00'
section: components
source_url: https://cloudscape.design/components/link/index.html.md
title: Link
---

# Link

A link component is an anchor tag that defines a hyperlink, which a user can interact with to find out more information about a concept, task, or field.

 [Get design library](/get-started/for-designers/design-resources/index.html.md) [Browse code](https://github.com/cloudscape-design/components/tree/main/src/link) If you are new to test utility classes, you can learn more in the [introduction article](/get-started/testing/introduction/index.html.md).
The API properties for this component are found here: [API Properties](https://cloudscape.design/components/link/index.html.json)

## Unit testing APIs

LinkWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| No methods availableThis wrapper does not provide any additional methods. |  |  |  |
## Integration testing APIs

LinkWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| No methods availableThis wrapper does not provide any additional methods. |  |  |  |
## General guidelines

### Do

- Use links to navigate from one page to another or invoke the help panel.
- If navigating away would result in loss of unsaved input, use the [unsaved changes](/patterns/general/unsaved-changes/index.html.md)   dialogue instead of opening a new tab.
- All navigation links must have an `href`   attribute. Use `onFollow`   instead of `onClick`   so users can open the links in a new tab.
- Provide link text that describes the purpose of a link. Use links judiciously and thoughtfully. You can have more than one info link on a page, but use them sparingly to avoid overwhelming the user with too many links.

### Don't

- Don't use a link for actions. Instead, use a [button](/components/button/index.html.md)  .
- Don't use end punctuation for *Info*   or other fragments.
- Don't use info links in a help panel. Use info links only on the main page content, next to headers.
- Don't change the size of info links. Use the small size that is set by the info variant.
- Don't use the `external`   property with info links.

## Features

Links should be used to guide users through the console by giving them just-in-time information without overloading or distracting them with information that is too tangential or secondary to the tasks at hand.

- #### Variant

  The variant determines the visual style of the link.  

#### Normal links

  There are two variants of a normal link: `primary`   and `secondary`   . To meet accessibility requirements, choose the variant based on the link's context.  

  - A **primary**     link is underlined to provide more visual contrast with surrounding context. Use the `primary`     variant for a link adjacent to other text, such as inside body text paragraph or a component description, a learn more link in a [container header](/components/header/index.html.md)     or [form field](/components/form-field/index.html.md)     description, a item ID link in a [table](/components/table/index.html.md)     , a link in a [key-value pair](/components/key-value-pairs/index.html.md)     , a link in an [alert](/components/alert/index.html.md)    .
  - A **secondary**     link uses regular font weight. Use the `secondary`     variant where its context implies interactivity and users can identify links from other elements in its vicinity easily, such as a list of links in a [container](/components/container/index.html.md)    .

#### Info link

  An info link is bold and smaller in size. An info link is technically a button because it doesn't navigate the user to another page. Instead, it invokes the [help panel](/components/help-panel/index.html.md)   to display contextual help related to an element or section of the page. Use the `info`   variant only for a link that triggers the help panel.  

  Follow the guidelines for how to use info links in [help system](/patterns/general/help-system/index.html.md)  .
- #### External link - optional

  An external link directs users to a destination outside the current context and opens in a new tab.  

  Use external links for:  

  - Links outside the console or product.
  - Cross-service workflows where users need both pages open simultaneously.

  External links have an external icon and open in a new tab, setting clear expectations for users. Both primary and secondary link variants support external link behavior.  

  - For example: [Learn more](https://www.example.com/)

  If in the rare circumstance you're unable to use the external link icon, make sure that the link text combined with text of the enclosed sentence or paragraph clearly indicates where the user will navigate. For usability, context about an external link should precede the link. If corresponding information about the link instead follows the link, it can lead to confusion and difficulty for screen reader users who are reading through the page from top to bottom order.  

  - For example: Learn more about [links in [another site]](/components/link/)    .

  For lists of external links, don't use an icon on each link. Instead, append an external icon to the list heading or label. Ensure the heading text indicates where the group of links point and that each link in the list has a unique name. For example, you could title your group "External resources" if all links point to various external documentation articles.
- #### Size - optional

  The size sets the font size and line height of the link. The options are any of the standard [typography](/foundation/visual-foundation/typography/index.html.md)   styles.  

  - If the link is part of a sentence, choose a size that matches the surrounding text size.
  - If the link is acting as a heading, choose the appropriate heading size based on the rest of the page's hierarchy.
  - If the link is external, the external icon size will update according to the selected font size.
- #### Color - optional

  The color controls the link text color. By default, all links should use the default link color. For links on inverted backgrounds such as [flashbars](/components/flashbar/index.html.md)   , use `color="inverted"`  .

## Writing guidelines

### General writing guidelines

- Use sentence case, but continue to capitalize proper nouns and brand names correctly in context.
- Use end punctuation, except in [headers](/components/header/index.html.md)   and [buttons](/components/button/index.html.md)   . Don't use exclamation points.
- Use present-tense verbs and active voice.
- Don't use *please*   , *thank you*   , ellipsis ( *...*   ), ampersand ( *&*   ), *e.g.*   , *i.e.*   , or *etc.*   in writing.
- Avoid directional language.  

  - For example: use *previous*     not *above*     , use *following*     not *below*    .
- Use device-independent language.  

  - For example: use *choose*     or *interact*     not *click*    .

### Component-specific guidelines

#### Link text

- Don't use ambiguous phrases like *click here*   or similar vague words as link text. Instead, provide context to help the user understand where they're going when they choose the link.
- Link text should match topic titles as much as possible, but you can abbreviate a lengthy topic title as long as users will understand the context.  

  - For example: If you link to a Help topic called *Routing Queries to a Website That Is Hosted in an Amazon S3 Bucket (Public Hosted Zones Only)*     , your link text could be simply *Routing queries to a website*    .
- In some cases, you can simplify the link text even more if it will clarify the action for users.  

  - For example: If you link to a marketing web page called *APN Technology and Consulting Partners Supporting AWS Direct Connect*     , your link could be *Find a partner*    .
- For each link, add an aria label that clearly defines what the link opens. Follow the guidelines for links in the following accessibility section.

#### Info links

- Use this text: *Info*
- Avoid adding additional words unless absolutely required to prevent ambiguity.
- Use sentence case ( *Info*   , not *info*   ).
- For each link, add an aria label that clearly defines what the link opens. Follow the guidelines for links in the following accessibility section.

#### Learn more links

- When linking to documentation pages use this text: *Learn more*   , and include an external icon.
- For each link, add an aria label that clearly defines what the link opens. Follow the guidelines for links in the following accessibility section.

## Accessibility guidelines

### General accessibility guidelines

- Follow the guidelines on alternative text and Accessible Rich Internet Applications (ARIA) regions for each component.
- Make sure to define ARIA labels aligned with the language context of your application.
- Don't add unnecessary markup for roles and landmarks. Follow the guidelines for each component.
- Provide keyboard functionality to all available content in a logical and predictable order. The flow of information should make sense.

### Component-specific guidelines

#### Link

- Use `primary`   links to help differentiate link text from surrounding text when interactivity is not implied by its context.  

  - For example, use `primary`     links in blocks of text such as paragraphs.
- For links that open in a new window or tab, explicitly state this action within the `externalIconAriaLabel`   or `ariaLabel`  .  

  - If the `ariaLabel`     prop is not being used, use the `externalIconAriaLabel`     prop to express "opens in a new window".
  - If an aria-label is needed for the link for disambiguation, add ", opens in a new window" to the `ariaLabel`     prop: `<Link href="..." ariaLabel="Learn more about [subject matter], opens in new tab">Learn more</Link>`
  - Note that using both `ariaLabel`     and `externalIconAriaLabel`     directly on the `<Link>`     are not supported: ariaLabel takes priority.
- For a list of external links where the external icon is appended to the heading, ensure that information about it opening in a new tab is programmatically associated to those links.  

  - For example, set the entire list of external links to have an `aria-labelledby= "[List heading], Opens in a new tab". `
- Make sure links have descriptive and unique accessible names, especially when content is repeated.  

  - For example, two different *Info*     links should each have a different `ariaLabel`     , one with *"Info: Alternative domain names"*     and one with *"Info: SSL/TLS certificate"*    .
  - Note that info links within components that have a semantic header (Container, Form field, etc.) will automatically have the header text appended to the info link's accessible name to provide this unique context.

## Component Documentation and API

[All Components](https://cloudscape.design/components/index.html.md) ([API](https://cloudscape.design/components/index.html.json))
