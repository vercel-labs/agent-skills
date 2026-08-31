---
scraped_at: '2026-04-20T08:50:39+00:00'
section: foundation
source_url: https://cloudscape.design/foundation/visual-foundation/typography/index.html.md
title: Typography
---

# Typography

With typography, you can organize and style information with purpose. It provides hierarchy and structure, serves as guidance, and has a fundamental impact on the user experience.

## Typeface

### Open Sans

 [Open Sans](https://fonts.google.com/specimen/Open+Sans) is the primary and default font of Cloudscape. Four font weights are used in the system: Open Sans Light is used for larger display font styles, Normal for the body text across the interface, and Bold and Heavy to add emphasis.

700 Bold 400 Normal 300 Light
### Monospace font

In a monospace font, each letter occupies the same amount of horizontal space regardless of the letter shape. We recommend using monospace font for the following categories of data:

- Code or sample output from a computer program
- Numeric values in a dataset
- Dynamic date and time values
- IP/MAC address
- ID strings

## Type styles

There are four different style categories, depending on the context in which typography is used. Use the styles from the category that best serve the purpose of the text you're going to display. Type properties, such as line height and letter spacing, are optimized for each category to favor readability and legibility.

### Heading styles



| Style | Typeface | Font size | Line height | Font weight | Default tag | Examples |
| --- | --- | --- | --- | --- | --- | --- |
| Open Sans | 24px | 30px | Bold | h1 | Page title |  |
| Open Sans | 20px | 24px | Bold | h2 | [Container](/components/container/index.html.md) title |  |
| Open Sans | 18px | 22px | Bold | h3 | [Card](/components/cards/index.html.md) section header[Key/value pair](/components/key-value-pairs/index.html.md) column title[Help panel](/components/help-panel/index.html.md) section header |  |
| Open Sans | 16px | 20px | Bold | h4 | Paragraph title |  |
| Open Sans | 14px | 18px | Bold | h5 | Sections within a paragraph |  |
### Body styles



| Style | Typeface | Font size | Line height | Font weight | Default tag | Examples |
| --- | --- | --- | --- | --- | --- | --- |
| Open Sans | 14px | 20px | Normal | p | Body and paragraph text. |  |
| Open Sans | 12px | 16px | Normal | small | Description text, constraint text, and errors within form fields and form elementsStep labels within a [wizard](/components/wizard/index.html.md) |  |
### Code styles



| Style | Typeface | Font size | Line height | Font weight | Default tag | Examples |
| --- | --- | --- | --- | --- | --- | --- |
| Monaco, Menlo, Consolas, Courier Prime, Courier, Courier New, monospace | 12px | 16px | Normal | code | Displaying code or computer output |  |
| Monaco, Menlo, Consolas, Courier Prime, Courier, Courier New, monospace | 14px | 20px | Normal | pre | Displaying preformatted blocks of code |  |
### Display styles



| Style | Typeface | Font size | Line height | Font weight | Default tag | Examples |
| --- | --- | --- | --- | --- | --- | --- |
| Open Sans | 42px | 48px | Bold | - | Title on a homepageNumber highlights in a [dashboard](/patterns/general/service-dashboard/index.html.md) |  |
| Open Sans | 42px | 48px | Light | - | Subheading on a homepage |  |
## Fallback fonts

A fallback font is displayed when the default isn't available. If the default font isn't available, the browser uses the `font-family` property to choose a compatible font from the list of provided fonts, starting from the top. If none of the provided fonts are available, the browser chooses a font in the generic family provided at the end, such as `sans-serif` or `monospace` . To ensure maximum compatibility between browsers and operating systems, the `font-family` property holds several font names as a fallback system.

```
.default { font-family: "Open Sans", Helvetica, Arial, sans-serif; }

.monospace { font-family: Monaco, Menlo, Consolas, "Courier Prime", Courier, "Courier New", monospace; }
```

## List styles

Lists have two purposes: to itemize data relating to a topic and to present conceptually similar information in a format that is easy for the reader to scan. There are two main types of lists: unordered and ordered lists.

### Unordered list

You can use an unordered list, also know as bulleted list, to organize pieces of information in which the order of elements doesn't make a difference.

- Highest level  

  - Nested level

### Ordered list

You can use the ordered list, also know as a numbered list, to organize pieces of information in a specific order, and also reflect the hierarchical structure of the content.

1. Highest level  

  1. Nested level

### Guidelines

- Make lists parallel in content and structure. Don't mix single words with phrases, don't start some phrases with a noun and others with a verb, and don't mix verb forms.
- Capitalize the first letter of the first word of each list item.
- Punctuate list items consistently. If at least one item in a list requires a period, then use a period for all items in that list.

## General guidelines

- For accessible use of font colors, see [colors](/foundation/visual-foundation/colors/index.html.md)  .
- Use headings according to their importance and information hierarchy, not for their visual appearance.
- Make sure you use only one `h1`   tag per page.
- Use sentence case capitalization (except for product names).
- Don't overuse monospaced font. Use it only for dedicated value types.
- Don't use font size smaller than 12px.

## Implementation

There are two components that you can use to control typography.

### Box

With the [box component](/components/box/index.html.md) , you can display and style basic elements and containers in compliance with the typography and spacing strategy of the system.
You can use the box component to style a single HTML element ( `h1` , `h2` , `h3` , `h4` , `h5` , `p` , `strong` , `small` , `code` , `pre` , `samp` ) by setting a variant that corresponds to the tag that you need. You can override the default color, font size, line height and font weight to customize the basic HTML element.

[View Documentation](/components/box/index.html.md)

### Text content

With the [text content component](/components/text-content/index.html.md) , you can style chunks of HTML that contain basic elements ( `h1` , `h2` , `h3` , `h4` , `h5` , `p` , `strong` , `small` , `code` , `pre` , `samp` , `ul` , `ol` , `a` ). You can use it as an alternative to the box component when you can't convert every single basic element to a component. For example, HTML from a content management system, or the output of Markdown file. Unlike the box component, you can use the text component to style lists ( `ul` , `ol` ) and anchors ( `a` ) that are contained in the text.

[View Documentation](/components/text-content/index.html.md)
