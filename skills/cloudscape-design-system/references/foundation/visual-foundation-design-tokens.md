---
scraped_at: '2026-04-20T08:50:26+00:00'
section: foundation
source_url: https://cloudscape.design/foundation/visual-foundation/design-tokens/index.html.md
title: Design tokens
---

# Design tokens

A design token is an abstraction of a visual property, such as color, size, or animation.

## Key UX concepts

In the world of [atomic design](https://bradfrost.com/blog/post/extending-atomic-design/) , if components are atoms that function as the basic building blocks of the system, design tokens are the sub-atomic particles used to build components.

### Overview

A design token is an abstraction of a visual property such as color, size, or animation. Instead of using hard-coded values, such as hex values for colors, tokens are key-value pairs that represent reusable design decisions in the form of a variable. This data structure allows a design system to evolve without requiring downstream users to modify existing code or data. The key remains constant in your code, while the value can be changed at a system level or at runtime for theming.

For information on design tokens specific for data visualization, see [data visualization colors](/foundation/visual-foundation/data-vis-colors/index.html.md).

### Naming structure

Our tokens follow the CTI ( *Category > Type > Item > State* ) naming convention (e.g. color > background > input > disabled).

Structuring tokens in this manner gives us consistent and hierarchical naming of these properties. Each token starts broad and gets more specific.

- **Category **   - The category of the token's output.  

  - For example: "color" for hex values, "size" for pixels, or "duration" for seconds.
- **Type **   - A property descriptor of the category.  

  - For example: "background", "text", or "border".
- **Item **   - The element or abstracted element group that's targeted by the token.  

  - For example: "dropdown", "control", "container", or "panel".
- **Sub-item **   - Any differentiating aspect of the token or item that isn't state, often could be component variants.  

  - For example: "secondary", "primary", or "success".
- **State **   - State-dependent aspects.  

  - For example: "default", "focused", "selected", or "disabled".

## Tokens

### Colors  (340)

Sass JavaScript Sass 

| Name | Description | Themeable | Light mode | Dark mode |
| --- | --- | --- | --- | --- | 

| Name | Description | Themeable | Light mode | Dark mode |
| --- | --- | --- | --- | --- |
| $color-charts-red-300 | Color from the 'red' data visualization palette at a contrast ratio of 3:1 | No | #ea7158 | #d63f38 |
| $color-charts-red-400 | Color from the 'red' data visualization palette at a contrast ratio of 4:1 | No | #dc5032 | #ed5958 |
| $color-charts-red-500 | Color from the 'red' data visualization palette at a contrast ratio of 5:1 | No | #d13313 | #fe6e73 |
| $color-charts-red-600 | Color from the 'red' data visualization palette at a contrast ratio of 6:1 | No | #ba2e0f | #ff8a8a |
| $color-charts-red-700 | Color from the 'red' data visualization palette at a contrast ratio of 7:1 | No | #a82a0c | #ffa09e |
| $color-charts-red-800 | Color from the 'red' data visualization palette at a contrast ratio of 8:1 | No | #972709 | #ffb3b0 |
| $color-charts-red-900 | Color from the 'red' data visualization palette at a contrast ratio of 9:1 | No | #892407 | #ffc4c0 |
| $color-charts-red-1000 | Color from the 'red' data visualization palette at a contrast ratio of 10:1 | No | #7d2105 | #ffd2cf |
| $color-charts-red-1100 | Color from the 'red' data visualization palette at a contrast ratio of 11:1 | No | #721e03 | #ffe0dd |
| $color-charts-red-1200 | Color from the 'red' data visualization palette at a contrast ratio of 12:1 | No | #671c00 | #ffecea |
| $color-charts-orange-300 | Color from the 'orange' data visualization palette at a contrast ratio of 3:1 | No | #e07941 | #c55305 |
| $color-charts-orange-400 | Color from the 'orange' data visualization palette at a contrast ratio of 4:1 | No | #cc5f21 | #de6923 |
| $color-charts-orange-500 | Color from the 'orange' data visualization palette at a contrast ratio of 5:1 | No | #bc4d01 | #f27c36 |
| $color-charts-orange-600 | Color from the 'orange' data visualization palette at a contrast ratio of 6:1 | No | #a84401 | #f89256 |
| $color-charts-orange-700 | Color from the 'orange' data visualization palette at a contrast ratio of 7:1 | No | #983c02 | #fca572 |
| $color-charts-orange-800 | Color from the 'orange' data visualization palette at a contrast ratio of 8:1 | No | #8a3603 | #ffb68b |
| $color-charts-orange-900 | Color from the 'orange' data visualization palette at a contrast ratio of 9:1 | No | #7e3103 | #ffc6a4 |
| $color-charts-orange-1000 | Color from the 'orange' data visualization palette at a contrast ratio of 10:1 | No | #732c02 | #ffd4bb |
| $color-charts-orange-1100 | Color from the 'orange' data visualization palette at a contrast ratio of 11:1 | No | #692801 | #ffe1cf |
| $color-charts-orange-1200 | Color from the 'orange' data visualization palette at a contrast ratio of 12:1 | No | #602400 | #ffede2 |
| $color-charts-yellow-300 | Color from the 'yellow' data visualization palette at a contrast ratio of 3:1 | No | #b2911c | #977001 |
| $color-charts-yellow-400 | Color from the 'yellow' data visualization palette at a contrast ratio of 4:1 | No | #9c7b0b | #b08400 |
| $color-charts-yellow-500 | Color from the 'yellow' data visualization palette at a contrast ratio of 5:1 | No | #8a6b05 | #c59600 |
| $color-charts-yellow-600 | Color from the 'yellow' data visualization palette at a contrast ratio of 6:1 | No | #7b5f04 | #d3a61c |
| $color-charts-yellow-700 | Color from the 'yellow' data visualization palette at a contrast ratio of 7:1 | No | #6f5504 | #dfb52c |
| $color-charts-yellow-800 | Color from the 'yellow' data visualization palette at a contrast ratio of 8:1 | No | #654d03 | #eac33a |
| $color-charts-yellow-900 | Color from the 'yellow' data visualization palette at a contrast ratio of 9:1 | No | #5d4503 | #f1cf65 |
| $color-charts-yellow-1000 | Color from the 'yellow' data visualization palette at a contrast ratio of 10:1 | No | #553f03 | #f7db8a |
| $color-charts-yellow-1100 | Color from the 'yellow' data visualization palette at a contrast ratio of 11:1 | No | #4d3901 | #fce5a8 |
| $color-charts-yellow-1200 | Color from the 'yellow' data visualization palette at a contrast ratio of 12:1 | No | #483300 | #ffefc9 |
| $color-charts-green-300 | Color from the 'green' data visualization palette at a contrast ratio of 3:1 | No | #67a353 | #48851a |
| $color-charts-green-400 | Color from the 'green' data visualization palette at a contrast ratio of 4:1 | No | #41902c | #5a9b29 |
| $color-charts-green-500 | Color from the 'green' data visualization palette at a contrast ratio of 5:1 | No | #1f8104 | #69ae34 |
| $color-charts-green-600 | Color from the 'green' data visualization palette at a contrast ratio of 6:1 | No | #1a7302 | #7dbd4c |
| $color-charts-green-700 | Color from the 'green' data visualization palette at a contrast ratio of 7:1 | No | #176702 | #8fca61 |
| $color-charts-green-800 | Color from the 'green' data visualization palette at a contrast ratio of 8:1 | No | #145d02 | #9fd673 |
| $color-charts-green-900 | Color from the 'green' data visualization palette at a contrast ratio of 9:1 | No | #125502 | #b2df8d |
| $color-charts-green-1000 | Color from the 'green' data visualization palette at a contrast ratio of 10:1 | No | #104d01 | #c5e7a8 |
| $color-charts-green-1100 | Color from the 'green' data visualization palette at a contrast ratio of 11:1 | No | #0f4601 | #d5efbe |
| $color-charts-green-1200 | Color from the 'green' data visualization palette at a contrast ratio of 12:1 | No | #0d4000 | #e4f7d5 |
| $color-charts-teal-300 | Color from the 'teal' data visualization palette at a contrast ratio of 3:1 | No | #2ea597 | #018977 |
| $color-charts-teal-400 | Color from the 'teal' data visualization palette at a contrast ratio of 4:1 | No | #1c8e81 | #009d89 |
| $color-charts-teal-500 | Color from the 'teal' data visualization palette at a contrast ratio of 5:1 | No | #0d7d70 | #00b09b |
| $color-charts-teal-600 | Color from the 'teal' data visualization palette at a contrast ratio of 6:1 | No | #096f64 | #40bfa9 |
| $color-charts-teal-700 | Color from the 'teal' data visualization palette at a contrast ratio of 7:1 | No | #06645a | #5fccb7 |
| $color-charts-teal-800 | Color from the 'teal' data visualization palette at a contrast ratio of 8:1 | No | #045b52 | #77d7c3 |
| $color-charts-teal-900 | Color from the 'teal' data visualization palette at a contrast ratio of 9:1 | No | #03524a | #94e0d0 |
| $color-charts-teal-1000 | Color from the 'teal' data visualization palette at a contrast ratio of 10:1 | No | #014b44 | #ace9db |
| $color-charts-teal-1100 | Color from the 'teal' data visualization palette at a contrast ratio of 11:1 | No | #01443e | #c2f0e6 |
| $color-charts-teal-1200 | Color from the 'teal' data visualization palette at a contrast ratio of 12:1 | No | #003e38 | #d7f7f0 |
| $color-charts-blue-1-300 | Color from the 'blue-1' data visualization palette at a contrast ratio of 3:1 | No | #529ccb | #00819c |
| $color-charts-blue-1-400 | Color from the 'blue-1' data visualization palette at a contrast ratio of 4:1 | No | #3184c2 | #0497ba |
| $color-charts-blue-1-500 | Color from the 'blue-1' data visualization palette at a contrast ratio of 5:1 | No | #0273bb | #08aad2 |
| $color-charts-blue-1-600 | Color from the 'blue-1' data visualization palette at a contrast ratio of 6:1 | No | #0166ab | #44b9dd |
| $color-charts-blue-1-700 | Color from the 'blue-1' data visualization palette at a contrast ratio of 7:1 | No | #015b9d | #63c6e7 |
| $color-charts-blue-1-800 | Color from the 'blue-1' data visualization palette at a contrast ratio of 8:1 | No | #015292 | #79d2f0 |
| $color-charts-blue-1-900 | Color from the 'blue-1' data visualization palette at a contrast ratio of 9:1 | No | #014a87 | #98dcf5 |
| $color-charts-blue-1-1000 | Color from the 'blue-1' data visualization palette at a contrast ratio of 10:1 | No | #01437d | #b3e4f8 |
| $color-charts-blue-1-1100 | Color from the 'blue-1' data visualization palette at a contrast ratio of 11:1 | No | #003c75 | #caedfc |
| $color-charts-blue-1-1200 | Color from the 'blue-1' data visualization palette at a contrast ratio of 12:1 | No | #00366d | #ddf4ff |
| $color-charts-blue-2-300 | Color from the 'blue-2' data visualization palette at a contrast ratio of 3:1 | No | #688ae8 | #486de8 |
| $color-charts-blue-2-400 | Color from the 'blue-2' data visualization palette at a contrast ratio of 4:1 | No | #5978e3 | #6384f5 |
| $color-charts-blue-2-500 | Color from the 'blue-2' data visualization palette at a contrast ratio of 5:1 | No | #4066df | #7698fe |
| $color-charts-blue-2-600 | Color from the 'blue-2' data visualization palette at a contrast ratio of 6:1 | No | #3759ce | #8ea9ff |
| $color-charts-blue-2-700 | Color from the 'blue-2' data visualization palette at a contrast ratio of 7:1 | No | #314fbf | #a2b8ff |
| $color-charts-blue-2-800 | Color from the 'blue-2' data visualization palette at a contrast ratio of 8:1 | No | #2c46b1 | #b1c5ff |
| $color-charts-blue-2-900 | Color from the 'blue-2' data visualization palette at a contrast ratio of 9:1 | No | #273ea5 | #c3d1ff |
| $color-charts-blue-2-1000 | Color from the 'blue-2' data visualization palette at a contrast ratio of 10:1 | No | #23379b | #d2dcff |
| $color-charts-blue-2-1100 | Color from the 'blue-2' data visualization palette at a contrast ratio of 11:1 | No | #1f3191 | #dfe6ff |
| $color-charts-blue-2-1200 | Color from the 'blue-2' data visualization palette at a contrast ratio of 12:1 | No | #1b2b88 | #ecf0ff |
| $color-charts-purple-300 | Color from the 'purple' data visualization palette at a contrast ratio of 3:1 | No | #a783e1 | #8d59de |
| $color-charts-purple-400 | Color from the 'purple' data visualization palette at a contrast ratio of 4:1 | No | #9469d6 | #a173ea |
| $color-charts-purple-500 | Color from the 'purple' data visualization palette at a contrast ratio of 5:1 | No | #8456ce | #b088f5 |
| $color-charts-purple-600 | Color from the 'purple' data visualization palette at a contrast ratio of 6:1 | No | #7749bf | #bf9bf9 |
| $color-charts-purple-700 | Color from the 'purple' data visualization palette at a contrast ratio of 7:1 | No | #6b40b2 | #cbabfc |
| $color-charts-purple-800 | Color from the 'purple' data visualization palette at a contrast ratio of 8:1 | No | #6237a7 | #d6baff |
| $color-charts-purple-900 | Color from the 'purple' data visualization palette at a contrast ratio of 9:1 | No | #59309d | #dfc8ff |
| $color-charts-purple-1000 | Color from the 'purple' data visualization palette at a contrast ratio of 10:1 | No | #512994 | #e8d5ff |
| $color-charts-purple-1100 | Color from the 'purple' data visualization palette at a contrast ratio of 11:1 | No | #4a238b | #efe2ff |
| $color-charts-purple-1200 | Color from the 'purple' data visualization palette at a contrast ratio of 12:1 | No | #431d84 | #f5edff |
| $color-charts-pink-300 | Color from the 'pink' data visualization palette at a contrast ratio of 3:1 | No | #da7596 | #c64a70 |
| $color-charts-pink-400 | Color from the 'pink' data visualization palette at a contrast ratio of 4:1 | No | #ce567c | #d56889 |
| $color-charts-pink-500 | Color from the 'pink' data visualization palette at a contrast ratio of 5:1 | No | #c33d69 | #e07f9d |
| $color-charts-pink-600 | Color from the 'pink' data visualization palette at a contrast ratio of 6:1 | No | #b1325c | #eb92ad |
| $color-charts-pink-700 | Color from the 'pink' data visualization palette at a contrast ratio of 7:1 | No | #a32952 | #f5a2bb |
| $color-charts-pink-800 | Color from the 'pink' data visualization palette at a contrast ratio of 8:1 | No | #962249 | #ffb0c8 |
| $color-charts-pink-900 | Color from the 'pink' data visualization palette at a contrast ratio of 9:1 | No | #8b1b42 | #ffc1d4 |
| $color-charts-pink-1000 | Color from the 'pink' data visualization palette at a contrast ratio of 10:1 | No | #81143b | #ffd1de |
| $color-charts-pink-1100 | Color from the 'pink' data visualization palette at a contrast ratio of 11:1 | No | #780d35 | #ffdfe8 |
| $color-charts-pink-1200 | Color from the 'pink' data visualization palette at a contrast ratio of 12:1 | No | #6f062f | #ffecf1 |
| $color-charts-status-critical | Color to represent a critical error or a critically high-level of severity. For example: "Sev-1" | Yes | charts-red-1000#7d2105 | charts-red-300#d63f38 |
| $color-charts-status-high | Color to represent an error status or a high-level of severity. Use this color to represent a default error status when there is only one applicable to a chart. For example: "Failed" or "Sev-2" | Yes | charts-red-600#ba2e0f | charts-red-500#fe6e73 |
| $color-charts-status-medium | Color to represent a medium-level of severity. For example: "Sev-3" | Yes | charts-orange-400#cc5f21 | charts-orange-600#f89256 |
| $color-charts-status-low | Color to represent a warning or a low-level of severity. For example: "Warning" or "Sev-4" | Yes | charts-yellow-300#b2911c | charts-yellow-700#dfb52c |
| $color-charts-status-positive | Color to represent a positive status. *For example: "Success" or "Running" | Yes | charts-green-300#67a353 | charts-green-500#69ae34 |
| $color-charts-status-info | Color to represent an informational status. For example: "In-progress" or "Updating" | Yes | charts-blue-1-400#3184c2 | charts-blue-1-500#08aad2 |
| $color-charts-status-neutral | Color to represent a neutral status, a severity level of no impact, or the lowest-level of severity. For example: "Pending" or "Sev-5" | Yes | neutral-500#8c8c94 | neutral-500#8c8c94 |
| $color-charts-threshold-negative | The color to represent a threshold with a negative outcome. For example: A maximum limit | Yes | error-600#db0000 | error-400#ff7a7a |
| $color-charts-threshold-positive | The color to represent a threshold with a positive outcome. For example: A designated pass rate | Yes | success-600#00802f | success-500#2bb534 |
| $color-charts-threshold-info | The color to represent an informational threshold to highlight special circumstances that may have or will occur. For example: A forecasted estimate | Yes | info-600#006ce0 | info-300#75cfff |
| $color-charts-threshold-neutral | The color to represent a threshold with a neutral outcome. For example: An average or baseline | Yes | neutral-600#656871 | neutral-450#a4a4ad |
| $color-charts-line-grid | Color of the grid lines in a chart. | No | neutral-300#dedee3 | neutral-650#424650 |
| $color-charts-line-tick | Color of the tick marks in a chart. | No | neutral-300#dedee3 | neutral-650#424650 |
| $color-charts-line-axis | Color of the axis lines in a chart. | No | neutral-300#dedee3 | neutral-650#424650 |
| $color-charts-palette-categorical-1 | Color #1 on the categorical data visualization palette. | Yes | charts-blue-2-300#688ae8 | charts-blue-2-300#486de8 |
| $color-charts-palette-categorical-2 | Color #2 on the categorical data visualization palette. | Yes | charts-pink-500#c33d69 | charts-pink-500#e07f9d |
| $color-charts-palette-categorical-3 | Color #3 on the categorical data visualization palette. | Yes | charts-teal-300#2ea597 | charts-teal-300#018977 |
| $color-charts-palette-categorical-4 | Color #4 on the categorical data visualization palette. | Yes | charts-purple-500#8456ce | charts-purple-500#b088f5 |
| $color-charts-palette-categorical-5 | Color #5 on the categorical data visualization palette. | Yes | charts-orange-300#e07941 | charts-orange-300#c55305 |
| $color-charts-palette-categorical-6 | Color #6 on the categorical data visualization palette. | Yes | charts-blue-2-600#3759ce | charts-blue-2-600#8ea9ff |
| $color-charts-palette-categorical-7 | Color #7 on the categorical data visualization palette. | Yes | charts-pink-800#962249 | charts-pink-800#ffb0c8 |
| $color-charts-palette-categorical-8 | Color #8 on the categorical data visualization palette. | Yes | charts-teal-600#096f64 | charts-teal-600#40bfa9 |
| $color-charts-palette-categorical-9 | Color #9 on the categorical data visualization palette. | Yes | charts-purple-800#6237a7 | charts-purple-800#d6baff |
| $color-charts-palette-categorical-10 | Color #10 on the categorical data visualization palette. | Yes | charts-orange-600#a84401 | charts-orange-600#f89256 |
| $color-charts-palette-categorical-11 | Color #11 on the categorical data visualization palette. | Yes | charts-blue-2-900#273ea5 | charts-blue-2-900#c3d1ff |
| $color-charts-palette-categorical-12 | Color #12 on the categorical data visualization palette. | Yes | charts-pink-1100#780d35 | charts-pink-1100#ffdfe8 |
| $color-charts-palette-categorical-13 | Color #13 on the categorical data visualization palette. | Yes | charts-teal-900#03524a | charts-teal-900#94e0d0 |
| $color-charts-palette-categorical-14 | Color #14 on the categorical data visualization palette. | Yes | charts-purple-1100#4a238b | charts-purple-1100#efe2ff |
| $color-charts-palette-categorical-15 | Color #15 on the categorical data visualization palette. | Yes | charts-orange-900#7e3103 | charts-orange-900#ffc6a4 |
| $color-charts-palette-categorical-16 | Color #16 on the categorical data visualization palette. | Yes | charts-blue-2-1200#1b2b88 | charts-blue-2-1200#ecf0ff |
| $color-charts-palette-categorical-17 | Color #17 on the categorical data visualization palette. | Yes | charts-pink-400#ce567c | charts-pink-400#d56889 |
| $color-charts-palette-categorical-18 | Color #18 on the categorical data visualization palette. | Yes | charts-teal-1200#003e38 | charts-teal-1200#d7f7f0 |
| $color-charts-palette-categorical-19 | Color #19 on the categorical data visualization palette. | Yes | charts-purple-400#9469d6 | charts-purple-400#a173ea |
| $color-charts-palette-categorical-20 | Color #20 on the categorical data visualization palette. | Yes | charts-orange-1200#602400 | charts-orange-1200#ffede2 |
| $color-charts-palette-categorical-21 | Color #21 on the categorical data visualization palette. | Yes | charts-blue-2-500#4066df | charts-blue-2-500#7698fe |
| $color-charts-palette-categorical-22 | Color #22 on the categorical data visualization palette. | Yes | charts-pink-700#a32952 | charts-pink-700#f5a2bb |
| $color-charts-palette-categorical-23 | Color #23 on the categorical data visualization palette. | Yes | charts-teal-500#0d7d70 | charts-teal-500#00b09b |
| $color-charts-palette-categorical-24 | Color #24 on the categorical data visualization palette. | Yes | charts-purple-700#6b40b2 | charts-purple-700#cbabfc |
| $color-charts-palette-categorical-25 | Color #25 on the categorical data visualization palette. | Yes | charts-orange-500#bc4d01 | charts-orange-500#f27c36 |
| $color-charts-palette-categorical-26 | Color #26 on the categorical data visualization palette. | Yes | charts-blue-2-800#2c46b1 | charts-blue-2-800#b1c5ff |
| $color-charts-palette-categorical-27 | Color #27 on the categorical data visualization palette. | Yes | charts-pink-1000#81143b | charts-pink-1000#ffd1de |
| $color-charts-palette-categorical-28 | Color #28 on the categorical data visualization palette. | Yes | charts-teal-800#045b52 | charts-teal-800#77d7c3 |
| $color-charts-palette-categorical-29 | Color #29 on the categorical data visualization palette. | Yes | charts-purple-1000#512994 | charts-purple-1000#e8d5ff |
| $color-charts-palette-categorical-30 | Color #30 on the categorical data visualization palette. | Yes | charts-orange-800#8a3603 | charts-orange-800#ffb68b |
| $color-charts-palette-categorical-31 | Color #31 on the categorical data visualization palette. | Yes | charts-blue-2-1100#1f3191 | charts-blue-2-1100#dfe6ff |
| $color-charts-palette-categorical-32 | Color #32 on the categorical data visualization palette. | Yes | charts-pink-300#da7596 | charts-pink-300#c64a70 |
| $color-charts-palette-categorical-33 | Color #33 on the categorical data visualization palette. | Yes | charts-teal-1100#01443e | charts-teal-1100#c2f0e6 |
| $color-charts-palette-categorical-34 | Color #34 on the categorical data visualization palette. | Yes | charts-purple-300#a783e1 | charts-purple-300#8d59de |
| $color-charts-palette-categorical-35 | Color #35 on the categorical data visualization palette. | Yes | charts-orange-1100#692801 | charts-orange-1100#ffe1cf |
| $color-charts-palette-categorical-36 | Color #36 on the categorical data visualization palette. | Yes | charts-blue-2-400#5978e3 | charts-blue-2-400#6384f5 |
| $color-charts-palette-categorical-37 | Color #37 on the categorical data visualization palette. | Yes | charts-pink-600#b1325c | charts-pink-600#eb92ad |
| $color-charts-palette-categorical-38 | Color #38 on the categorical data visualization palette. | Yes | charts-teal-400#1c8e81 | charts-teal-400#009d89 |
| $color-charts-palette-categorical-39 | Color #39 on the categorical data visualization palette. | Yes | charts-purple-600#7749bf | charts-purple-600#bf9bf9 |
| $color-charts-palette-categorical-40 | Color #40 on the categorical data visualization palette. | Yes | charts-orange-400#cc5f21 | charts-orange-400#de6923 |
| $color-charts-palette-categorical-41 | Color #41 on the categorical data visualization palette. | Yes | charts-blue-2-700#314fbf | charts-blue-2-700#a2b8ff |
| $color-charts-palette-categorical-42 | Color #42 on the categorical data visualization palette. | Yes | charts-pink-900#8b1b42 | charts-pink-900#ffc1d4 |
| $color-charts-palette-categorical-43 | Color #43 on the categorical data visualization palette. | Yes | charts-teal-700#06645a | charts-teal-700#5fccb7 |
| $color-charts-palette-categorical-44 | Color #44 on the categorical data visualization palette. | Yes | charts-purple-900#59309d | charts-purple-900#dfc8ff |
| $color-charts-palette-categorical-45 | Color #45 on the categorical data visualization palette. | Yes | charts-orange-700#983c02 | charts-orange-700#fca572 |
| $color-charts-palette-categorical-46 | Color #46 on the categorical data visualization palette. | Yes | charts-blue-2-1000#23379b | charts-blue-2-1000#d2dcff |
| $color-charts-palette-categorical-47 | Color #47 on the categorical data visualization palette. | Yes | charts-pink-1200#6f062f | charts-pink-1200#ffecf1 |
| $color-charts-palette-categorical-48 | Color #48 on the categorical data visualization palette. | Yes | charts-teal-1000#014b44 | charts-teal-1000#ace9db |
| $color-charts-palette-categorical-49 | Color #49 on the categorical data visualization palette. | Yes | charts-purple-1200#431d84 | charts-purple-1200#f5edff |
| $color-charts-palette-categorical-50 | Color #50 on the categorical data visualization palette. | Yes | charts-orange-1000#732c02 | charts-orange-1000#ffd4bb |
| $color-charts-error-bar-marker | Color for the error bar marker in charts. | Yes | neutral-900#131920 | white#ffffff |
| $color-background-notification-severity-critical | Background color in a notification to represent a critical error or a critically high-level of severity. For example: "Sev-1" | Yes | severity-dark-red#870303 | severity-dark-red#d63f38 |
| $color-background-notification-severity-high | Background color in a notification to represent an error status or a high-level of severity. For example: "Failed" or "Sev-2" | Yes | severity-red#ce3311 | severity-red#fe6e73 |
| $color-background-notification-severity-medium | Background color in a notification to represent a medium-level of severity. For example: "Sev-3" | Yes | severity-orange#f89256 | severity-orange#f89256 |
| $color-background-notification-severity-low | Background color in a notification to represent a warning or a low-level of severity. For example: "Warning" or "Sev-4" | Yes | severity-yellow#f2cd54 | severity-yellow#f2cd54 |
| $color-background-notification-severity-neutral | Background color in a notification to represent a neutral status, a severity level of no impact, or the lowest-level of severity. For example: "Pending" or "Sev-5" | Yes | neutral-600#656871 | neutral-600#656871 |
| $color-text-notification-severity-critical | Text color in a notification to represent a critical error or a critically high-level of severity. For example: "Sev-1" | Yes | Aaneutral-100#f9f9fa | Aablack#000000 |
| $color-text-notification-severity-high | Text color in a notification to represent an error status or a high-level of severity. For example: "Failed" or "Sev-2" | Yes | Aaneutral-100#f9f9fa | Aaneutral-950#0f141a |
| $color-text-notification-severity-medium | Text color in a notification to represent a medium-level of severity. For example: "Sev-3" | Yes | Aaneutral-950#0f141a | Aaneutral-950#0f141a |
| $color-text-notification-severity-low | Text color in a notification to represent a warning or a low-level of severity. For example: "Warning" or "Sev-4" | Yes | Aaneutral-950#0f141a | Aaneutral-950#0f141a |
| $color-text-notification-severity-neutral | Text color in a notification to represent a neutral status, a severity level of no impact, or the lowest-level of severity. For example: "Pending" or "Sev-5" | Yes | Aaneutral-100#f9f9fa | Aaneutral-100#f9f9fa |
| $color-background-button-link-active | The background color of link buttons in active state. | Yes | primary-100#d1f1ff | neutral-700#333843 |
| $color-background-button-link-default | The background color of link buttons in default state. | Yes | transparent | transparent |
| $color-background-button-link-disabled | The background color of link buttons in disabled state. | Yes | transparent | transparent |
| $color-background-button-link-hover | The background color of link buttons in hover state. | Yes | primary-50#f0fbff | neutral-800#1b232d |
| $color-background-button-normal-active | The background color of normal buttons in active state. | Yes | primary-100#d1f1ff | neutral-700#333843 |
| $color-background-button-normal-default | The default background color of normal buttons. | Yes | white#ffffff | neutral-850#161d26 |
| $color-background-button-normal-disabled | The background color of normal buttons in disabled state. | Yes | white#ffffff | neutral-850#161d26 |
| $color-background-button-normal-hover | The background color of normal buttons in hover state. | Yes | primary-50#f0fbff | neutral-800#1b232d |
| $color-background-toggle-button-normal-pressed | The background color of normal toggle buttons in pressed state. | Yes | primary-100#d1f1ff | neutral-700#333843 |
| $color-background-button-primary-active | The background color of primary buttons in active state. | Yes | primary-900#002b66 | primary-400#42b4ff |
| $color-background-button-primary-default | The default background color of primary buttons. | Yes | primary-600#006ce0 | primary-400#42b4ff |
| $color-background-button-primary-disabled | The background color of primary buttons in disabled state. | Yes | neutral-250#ebebf0 | neutral-750#232b37 |
| $color-background-button-primary-hover | The background color of primary buttons in hover state. | Yes | primary-900#002b66 | primary-300#75cfff |
| $color-background-cell-shaded | The background color of shaded table cells. | Yes | neutral-150#f6f6f9 | neutral-800#1b232d |
| $color-background-card | The background color of a card. | Yes | white#ffffff | neutral-850#161d26 |
| $color-background-container-content | The background color of container main content areas. For example: content areas of form sections, containers, tables, and cards. | Yes | white#ffffff | neutral-850#161d26 |
| $color-background-container-header | The background color of container headers. For example: headers of form sections, containers, tables, and card collections. | Yes | white#ffffff | neutral-850#161d26 |
| $color-background-control-checked | The background color of a checked form control. For example: background fill of a selected radio button, checked checkbox, and toggle that is switched on. | Yes | primary-600#006ce0 | primary-400#42b4ff |
| $color-background-control-default | The default background color of form controls. For example: radio buttons and checkboxes default background fill color. | Yes | white#ffffff | neutral-850#161d26 |
| $color-background-control-disabled | The background color of a disabled form control. For example: background fill of a disabled radio button and checkbox. | Yes | neutral-300#dedee3 | neutral-700#333843 |
| $color-background-dropdown-item-default | The default background color of dropdown items. For example: select, multiselect, autosuggest, and datepicker dropdown backgrounds. | Yes | white#ffffff | neutral-800#1b232d |
| $color-background-dropdown-item-filter-match | The background color of text that matches a user's query. For example: the background of text matching a query entered into a table filter, select, multiselect, or autosuggest. | Yes | primary-50#f0fbff | neutral-700#333843 |
| $color-background-dropdown-item-hover | The background color of dropdown items on hover. For example: background of hovered items in select, multiselect, autosuggest, and datepicker dropdowns. | Yes | neutral-200#f3f3f7 | neutral-900#131920 |
| $color-background-home-header | The background color of the home header, displayed on the Service's home page. | Yes | neutral-950#0f141a | neutral-950#0f141a |
| $color-background-input-default | The default background color of form inputs. For example: background fill of an input, textarea, autosuggest, and trigger of a select and multiselect. | Yes | white#ffffff | neutral-850#161d26 |
| $color-background-input-disabled | The background color of a disabled form input. For example: background fill of a disabled input, textarea, autosuggest, and trigger of a select and multiselect. | Yes | neutral-250#ebebf0 | neutral-800#1b232d |
| $color-background-item-selected | The background color of a selected item. For example: tokens, selected table rows, cards, and tile backgrounds. | Yes | primary-50#f0fbff | primary-1000#001129 |
| $color-background-layout-main | The background color of the main content area on a page. For example: content area in app layout. | Yes | white#ffffff | neutral-850#161d26 |
| $color-background-layout-toggle-active | The background color of the app layout toggle button when it's active. | Yes | neutral-650#424650 | neutral-650#424650 |
| $color-background-layout-toggle-default | The default background color of the app layout toggle button. | Yes | neutral-650#424650 | neutral-650#424650 |
| $color-background-layout-toggle-hover | The background color of the app layout toggle button on hover. | Yes | neutral-600#656871 | neutral-600#656871 |
| $color-background-layout-toggle-selected-active | The background color of the app layout toggle button when it's selected and active. | Yes | primary-600#006ce0 | primary-400#42b4ff |
| $color-background-layout-toggle-selected-default | The default background color of the app layout toggle button when it's selected. | Yes | primary-600#006ce0 | primary-400#42b4ff |
| $color-background-layout-toggle-selected-hover | The background color of the app layout toggle button on hover when it's selected. | Yes | primary-700#004a9e | primary-300#75cfff |
| $color-background-notification-blue | Background color for blue notifications. For example: blue badges and info flash messages. | Yes | info-600#006ce0 | info-600#006ce0 |
| $color-background-notification-green | Background color for green notifications. For example: green badges and success flash messages. | Yes | success-600#00802f | success-600#00802f |
| $color-background-notification-grey | Background color for grey notifications. For example: grey badges. | Yes | neutral-650#424650 | neutral-600#656871 |
| $color-background-notification-red | Background color for red notifications. For example: red badges and error flash messages. | Yes | error-600#db0000 | error-600#db0000 |
| $color-background-notification-yellow | Background color for yellow notifications. For example: yellow badges and warning flash messages. | Yes | warning-400#ffe347 | warning-400#ffe347 |
| $color-background-popover | Background color for the popover container. | Yes | white#ffffff | neutral-800#1b232d |
| $color-background-progress-bar-value-default | The default background color of the progress bar value. | Yes | primary-600#006ce0 | primary-400#42b4ff |
| $color-background-progress-bar-default | The default background color of the progress bar. | Yes | neutral-250#ebebf0 | neutral-700#333843 |
| $color-background-segment-active | The background color of the active segment in a segmented control. | Yes | primary-600#006ce0 | primary-400#42b4ff |
| $color-background-segment-default | The background color of inactive segments in a segmented control. | Yes | white#ffffff | neutral-850#161d26 |
| $color-background-segment-disabled | The background color of disabled segments in a segmented control. | Yes | white#ffffff | neutral-850#161d26 |
| $color-background-segment-hover | The background color of inactive segments in a segmented control on hover. | Yes | primary-50#f0fbff | neutral-800#1b232d |
| $color-background-slider-range-default | The default background color of the slider range. | Yes | primary-600#006ce0 | primary-400#42b4ff |
| $color-background-slider-range-active | The background color of the slider range in active state. | Yes | primary-700#004a9e | primary-300#75cfff |
| $color-background-slider-handle-default | The default background color of the slider handle. | Yes | primary-600#006ce0 | primary-400#42b4ff |
| $color-background-slider-handle-active | The background color of the slider handle in active state. | Yes | primary-700#004a9e | primary-300#75cfff |
| $color-background-slider-track-default | The default background color of the slider track. | Yes | neutral-500#8c8c94 | neutral-600#656871 |
| $color-background-status-error | The background color of an item in error state. For example: error alerts. | Yes | error-50#fff5f5 | error-1000#1f0000 |
| $color-background-status-info | The background color of an informational item. For example: information alerts. | Yes | info-50#f0fbff | info-1000#001129 |
| $color-background-dialog | The background color of the feedback/input dialogue box. | Yes | info-50#f0fbff | info-1000#001129 |
| $color-background-status-success | The background color of an item in success state. For example: success alerts. | Yes | success-50#effff1 | success-1000#001401 |
| $color-background-status-warning | The background color of an item in warning state. For example: warning alerts. | Yes | warning-50#fffef0 | warning-1000#191100 |
| $color-background-toggle-checked-disabled | The background color of checked toggles in disabled state. | Yes | primary-200#b8e7ff | primary-900#002b66 |
| $color-background-avatar-gen-ai | The gen-ai background color of avatars. | No | radial-gradient(circle farthest-corner at top right, #b8e7ff 0%, #0099ff 25%, #5c7fff 40% , #8575ff 60%, #962eff 80%) | radial-gradient(circle farthest-corner at top right, #b8e7ff 0%, #0099ff 25%, #5c7fff 40% , #8575ff 60%, #962eff 80%) |
| $color-background-avatar-default | The default background color of avatars. | No | neutral-650#424650 | neutral-650#424650 |
| $color-text-avatar | The text and icon color of avatars. | No | Aawhite#ffffff | Aawhite#ffffff |
| $color-background-loading-bar-gen-ai | The background color of gen-ai loading bars. | No | linear-gradient(90deg, #b8e7ff 0%, #0099ff 10%, #5c7fff 24%, #8575ff 50%, #962eff 76%, #0099ff 90%, #b8e7ff 100%) | linear-gradient(90deg, #b8e7ff 0%, #0099ff 10%, #5c7fff 24%, #8575ff 50%, #962eff 76%, #0099ff 90%, #b8e7ff 100%) |
| $color-background-chat-bubble-outgoing | The background color of outgoing chat bubble. | Yes | transparent | transparent |
| $color-background-chat-bubble-incoming | The background color of incoming chat bubble. | Yes | neutral-150#f6f6f9 | neutral-950#0f141a |
| $color-text-chat-bubble-outgoing | Text color of outgoing chat bubble. | Yes | Aaneutral-950#0f141a | Aaneutral-350#c6c6cd |
| $color-text-chat-bubble-incoming | Text color of incoming chat bubble. | Yes | Aaneutral-950#0f141a | Aaneutral-350#c6c6cd |
| $color-border-button-link-disabled | The border color of link buttons in disabled state. | Yes | background-button-link-disabledtransparent | background-button-link-disabledtransparent |
| $color-border-button-normal-active | The border color of normal buttons in active state. | Yes | primary-900#002b66 | primary-300#75cfff |
| $color-border-button-normal-default | The border color of normal buttons. | Yes | primary-600#006ce0 | primary-400#42b4ff |
| $color-border-toggle-button-normal-pressed | The border color of normal toggle buttons in pressed state. | Yes | primary-600#006ce0 | primary-400#42b4ff |
| $color-border-button-normal-disabled | The border color of normal buttons in disabled state. | Yes | neutral-400#b4b4bb | neutral-600#656871 |
| $color-text-button-normal-disabled | The text color of normal buttons in disabled state. | Yes | Aaneutral-500#8c8c94 | Aaneutral-500#8c8c94 |
| $color-border-button-normal-hover | The border color of normal buttons in hover state. | Yes | primary-900#002b66 | primary-300#75cfff |
| $color-text-button-icon-disabled | The color of icon buttons in disabled state. | Yes | Aaneutral-500#8c8c94 | Aaneutral-500#8c8c94 |
| $color-border-button-primary-disabled | The border color of primary buttons in disabled state. | Yes | neutral-250#ebebf0 | neutral-750#232b37 |
| $color-text-button-primary-disabled | The text color of primary buttons in disabled state. | Yes | Aaneutral-500#8c8c94 | Aaneutral-500#8c8c94 |
| $color-item-selected | The highlight color for selected items. For example: borders of tokens and selected table rows, and check icons in selected dropdown items. | Yes | primary-600#006ce0 | primary-400#42b4ff |
| $color-border-card | The border color of a card. | Yes | neutral-350#c6c6cd | neutral-650#424650 |
| $color-border-container-top | The top border color for containers and first item in dropdowns. For example: the top border of a card, dropdown, and table. | Yes | transparent | transparent |
| $color-border-control-default | The default border color of form controls. For example: radio buttons and checkboxes. | Yes | neutral-500#8c8c94 | neutral-500#8c8c94 |
| $color-border-divider-default | The default color for dividers. For example: dividers in column layout, expanding sections, side nav, help panel, between table rows and dropdown items, and inside containers. | Yes | neutral-350#c6c6cd | neutral-650#424650 |
| $color-border-divider-secondary | The border color for row dividers. For example: row dividers for table and collection preferences. | Yes | neutral-250#ebebf0 | neutral-750#232b37 |
| $color-border-dropdown-container | The border color of the dropdown container. For example: border color of the dropdown container in button dropdown, select, and multi-select. | Yes | neutral-400#b4b4bb | neutral-600#656871 |
| $color-border-dropdown-item-hover | The border color of dropdown items on hover. For example: border of hovered items in select, multiselect, autosuggest, and hovered days in datepicker. | Yes | neutral-500#8c8c94 | neutral-600#656871 |
| $color-border-input-default | The default border color of form inputs. For example: input, textarea, autosuggest, datepicker, select, and multiselect. | Yes | neutral-500#8c8c94 | neutral-600#656871 |
| $color-border-input-focused | The color of focus states for form inputs. For example: input, textarea, autosuggest, datepicker, select, and multiselect. | Yes | primary-600#006ce0 | primary-400#42b4ff |
| $color-border-item-focused | The color of focus states. For example: the focus ring around interactive elements. | Yes | primary-600#006ce0 | primary-400#42b4ff |
| $color-border-dropdown-item-focused | The color of focus states for dropdown items. For example: the focus ring around selectable elements in the dropdown of button dropdown, select, and multi-select. | Yes | neutral-650#424650 | neutral-300#dedee3 |
| $color-border-item-selected | The border color of a selected item. For example: tokens, selected table rows, selected cards, and selected tile borders. | Yes | primary-600#006ce0 | primary-400#42b4ff |
| $color-border-popover | The border color of the popover. | Yes | neutral-400#b4b4bb | neutral-600#656871 |
| $color-border-segment-active | Deprecated - this token is no longer in use. | Yes | neutral-650#424650 | neutral-300#dedee3 |
| $color-border-segment-default | Deprecated - this token is no longer in use. | Yes | neutral-650#424650 | neutral-300#dedee3 |
| $color-border-segment-disabled | Deprecated - this token is no longer in use. | Yes | neutral-650#424650 | neutral-300#dedee3 |
| $color-border-segment-hover | Deprecated - this token is no longer in use. | Yes | neutral-650#424650 | neutral-300#dedee3 |
| $color-border-status-error | The border color of an item in error state. For example: error alerts. | Yes | error-600#db0000 | error-400#ff7a7a |
| $color-border-status-info | The border color of an informational item. For example: information alerts. | Yes | info-600#006ce0 | info-400#42b4ff |
| $color-border-status-success | The border color of an item in success state. For example: success alerts. | Yes | success-600#00802f | success-500#2bb534 |
| $color-border-status-warning | The border color of an item in warning state. For example: warning alerts. | Yes | warning-900#855900 | warning-500#fbd332 |
| $color-border-dialog | The border color of the feedback/input dialogue box. | Yes | info-600#006ce0 | info-400#42b4ff |
| $color-foreground-control-default | The color used to mark enabled form controls. For example: the checkmark on checkboxes, inner circle on radio buttons, and handle on toggles. | Yes | white#ffffff | neutral-950#0f141a |
| $color-foreground-control-disabled | The color used to mark disabled form controls. For example: the checkmark on checkboxes, inner circle on radio buttons, and handle on toggles. | Yes | white#ffffff | neutral-850#161d26 |
| $color-foreground-control-read-only | The color used to mark readonly form controls. For example: the checkmark on checkboxes, inner circle on radio buttons, and handle on toggles. | Yes | neutral-600#656871 | neutral-450#a4a4ad |
| $color-text-accent | The accent text color used to guide a user. For example: the highlighted page in the side navigation, active tab text, selected day text color in date picker, and hover state in expandable section. | Yes | Aaprimary-600#006ce0 | Aaprimary-400#42b4ff |
| $color-text-body-default | The default color of non-heading text and body content. For example: text in a paragraph tag, table cell data, form field labels and values. | Yes | Aaneutral-950#0f141a | Aaneutral-350#c6c6cd |
| $color-text-body-secondary | The color of text that is secondary to base text. For example: text in the navigation and tools panels. | Yes | Aaneutral-650#424650 | Aaneutral-350#c6c6cd |
| $color-text-breadcrumb-current | The text color that marks the breadcrumb item for the page the user is currently viewing. | Yes | Aaneutral-600#656871 | Aaneutral-500#8c8c94 |
| $color-text-breadcrumb-icon | The color used for the icon delimiter between breadcrumb items. | Yes | Aaneutral-500#8c8c94 | Aaneutral-600#656871 |
| $color-text-button-inline-icon-default | The default color of inline button icons. | Yes | Aaprimary-600#006ce0 | Aaprimary-400#42b4ff |
| $color-text-button-inline-icon-disabled | The color of inline button icons in disabled state. | Yes | Aaneutral-400#b4b4bb | Aaneutral-600#656871 |
| $color-text-button-inline-icon-hover | The color of inline button icons in hover state. | Yes | Aaprimary-900#002b66 | Aaprimary-300#75cfff |
| $color-text-button-normal-active | The active text color of normal buttons. For example: Active text color in normal and link buttons. | Yes | Aaprimary-900#002b66 | Aaprimary-300#75cfff |
| $color-text-toggle-button-normal-pressed | The pressed text color of normal toggle buttons. | Yes | Aaprimary-900#002b66 | Aaprimary-300#75cfff |
| $color-text-button-normal-default | The default text color of normal buttons. | Yes | Aaprimary-600#006ce0 | Aaprimary-400#42b4ff |
| $color-text-button-normal-hover | The hover text color of normal buttons. | Yes | Aaprimary-900#002b66 | Aaprimary-300#75cfff |
| $color-text-button-link-active | The text color of link buttons in active state. | Yes | Aaprimary-900#002b66 | Aaprimary-300#75cfff |
| $color-text-button-link-default | The default text color of link buttons. | Yes | Aaprimary-600#006ce0 | Aaprimary-400#42b4ff |
| $color-text-button-link-disabled | The text color of link buttons in disabled state. | Yes | Aaneutral-400#b4b4bb | Aaneutral-600#656871 |
| $color-text-button-link-hover | The text color of link buttons in hover state. | Yes | Aaprimary-900#002b66 | Aaprimary-300#75cfff |
| $color-text-button-primary-active | The active text color of primary buttons. | Yes | Aawhite#ffffff | Aaneutral-950#0f141a |
| $color-text-button-primary-default | The default text color of primary buttons. | Yes | Aawhite#ffffff | Aaneutral-950#0f141a |
| $color-text-button-primary-hover | The hover text color of primary buttons. | Yes | Aawhite#ffffff | Aaneutral-950#0f141a |
| $color-text-counter | The default color for counters. For example: counters in table headers | Yes | Aaneutral-600#656871 | Aaneutral-450#a4a4ad |
| $color-text-dropdown-item-default | The default text color of dropdown items. For example: label and label tag text color for autosuggest, select, and multiselect. | Yes | Aaneutral-950#0f141a | Aaneutral-300#dedee3 |
| $color-text-dropdown-item-disabled | The text color of disabled dropdown items. For example: label, label tag, description, and tag text color of a disabled item in a select, multiselect, and autosuggest. | Yes | Aaneutral-400#b4b4bb | Aaneutral-600#656871 |
| $color-text-dropdown-item-filter-match | The color of text matching a user's query. For example: the text matching a query entered into a table filter, select, multiselect, or autosuggest. | Yes | Aaprimary-600#006ce0 | Aaprimary-300#75cfff |
| $color-text-dropdown-item-highlighted | The text color of hovered or selected dropdown items. For example: label text color of the item on hover in a select, multiselect, and autosuggest. | Yes | Aaneutral-950#0f141a | Aaneutral-250#ebebf0 |
| $color-text-empty | The color of text in non-dropdown empty states. For example: tables, card collections, and attribute editor empty state text. | Yes | Aaneutral-600#656871 | Aaneutral-300#dedee3 |
| $color-text-form-default | The default color of form field labels and values. For example: the label in form fields, checkboxes, radio buttons, toggles, and the value in inputs and text areas. | Yes | Aaneutral-950#0f141a | Aaneutral-300#dedee3 |
| $color-text-form-secondary | The color of secondary text in form fields and controls. For example: the description and constraint text in form fields, the descriptions in checkboxes, radio buttons, toggles, and any additional info in an attribute editor. | Yes | Aaneutral-600#656871 | Aaneutral-450#a4a4ad |
| $color-text-group-label | The default color for group labels. For example: group label in dropdown part of button dropdown, select, and multiselect, and group label in table and cards' preferences content selector. | Yes | Aaneutral-650#424650 | Aaneutral-350#c6c6cd |
| $color-text-label-gen-ai | The default color for labels indicating that content is produced by generative AI. | No | Aapurple-700#7300e5 | Aapurple-400#bf80ff |
| $color-text-heading-default | The default color for headings 2-5. For example: headings in containers, form sections, forms, and app layout panels. | Yes | Aaneutral-950#0f141a | Aaneutral-250#ebebf0 |
| $color-text-heading-secondary | The default color for secondary heading text such as page and container descriptions. For example: descriptions in containers such as form sections, tables, and card collections, as well as form page descriptions. | Yes | Aaneutral-650#424650 | Aaneutral-450#a4a4ad |
| $color-text-home-header-default | The color of the home header's text, displayed on the Service's home page. | Yes | Aaneutral-250#ebebf0 | Aaneutral-250#ebebf0 |
| $color-text-home-header-secondary | The color of the home header's secondary text, displayed on the Service's home page. | Yes | Aaneutral-350#c6c6cd | Aaneutral-350#c6c6cd |
| $color-text-input-disabled | The color of the text value in a disabled input. For example: text in a disabled input, autosuggest, datepicker, and the trigger of a select and multiselect. | Yes | Aaneutral-400#b4b4bb | Aaneutral-600#656871 |
| $color-text-input-placeholder | The color of placeholder text in an input. For example: placeholder text in an input, autosuggest, datepicker, and the trigger of a select and multiselect. | Yes | Aaneutral-600#656871 | Aaneutral-450#a4a4ad |
| $color-text-interactive-active | The color of clickable elements in their active state. For example: tabs and icons. | Yes | Aaneutral-950#0f141a | Aaneutral-100#f9f9fa |
| $color-text-interactive-default | The color of clickable elements in their default state. For example: tabs, and icons. | Yes | Aaneutral-650#424650 | Aaneutral-300#dedee3 |
| $color-text-interactive-disabled | The color of clickable elements in their disabled state. For example: disabled tabs, button text, and icons. | Yes | Aaneutral-400#b4b4bb | Aaneutral-600#656871 |
| $color-text-interactive-hover | The color of clickable elements on hover. For example: icons on hover. | Yes | Aaneutral-950#0f141a | Aaneutral-100#f9f9fa |
| $color-text-toggle-button-icon-pressed | The pressed text color of icon toggle buttons. | Yes | Aaneutral-950#0f141a | Aaneutral-100#f9f9fa |
| $color-text-interactive-inverted-default | The default color of clickable elements in the flashbar. For example: The dismiss icon button in a flashbar. | Yes | Aaneutral-300#dedee3 | Aaneutral-300#dedee3 |
| $color-text-interactive-inverted-hover | The hover color of clickable elements in the flashbar. For example: The dismiss icon button in a flashbar. | Yes | Aaneutral-100#f9f9fa | Aaneutral-100#f9f9fa |
| $color-text-label | The default color for non-form labels. For example: the key in key/value pairs and card's sections labels. | Yes | Aaneutral-950#0f141a | Aaneutral-300#dedee3 |
| $color-text-layout-toggle | The default color of the app layout toggle. | Yes | Aawhite#ffffff | Aawhite#ffffff |
| $color-text-layout-toggle-active | The color of the app layout toggle button when it's active. | Yes | Aawhite#ffffff | Aaneutral-850#161d26 |
| $color-text-layout-toggle-hover | The color of the app layout toggle button on hover. | Yes | Aaprimary-600#006ce0 | Aaprimary-400#42b4ff |
| $color-text-layout-toggle-selected | The color of the app layout toggle button when it's selected. | Yes | Aawhite#ffffff | Aaneutral-950#0f141a |
| $color-text-link-default | The default color for links. For example: text in an anchor tag, info links, breadcrumb links, and icon links. | Yes | Aaprimary-600#006ce0 | Aaprimary-400#42b4ff |
| $color-text-link-hover | The hover color for links. For example: text in an anchor tag, info links, breadcrumb links, and icon links. | Yes | Aaprimary-900#002b66 | Aaprimary-300#75cfff |
| $color-text-link-secondary-default | The default color for secondary links. For example: links with lower visual emphasis or supplementary content. | Yes | Aaprimary-600#006ce0 | Aaprimary-400#42b4ff |
| $color-text-link-secondary-hover | The hover color for secondary links. For example: links with lower visual emphasis or supplementary content. | Yes | Aaprimary-900#002b66 | Aaprimary-300#75cfff |
| $color-text-link-info-default | The default color for info links. | Yes | Aaprimary-600#006ce0 | Aaprimary-400#42b4ff |
| $color-text-link-info-hover | The hover color for info links. | Yes | Aaprimary-900#002b66 | Aaprimary-300#75cfff |
| $color-text-notification-default | Default text color for notifications. For example: the text on badges and flashes. | Yes | Aaneutral-100#f9f9fa | Aaneutral-100#f9f9fa |
| $color-text-segment-active | The text color of the active segment in a segmented control. | Yes | Aawhite#ffffff | Aaneutral-950#0f141a |
| $color-text-segment-default | The text color of inactive segments in a segmented control. | Yes | Aaneutral-650#424650 | Aaneutral-300#dedee3 |
| $color-text-segment-hover | The text color of inactive segments in a segmented control on hover. | Yes | Aaprimary-900#002b66 | Aaprimary-300#75cfff |
| $color-text-status-error | The color of error text and icons. For example: form field error text and error status indicators. | Yes | Aaerror-600#db0000 | Aaerror-400#ff7a7a |
| $color-text-status-inactive | The color of inactive and loading text and icons. For example: table and card collection loading states icon and text and inactive and pending status indicators. | Yes | Aaneutral-600#656871 | Aaneutral-450#a4a4ad |
| $color-text-status-info | The color of info text and icons. For example: info status indicators and info alert icon. | Yes | Aainfo-600#006ce0 | Aainfo-400#42b4ff |
| $color-text-status-success | The color of success text and icons. For example: success status indicators and success alert icon. | Yes | Aasuccess-600#00802f | Aasuccess-500#2bb534 |
| $color-text-status-warning | The color of warning icons. | Yes | Aawarning-900#855900 | Aawarning-500#fbd332 |
| $color-text-top-navigation-title | The color of the title in the top navigation. | Yes | Aaneutral-950#0f141a | Aaneutral-100#f9f9fa |
| $color-board-placeholder-active | The color of board placeholder in active state. | No | neutral-250#ebebf0 | neutral-600#656871 |
| $color-board-placeholder-hover | The color of board placeholder in hovered state. | No | primary-100#d1f1ff | primary-600#006ce0 |
| $color-drag-placeholder-active | The color of drag placeholder in active state. | No | neutral-250#ebebf0 | neutral-600#656871 |
| $color-drag-placeholder-hover | The color of drag placeholder in hovered state. | No | primary-100#d1f1ff | primary-600#006ce0 |
| $color-dropzone-background-default | The default color of file upload dropzone background. | Yes | white#ffffff | neutral-850#161d26 |
| $color-dropzone-background-hover | The color of file upload dropzone background in hovered state. | Yes | primary-50#f0fbff | primary-1000#001129 |
| $color-dropzone-text-default | The default color of file upload dropzone text. | Yes | Aaneutral-650#424650 | Aaneutral-350#c6c6cd |
| $color-dropzone-text-hover | The color of file upload dropzone text in hovered state. | Yes | Aaneutral-650#424650 | Aaneutral-350#c6c6cd |
| $color-dropzone-border-default | The default color of file upload dropzone border. | Yes | neutral-500#8c8c94 | neutral-600#656871 |
| $color-dropzone-border-hover | The color of file upload dropzone border in hovered state. | Yes | primary-900#002b66 | primary-300#75cfff |
| $color-tree-view-connector-line | The color of the tree view connector lines. | Yes | neutral-500#8c8c94 | neutral-300#dedee3 |
### Typography  (38)

Sass JavaScript Sass 

| Name | Description | Themeable | Value |
| --- | --- | --- | --- | 

| Name | Description | Themeable | Value |
| --- | --- | --- | --- |
| $font-family-base | The default font family that will be applied globally to the product interface. | Yes | 'Open Sans', 'Helvetica Neue', Roboto, Arial, sans-serif |
| $font-family-display | The font family for display text. Defaults to the base font family. | Yes | 'Open Sans', 'Helvetica Neue', Roboto, Arial, sans-serif |
| $font-family-heading | The font family for headings and component headers. Defaults to the base font family. | Yes | 'Open Sans', 'Helvetica Neue', Roboto, Arial, sans-serif |
| $font-family-monospace | The monospace font family that will be applied globally to the product interface. | Yes | Monaco, Menlo, Consolas, 'Courier Prime', Courier, 'Courier New', monospace |
| $font-size-body-m | The default font size for regular body text. For example, <p> tags in text content, or button text. | Yes | 14px |
| $font-size-body-s | The default font size for small body text. For example, form field descriptions, or badge text. | Yes | 12px |
| $font-size-display-l | The default font size for large display text. | Yes | 42px |
| $font-size-heading-xl | The default font size for h1s. | Yes | 24px |
| $font-size-heading-l | The default font size for h2s. | Yes | 20px |
| $font-size-heading-m | The default font size for h3s. | Yes | 18px |
| $font-size-heading-s | The default font size for h4s. | Yes | 16px |
| $font-size-heading-xs | The default font size for h5s. | Yes | 14px |
| $font-size-tabs | The default font size for tabs. | Yes | 16px |
| $font-weight-tabs | The default font weight for tabs. | Yes | 700 |
| $font-weight-tabs-disabled | The default font weight for disabled tabs. | Yes | 700 |
| $line-height-tabs | The default line height for tabs. | Yes | 20px |
| $font-weight-button | The default font weight for button text. | Yes | 700 |
| $font-weight-alert-header | The default font weight for alert header text. | Yes | 700 |
| $font-weight-flashbar-header | The default font weight for flashbar header text. | Yes | 700 |
| $font-weight-heading-xl | The default font weight for h1s. | Yes | 700 |
| $font-weight-heading-l | The default font weight for h2s. | Yes | 700 |
| $font-weight-heading-m | The default font weight for h3s. | Yes | 700 |
| $font-weight-heading-s | The default font weight for h4s. | Yes | 700 |
| $font-weight-heading-xs | The default font weight for h5s. | Yes | 700 |
| $letter-spacing-display-l | The default letter spacing for large display text. | Yes | -0.03em |
| $letter-spacing-heading-xl | The default letter spacing for h1s. | Yes | -0.02em |
| $letter-spacing-heading-l | The default letter spacing for h2s. | Yes | -0.015em |
| $letter-spacing-heading-m | The default letter spacing for h3s. | Yes | -0.010em |
| $letter-spacing-heading-s | The default letter spacing for h4s. | Yes | -0.005em |
| $letter-spacing-heading-xs | The default letter spacing for h5s. | Yes | normal |
| $line-height-body-m | The default line height for regular body text. | Yes | 20px |
| $line-height-body-s | The default line height for small body text. | Yes | 16px |
| $line-height-display-l | The default line height for large display text. | Yes | 48px |
| $line-height-heading-xl | The default line height for h1s. | Yes | 30px |
| $line-height-heading-l | The default line height for h2s. | Yes | 24px |
| $line-height-heading-m | The default line height for h3s. | Yes | 22px |
| $line-height-heading-s | The default line height for h4s. | Yes | 20px |
| $line-height-heading-xs | The default line height for h5s. | Yes | 18px |
### Spacing  (29)

Sass JavaScript Sass 

| Name | Description | Themeable | Comfortable mode | Compact mode |
| --- | --- | --- | --- | --- | 

| Name | Description | Themeable | Comfortable mode | Compact mode |
| --- | --- | --- | --- | --- |
| $space-alert-vertical | The vertical padding inside alert components. | Yes | 8px | 4px |
| $space-button-horizontal | The horizontal padding inside buttons. | Yes | 20px | 16px |
| $space-button-vertical | The vertical padding inside buttons. | Yes | 4px | 2px |
| $space-card-horizontal-default | The default horizontal padding inside a card. | Yes | 20px | 20px |
| $space-card-horizontal-embedded | The horizontal padding inside embedded a card. | Yes | 12px | 10px |
| $space-card-vertical-default | The default vertical padding inside a card. | Yes | 16px | 12px |
| $space-card-vertical-embedded | The vertical padding inside embedded a card. | Yes | 10px | 8px |
| $space-container-horizontal | The horizontal padding inside a container. | No | 20px | 20px |
| $space-field-horizontal | The horizontal padding inside field components. | No | 12px | 12px |
| $space-tabs-vertical | The vertical padding inside tabs. | Yes | 4px | 2px |
| $space-tree-view-indentation | The indentation of tree view items. | No | 24px | 24px |
| $space-scaled-xxxs | The XXXS spacing unit which scales between modes. | No | 2px | 0px |
| $space-scaled-xxs | The XXS spacing unit which scales between modes. For example: vertical space between form field label and control. | No | 4px | 2px |
| $space-scaled-xs | The XS spacing unit which scales between modes. For example: horizontal space between buttons in an action stripe. | No | 8px | 4px |
| $space-scaled-s | The S spacing unit which scales between modes. For example: vertical padding inside a popover. | No | 12px | 8px |
| $space-scaled-m | The M spacing unit which scales between modes. For example: horizontal padding inside a popover. | No | 16px | 12px |
| $space-scaled-l | The L spacing unit which scales between modes. For example: vertical space between form fields. | No | 20px | 16px |
| $space-scaled-xl | The XL spacing unit which scales between modes. For example: horizontal space between wizard navigation and content. | No | 24px | 20px |
| $space-scaled-xxl | The XXL spacing unit which scales between modes. For example: left indentation of grouped options in a select. | No | 32px | 24px |
| $space-scaled-xxxl | The XXXL spacing unit which scales between modes. For example: horizontal padding for app layout and split panel content on large screens. | No | 40px | 32px |
| $space-static-xxxs | The static XXXS spacing unit. | No | 2px | 2px |
| $space-static-xxs | The static XXS spacing unit. | No | 4px | 4px |
| $space-static-xs | The static XS spacing unit. | No | 8px | 8px |
| $space-static-s | The static S spacing unit. | No | 12px | 12px |
| $space-static-m | The static M spacing unit. | No | 16px | 16px |
| $space-static-l | The static L spacing unit. | No | 20px | 20px |
| $space-static-xl | The static XL spacing unit. | No | 24px | 24px |
| $space-static-xxl | The static XXL spacing unit. | No | 32px | 32px |
| $space-static-xxxl | The static XXXL spacing unit. | No | 40px | 40px |
### Motion  (13)

Sass JavaScript Sass 

| Name | Description | Themeable | Value |
| --- | --- | --- | --- | 

| Name | Description | Themeable | Value |
| --- | --- | --- | --- |
| $motion-duration-avatar-gen-ai-gradient | The duration for gradient motion of gen-ai avatars. | No | 3600ms |
| $motion-duration-avatar-loading-dots | The duration for loading motion of avatars. | No | 1200ms |
| $motion-easing-avatar-gen-ai-gradient | The easing curve for gradient motion of gen-ai avatars. | No | cubic-bezier(0.7, 0, 0.3, 1) |
| $motion-easing-responsive | The easing curve for providing responsive yet smooth visual feedback. | No | cubic-bezier(0, 0, 0, 1) |
| $motion-easing-sticky | The easing curve for making an element sticky to a certain state. | No | cubic-bezier(1, 0, 0.83, 1) |
| $motion-easing-expressive | The easing curve for drawing a user's attention in an expressive way. | No | cubic-bezier(0.84, 0, 0.16, 1) |
| $motion-duration-responsive | The duration for making the motion feel quick and responsive. | No | 115ms |
| $motion-duration-expressive | The duration for accommodating the motion with more expressiveness. | No | 165ms |
| $motion-duration-complex | The duration for drawing more attention or accommodating for more complexity. | No | 250ms |
| $motion-keyframes-fade-in | The CSS keyframes for showing an element. | No | awsui-fade-in-35003c |
| $motion-keyframes-fade-out | The CSS keyframes for hiding an element. | No | awsui-fade-out-35003c |
| $motion-keyframes-status-icon-error | The CSS keyframes applied to an error status icon to draw the user's attention. | No | awsui-status-icon-error-35003c |
| $motion-keyframes-scale-popup | The CSS keyframes for scaling up an element to draw the user's attention. | No | awsui-scale-popup-35003c |
### Borders  (40)

Sass JavaScript Sass 

| Name | Description | Themeable | Value |
| --- | --- | --- | --- | 

| Name | Description | Themeable | Value |
| --- | --- | --- | --- |
| $border-radius-alert | The border radius of alerts. | Yes | 12px |
| $border-radius-badge | The border radius of badges. | Yes | 4px |
| $border-radius-button | The border radius of buttons and segmented control's segments. | Yes | 20px |
| $border-radius-calendar-day-focus-ring | The border radius of the focused day in date picker and date range picker. | Yes | 3px |
| $border-radius-card-default | The border radius of default cards. | Yes | 16px |
| $border-radius-card-embedded | The border radius of embedded cards. | Yes | 8px |
| $border-radius-container | The border radius of containers. Also used in container-based components like table, cards, expandable section, and modal. | Yes | 16px |
| $border-radius-control-circular-focus-ring | The border radius of the focus indicator of circular controls. For example: radio button. | Yes | 4px |
| $border-radius-control-default-focus-ring | The border radius of the focus indicator of interactive elements. For example: button, link, toggle, pagination controls, expandable section header, popover trigger. | Yes | 4px |
| $border-radius-dropdown | The border radius of dropdown containers. For example: button dropdown, select, multiselect, autosuggest, date picker, date range picker. | Yes | 8px |
| $border-radius-dropzone | The border radius of file upload dropzone. | Yes | 12px |
| $border-radius-flashbar | The border radius of flash messages in flashbars. | Yes | 12px |
| $border-radius-item | The border radius of items that can be selected from a list. For example: select options, table rows, calendar days. | Yes | 8px |
| $border-radius-input | The border radius of form controls. For example: input, select. | Yes | 8px |
| $border-radius-popover | The border radius of popovers. | Yes | 8px |
| $border-radius-tabs-focus-ring | The border radius of tabs' focus indicator. Used in tabs and in the code editor status bar. | Yes | 20px |
| $border-radius-tiles | The border radius of tiles. | Yes | 8px |
| $border-radius-token | The border radius of tokens. For example: token groups, multiselect tokens, property filter tokens. | Yes | 8px |
| $border-radius-chat-bubble | The border radius of chat bubbles. | No | 8px |
| $border-radius-tutorial-panel-item | The border radius of tutorials inside a tutorial panel. | Yes | 8px |
| $border-width-card | The border width of a card. | Yes | 1px |
| $border-width-card-selected | The border width of a selected card. | Yes | 2px |
| $border-width-item-selected | The border width of selected items, like table rows. | Yes | 2px |
| $border-width-alert | The border width of alerts. | Yes | 2px |
| $border-width-alert-block-start | The block-start border width of alerts. | Yes | 2px |
| $border-width-alert-block-end | The block-end border width of alerts. | Yes | 2px |
| $border-width-alert-inline-start | The inline-start border width of alerts. | Yes | 2px |
| $border-width-alert-inline-end | The inline-end border width of alerts. | Yes | 2px |
| $border-width-button | The border width of buttons. | Yes | 2px |
| $border-width-dropdown | The border width of dropdowns. | Yes | 2px |
| $border-width-field | The border width of form fields. | Yes | 1px |
| $border-width-popover | The border width of popovers. | Yes | 2px |
| $border-width-token | The border width of tokens. | Yes | 2px |
| $border-width-icon-small | The visual stroke width of small icons. | Yes | 2px |
| $border-width-icon-normal | The visual stroke width of normal icons. | Yes | 2px |
| $border-width-icon-medium | The visual stroke width of medium icons. | Yes | 2px |
| $border-width-icon-big | The visual stroke width of big icons. | Yes | 3px |
| $border-width-icon-large | The visual stroke width of large icons. | Yes | 4px |
| $border-radius-action-card-default | The border radius of default action cards. | Yes | 16px |
| $border-radius-action-card-embedded | The border radius of embedded action cards. | Yes | 8px |
### Other  (2)

Sass JavaScript Sass 

| Name | Description | Themeable | Value | Light mode | Dark mode | Comfortable mode | Compact mode |
| --- | --- | --- | --- | --- | --- | --- | --- | 

| Name | Description | Themeable | Value | Light mode | Dark mode | Comfortable mode | Compact mode |
| --- | --- | --- | --- | --- | --- | --- | --- |
| $shadow-card | The shadow of a card. | Yes |  | none | none |  |  |
| $shadow-container-active | Shadow for containers and cards in active state. | No |  | 0px 1px 1px 1px #e9ebed, 0px 6px 36px #0007161a | 0px 1px 1px 1px #192534, 0px 6px 36px #00040c |  |  |
## Usage guidelines

No design system will ever be able to cover 100% of all customer needs, which means you may not always find what you're looking for. This is where design tokens come into play. Design tokens provide a way for you to create product-specific experiences and custom components in a way that is on-brand and [visual mode](/foundation/visual-foundation/visual-modes/index.html.md) compliant. For the best results, follow the guidelines below:

### Tip 1: Use existing components first

Before using design tokens, double-check to make sure what you're trying to achieve can't already be done with an existing component. Design tokens are great for building custom components, but the number-one recommendation will always be to use the pre-built components provided by the design system. This is because of the time and maintenance that custom components require. Custom components also miss certain benefits, such built-in testing, accessibility, responsiveness, and consistency, that our existing components provide.

### Tip 2: Be thoughtful and intentional

Design tokens are development tools that have design decisions built into them. These decisions are encapsulated in their names, so it's best to use them in ways that align with their original intent. In other words, don't use the `$color-text-form-secondary` token for a custom component's border color just because it's convenient.

As soon as you apply a token to an element, you create a correlation between the element and that token's purpose, not just the value. This is also a design decision and should be treated as such. Don't create unintentional connections between elements that have nothing in common. While we promise not to change the contract of intent for a component, the values may change over time.

### Tip 3: Key > Value

When trying to decide which token to use, look at the token name, rather than the values that it holds. Think about the type of element you going to create, and look for similar elements that already exist in the system. Then, search the list below for key words or metaphors, such as its context ("layout", "body", "heading"), its attributes ("interactive", "disabled", "focused"), or its hierarchy ("default", "secondary"). Try to find compatible tokens, and be sure to never alter the values of existing design tokens.

Design tokens which can be used for [theming](/foundation/visual-foundation/theming/index.html.md) are marked as "Themeable" in the [tokens tables](/foundation/visual-foundation/design-tokens/index.html.md) below.

## Development guidelines

Our design tokens are available from a separate package called `design-tokens` and are intended to be used together with Cloudscape components. If you do not have components installed, see our [installation article](/get-started/for-developers/using-cloudscape-components/index.html.md) . All of our tokens are available as [Sass](https://sass-lang.com/documentation/variables) variables (e.g. `$color-text-body-secondary` ) or JavaScript variables (e.g. `colorTextBodySecondary` ).

### Installation

This package is provided via the following artifact:

- Npm module: `@cloudscape-design/design-tokens`

The design tokens package can only be used together with the components package. For detailed instructions, see the [package installation guide](/get-started/for-developers/using-cloudscape-components/index.html.md).

### Sass variables

Load design tokens into your application using the Sass <a href="https://sass-lang.com/documentation/at-rules/use"> `@use` rule</a>. `@import` can also work, even though it is [not recommended by the Sass team](https://sass-lang.com/documentation/at-rules/import).

```
@use '@cloudscape-design/design-tokens/index.scss' as awsui;

.custom-panel {
  color: awsui.$color-text-body-secondary
}
```

### JavaScript variables

```
import styled from 'styled-components'; // this is an example, you can use any other similar library
import * as awsui from '@cloudscape-design/design-tokens/index.js';

const CustomPanel = styled.div`
  color: ${awsui.colorTextBodySecondary}
`
```

### JSON

Use `index-visual-refresh.json` file to retrieve the values of design tokens and further process them to suit your development stack. For example, you can generate xml files for Android native apps, or swift classes for iOS native apps. We recommend that you use the [style-dictionary open source project](https://styledictionary.com/) to convert the JSON file to the desired output format.

The JSON format is inspired by the [Design Tokens Format Module](https://design-tokens.github.io/community-group/format/#file-format) by the [Design Tokens Community Group](https://www.designtokens.org/) . While this module is currently not a W3C Standard, or on the W3C Standards Track, it is the closest to a standardized format.

Here is the format of the JSON object:

```
{
  "tokens": {}
  "contexts": {
    "navigation": {
       "tokens": {},
    }
  }
}
```

Refer to the [Visual Contexts article](/foundation/visual-foundation/visual-context/index.html.md) for more information about `contexts`.

Here is the format of the `tokens` object, with a few examples:

```
{
  "font-family-base": {
    "$value": "'Helvetica Neue', Roboto, Arial, sans-serif",
    "$description": "The default font family that will be applied globally to the product interface.",
  },
  "color-background-button-primary-default": {
    "$value": {
      "light": "#aaaaaa",
      "dark": "#bbbbbb",
    },
    "$description": "The default background color of primary buttons.",
  },
  "space-container-horizontal": {
    "$value": {
      "comfortable": "20px",
      "compact": "20px"
    },
    "$description": "The horizontal padding inside a container."
  },
  "motion-duration-complex": {
      "$value": {
        "default": "250ms",
        "disabled": "0ms"
      },
      "$description": "The duration for drawing more attention or accommodating for more complexity."
  },
}
```

The format of each token depends on the category of the token, which is dictated by the first part of the token name. Here is the mapping:

- `color-`   tokens have the following format: `{ light: string, dark: string }`  .
- `font-`   tokens are strings.
- `line-height-`   tokens are strings.
- `border-radius-`   tokens are strings.
- `space-`   tokens have the following format: `{ comfortable: string, compact: string }`  .
- `motion-`   tokens have the following format: `{ default: string, disabled: string }`   , indicating the value when motion is enabled (default) or disabled.

The format of the whole JSON object is described in a JSON schema that we release as part of our artifacts ( `index-visual-refresh-schema.json` ). The JSON schema also contains patterns for most of the values. Future updates to those patterns are not considered breaking changes.
