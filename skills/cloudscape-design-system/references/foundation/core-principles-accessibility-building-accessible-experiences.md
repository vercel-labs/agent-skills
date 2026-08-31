---
scraped_at: '2026-04-20T08:50:07+00:00'
section: foundation
source_url: https://cloudscape.design/foundation/core-principles/accessibility/Building-accessible-experiences/index.html.md
title: Building accessible experiences
---

# Building accessible experiences

General principles and guidelines to help build more accessible experiences using Cloudscape.

## Why build accessible experiences?

All users, regardless of their abilities, should be able to use web-based tools and complete their tasks. Building for accessibility primarily focuses on users with disabilities. However, many accessibility requirements also result in better usability and inclusion for all users. For example, providing sufficient color contrast benefits all users including those with lower vision, or those using the web on a mobile device in bright sunlight, or in a dark room, by enhancing readability and visibility, preventing strain on the eyes and improving legibility and usability. Account for the following when building:

1. Requirements that are technical and relate to the underlying code, to ensure that websites work well with assistive technologies. For example, building web-content such that it works with screen readers that read aloud content, screen magnifiers that enlarge content, and voice recognition software used to input text.
2. Requirements that relate to user interaction and visual design to help ensure that web content is available to all users. For example, instructions and feedback for website forms is also understandable by all users, including users with cognitive disabilities.

## Key accessibility principles

It's imperative to understand the needs of users with disabilities to build accessible experiences for them. As suggested by multiple international accessibility standards such as [Web Content Accessibility Guidelines (WCAG)](https://www.w3.org/TR/WCAG21/#abstract) , the following are a set of key accessibility principles to keep in mind.

### Perceivable

Information and user interface components must be able to be presented in different ways so all users can perceive them regardless of their abilities. This can be done by providing **text alternatives** for non-text content such as images, charts, or illustrations. Using content structures such as lists, tables, headings, and more to make content **adaptable** . Ensuring sufficient color contrast between elements, and conveying information through additional visual means in addition to color to Help to **distinguish** content.

### Operable

User interface components and navigation must be operable by all users regardless of their abilities or choice of user agent that retrieves and presents web content to them. Ensure all functionality is **keyboard accessible,** and not only available to mouse users. Provide **enough time** to read and use web content by enabling users to pause, stop or hide any moving content. Provide alternatives to switch off unnecessary animations that could cause **seizures and physical reactions** in some users. Help users to easily **navigate** , find content, and determine where they are. Support other **input modalities** to ensure that all users can operate functionality.

### Understandable

Information and the operation of the user interface must be understandable to all users. Make text **readable** and easy to understand, such as ensuring software can read the content aloud and generate page summaries to help users with cognitive disabilities. Make content that is repeated on several web pages appear and operate in **predictable** ways. Provide **input assistance** to users to help avoid and correct mistakes through error suggestion and identification, and descriptive labels or instructions for user interface controls.

### Robust

All web content must be interpreted by a wide variety of user agents, including assistive technologies. Ensure **compatibility** with varied user agents such as multiple combinations of operating systems and screen readers by implementing content using proper markup languages, and providing accessible names for all user interface components.

## General guidelines to build more accessible experiences

Based on the recommendations on accessibility from stakeholder communities such as the [Web Accessibility Initiative (WAI)](https://www.w3.org/WAI/design-develop/) by [World Wide Web Consortium (W3C)](https://www.w3.org/) and best practices from the [ARIA Authoring Practices Guide (APG)](https://www.w3.org/WAI/ARIA/apg/) , the following is a set of general guidelines to build accessible experiences.

### Provide sufficient contrast between foreground text and background

Insufficient color contrast can impact legibility for users with limited color vision. That is why it is important to provide enough luminance contrast to help distinguish text from its background, so that it can be read by all users including those with limited color vision.

- Ensure text on images, background gradients, buttons, and other elements have sufficient contrast with its background. Text in logos, or incidental text, such as text that happens to be in a photograph are excluded from these accessibility contrast requirements.
- Use existing [design tokens](/foundation/visual-foundation/design-tokens/index.html.md)   for attributing color to user interface components based on their functionality.
- Use color contrast analyzing tools, such as the one by [WebAim](https://webaim.org/resources/contrastchecker/)   , to check for sufficient foreground and background color contrast.
- Cloudscape examples: Text in the [primary button](/components/button/index.html.md)   has a contrast ratio greater than 4.5:1 with its background.

### Don't use color alone to convey information

Information conveyed by color alone may not be seen by users with color deficiencies. Provide additional provide additional identification that does not rely on color perception.

- Ensure additional visual cues are used for conveying information, indicating an action, prompting a response, or distinguishing a visual element beyond just color.
- Ensure the use of visible labels on [charts](/components/charts/index.html.md)   for data visualization in addition to the use of color.
- Cloudscape examples: [Flashbars](/components/flashbar/index.html.md)   , [alerts](/components/alert/index.html.md)   , and [status indicators](/components/status-indicator/index.html.md)   use color to communicate the type of status update but additionally utilize distinct icons and related text to convey the information to users.

### Make interactive elements easy to identify

Some users, including those with motor or cognitive disabilities, may not use pointer devices such as a mouse to interact with web content, and might instead use alternative modes of operation. It's important to provide distinct visual styles for interactive elements such as links and buttons to help users visually determine the interactions on a user interface component regardless of their choice of user agent.

- Ensure interactive elements are easy to identify by changing their appearance on mouse hover, keyboard focus, screen reader focus, touch-screen activation, and more.
- Ensure consistent use of visible labels, accessible names, and text alternatives for interactive components that appear across multiple pages with the same functionality, such as [text filters](/components/text-filter/index.html.md)  .
- Cloudscape examples: [Tabs](/components/tabs/index.html.md)   have distinct visual styles during mouse hover or keyboard focus.

### Don't nest interactive elements

Nesting interactive elements can create confusion for users navigating with assistive technologies like screen readers or keyboard navigation. When interactive elements are nested, it becomes unclear which element will receive focus or activation, leading to unpredictable experiences.

- Avoid placing interactive elements such as buttons, links, or form controls inside other interactive elements like clickable cards, clickable table rows, or buttons.
- Ensure that each interactive element has a single, clear purpose and can be activated independently.
- If you need multiple actions within a container, place interactive elements adjacent to each other rather than nested.
- Use proper ARIA labels and roles to clarify the relationship between related interactive elements when they appear in close proximity.
- Cloudscape examples: [Table](/components/table/index.html.md)   rows are not generally clickable, but have distinct click targets like the checkbox, the action-buttons or the item name.

### Provide clear and consistent navigation options

Consistent user interface patterns can help all users, including those with cognitive disabilities, build familiarity and predictability. Consistent navigation can help users orient themselves and navigate effectively.

- Ensure that navigational elements across pages within a website have consistent naming, styling, and positioning.
- Help users understand where they are in a website or page by providing orientation cues, such as [breadcrumbs.](/components/breadcrumb-group/index.html.md)
- Use [app layout](/components/app-layout/index.html.md)   to build consistent and predictable pages with defined areas for navigation, content areas, and tools or help panel.
- Cloudscape examples: the [service navigation](/patterns/general/service-navigation/index.html.md)   pattern guidance helps create a consistent information architecture across your websites.

### Ensure that form elements have clearly associated labels

Clear, unambiguous labels and instructions can help prevent users from making incomplete or incorrect form submissions. This further helps reduce the added churn around having to navigate through a page/form again in order to fix submission errors.

- Ensure visible labels or identifiers are present next to interactive components so that users know what input data is expected.
- Ensure that labels and headings present on a page are concise but descriptive so that they provide users with an appropriate cue to finding and navigating that content.
- Use [form field label](/components/form-field/index.html.md)   to provide a visible label for all input elements.
- Cloudscape examples: All select filter controls in [collection select filters](/components/collection-select-filter/index.html.md)   have a visible label to specify the parameters that users can filter by.

### Provide easily identifiable feedback

Important feedback that requires user action should be presented in a prominent style to help all users, including those with cognitive disabilities, easily identify it.

- Ensure that feedback for interactions are perceivable to users, such as confirming form submission, alerting when something goes wrong, or notifying of changes on the page.
- Follow the guidance provided for [validation scenarios](/patterns/general/errors/validation/index.html.md)   to ensure consistent and detailed feedback is provided to users.
- Cloudscape examples: [Form field components](/components/form-field/index.html.md)   follow a consistent error state design to inform users of errors.

### Use headings and spacing to group related content

Users who are blind or have low-vision may use assistive technologies such as screen readers to provide them the structural information on a webpage such as headings, column and row headers in tables, list items, links, and more. This allows them to better navigate the page and access information in an effective manner.

- Headings with properly annotated heading structure communicate the organization of content on a page. This can help provide in-page navigation and group content to better understand the relationships between different parts of the content.
- Provide clear and unique [page titles](/components/header/index.html.md)   on each webpage, and further organize content using descriptive [section headings](/components/header/index.html.md)   following a proper heading hierarchy.
- Cloudscape examples: The [single page create](/examples/react/form.html)   is built following a proper heading hierarchy for elements in the form.

### Create designs for different viewport sizes

Users with low vision can have difficulty reading small text and clicking on small links and form elements. These users may enlarge text in order to be able to consume the information.

- Ensure that users are able to consume all information and interact with user interface components without needing to scroll the page horizontally, especially on smaller viewports such as mobile or zoomed screens, by enabling reflow of content.
- Follow [guidance for responsive design](/foundation/core-principles/responsive-design/index.html.md)   and utilize the [tools offered by the system](/foundation/core-principles/responsive-design/index.html.md)   to achieve the same.
- Cloudscape examples: [Attribute editor](/components/attribute-editor/index.html.md)   has responsive behavior built into it so it adjusts itself on smaller viewports.

### Include image and media alternatives

Some users who are blind or have low-vision may not be able to access the information conveyed through images. Users with auditory disabilities may not be able to consume audio information in a video. It is important to provide text alternatives for media such as images and transcripts for audio content.

- Provide links to text equivalents, such as transcripts, of audio and audio described versions of videos.
- Ensure that an accessible name is provided to all informational and/or functional images. If an image is decorative it should be hidden from assistive technology by giving it an empty alt attribute (alt="') or applying aria-hidden="true".
- Provide text equivalent next to icons and icon buttons.

- Cloudscape examples: A transcript for the visual content is provided on [Meet Cloudscape](/about/index.html.md)   section.

### Use mark-up to convey meaning and structure

Ensure that information and relationships that are implied by visual formatting are also determined programmatically so that user agents, such as screen readers, can adapt content according to the needs of individual users.

- Provide semantic code structure to make information programmatically discernible and convey the same meaning as presented visually. This can be done by using proper mark-up for components such as accessible names, role, landmarks, regions, headings. Read more about technical details of accessible names on [MDN web docs](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles)  .
- Cloudscape examples: [Table](/components/table/index.html.md)   component has row headers which are cells in a column that act as a headers in a row, and can be set programmatically.

### Reflect the reading order in the code order

Allow user agents to provide an alternative presentation of content while preserving the reading order needed to understand the meaning. This helps avoid confusing or disorienting users when assistive technology is used to read the content in the page.

- Ensure that the order of elements in the code matches the logical order of the information presented.
- Cloudscape examples: The [app layout](/components/app-layout/index.html.md)   component provides a visual and programmatic page layout for several common content types such as form, table, wizard, cards, and dashboard.
