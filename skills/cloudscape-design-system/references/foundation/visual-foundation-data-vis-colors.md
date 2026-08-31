---
scraped_at: '2026-04-20T08:50:24+00:00'
section: foundation
source_url: https://cloudscape.design/foundation/visual-foundation/data-vis-colors/index.html.md
title: Data visualization colors
---

# Data visualization colors

Color can be used as a powerful element to augment a chart or other data visualization when applied with a clear sense of purpose.

## Status and severity palette

The color palette for data that represents status or severity, and made to complement the status-related components such as [flashbars](/components/flashbar/index.html.md) and [status indicators](/components/status-indicator/index.html.md).

When applying the palette, pick the color values that represents the data best. Not all 7 values need to be used. It can be used to represent a specific set of status categories that are independent to each other, or to represent an ordered sequence of severity levels. The color tokens in this palette can be [themed](/foundation/visual-foundation/theming/index.html.md) and are marked as themeable in the table below.

*Example: A pie chart representing items statuses and a donut chart representing 5 levels of severity. *

### Status and severity palette colors  (7)

Sass JavaScript Sass 

| Light mode | Dark mode | Name | Description | Themeable |
| --- | --- | --- | --- | --- | 

| Light mode | Dark mode | Name | Description | Themeable |
| --- | --- | --- | --- | --- |
| charts-red-1000#7d2105 | charts-red-300#d63f38 | $color-charts-status-critical | Color to represent a critical error or a critically high-level of severity. For example: "Sev-1" | Yes |
| charts-red-600#ba2e0f | charts-red-500#fe6e73 | $color-charts-status-high | Color to represent an error status or a high-level of severity. Use this color to represent a default error status when there is only one applicable to a chart. For example: "Failed" or "Sev-2" | Yes |
| charts-orange-400#cc5f21 | charts-orange-600#f89256 | $color-charts-status-medium | Color to represent a medium-level of severity. For example: "Sev-3" | Yes |
| charts-yellow-300#b2911c | charts-yellow-700#dfb52c | $color-charts-status-low | Color to represent a warning or a low-level of severity. For example: "Warning" or "Sev-4" | Yes |
| charts-green-300#67a353 | charts-green-500#69ae34 | $color-charts-status-positive | Color to represent a positive status. *For example: "Success" or "Running" | Yes |
| charts-blue-1-400#3184c2 | charts-blue-1-500#08aad2 | $color-charts-status-info | Color to represent an informational status. For example: "In-progress" or "Updating" | Yes |
| neutral-500#8c8c94 | neutral-500#8c8c94 | $color-charts-status-neutral | Color to represent a neutral status, a severity level of no impact, or the lowest-level of severity. For example: "Pending" or "Sev-5" | Yes |
## Generic categorical palette

Categorical color palettes are best used to represent qualitative data with discrete categories or data series with no standard order. Use this palette for data that does not need a specific color association. It uses 5 hues (blue, pink, teal, purple, and orange), and has been ordered to be visually distinguishable to each other when used together. Follow the order of the palette to determine what colors to use based on the number of data series a chart includes.

The palette includes 50 values, ordered by a rotating pattern that allows for contrast between adjacent values. To automate this pattern, follow the development guidelines for [building custom palettes](/foundation/visual-foundation/data-vis-colors/index.html.md) . However, when designing a chart, be mindful of the total number of data series displayed at once. Having too many data series and colors will make it harder for users to read a chart and harder to recognize each color from one another. Consider displaying only up to 8 data series for a line chart or bar chart, and up to 5 data points for a pie chart or donut chart. The color tokens in this palette can be [themed](/foundation/visual-foundation/theming/index.html.md) and are marked as themeable in the table below.

*Example: A bar chart with three data series and a line chart with 5 data series. *

### Generic categorical palette colors  (50)

Sass JavaScript Sass 

| Order | Light mode | Dark mode | Name | Themeable |
| --- | --- | --- | --- | --- | 

| Order | Light mode | Dark mode | Name | Themeable |
| --- | --- | --- | --- | --- |
| 1 | charts-blue-2-300#688ae8 | charts-blue-2-300#486de8 | $color-charts-palette-categorical-1 | Yes |
| 2 | charts-pink-500#c33d69 | charts-pink-500#e07f9d | $color-charts-palette-categorical-2 | Yes |
| 3 | charts-teal-300#2ea597 | charts-teal-300#018977 | $color-charts-palette-categorical-3 | Yes |
| 4 | charts-purple-500#8456ce | charts-purple-500#b088f5 | $color-charts-palette-categorical-4 | Yes |
| 5 | charts-orange-300#e07941 | charts-orange-300#c55305 | $color-charts-palette-categorical-5 | Yes |
| 6 | charts-blue-2-600#3759ce | charts-blue-2-600#8ea9ff | $color-charts-palette-categorical-6 | Yes |
| 7 | charts-pink-800#962249 | charts-pink-800#ffb0c8 | $color-charts-palette-categorical-7 | Yes |
| 8 | charts-teal-600#096f64 | charts-teal-600#40bfa9 | $color-charts-palette-categorical-8 | Yes |
| 9 | charts-purple-800#6237a7 | charts-purple-800#d6baff | $color-charts-palette-categorical-9 | Yes |
| 10 | charts-orange-600#a84401 | charts-orange-600#f89256 | $color-charts-palette-categorical-10 | Yes |
| 11 | charts-blue-2-900#273ea5 | charts-blue-2-900#c3d1ff | $color-charts-palette-categorical-11 | Yes |
| 12 | charts-pink-1100#780d35 | charts-pink-1100#ffdfe8 | $color-charts-palette-categorical-12 | Yes |
| 13 | charts-teal-900#03524a | charts-teal-900#94e0d0 | $color-charts-palette-categorical-13 | Yes |
| 14 | charts-purple-1100#4a238b | charts-purple-1100#efe2ff | $color-charts-palette-categorical-14 | Yes |
| 15 | charts-orange-900#7e3103 | charts-orange-900#ffc6a4 | $color-charts-palette-categorical-15 | Yes |
| 16 | charts-blue-2-1200#1b2b88 | charts-blue-2-1200#ecf0ff | $color-charts-palette-categorical-16 | Yes |
| 17 | charts-pink-400#ce567c | charts-pink-400#d56889 | $color-charts-palette-categorical-17 | Yes |
| 18 | charts-teal-1200#003e38 | charts-teal-1200#d7f7f0 | $color-charts-palette-categorical-18 | Yes |
| 19 | charts-purple-400#9469d6 | charts-purple-400#a173ea | $color-charts-palette-categorical-19 | Yes |
| 20 | charts-orange-1200#602400 | charts-orange-1200#ffede2 | $color-charts-palette-categorical-20 | Yes |
| 21 | charts-blue-2-500#4066df | charts-blue-2-500#7698fe | $color-charts-palette-categorical-21 | Yes |
| 22 | charts-pink-700#a32952 | charts-pink-700#f5a2bb | $color-charts-palette-categorical-22 | Yes |
| 23 | charts-teal-500#0d7d70 | charts-teal-500#00b09b | $color-charts-palette-categorical-23 | Yes |
| 24 | charts-purple-700#6b40b2 | charts-purple-700#cbabfc | $color-charts-palette-categorical-24 | Yes |
| 25 | charts-orange-500#bc4d01 | charts-orange-500#f27c36 | $color-charts-palette-categorical-25 | Yes |
| 26 | charts-blue-2-800#2c46b1 | charts-blue-2-800#b1c5ff | $color-charts-palette-categorical-26 | Yes |
| 27 | charts-pink-1000#81143b | charts-pink-1000#ffd1de | $color-charts-palette-categorical-27 | Yes |
| 28 | charts-teal-800#045b52 | charts-teal-800#77d7c3 | $color-charts-palette-categorical-28 | Yes |
| 29 | charts-purple-1000#512994 | charts-purple-1000#e8d5ff | $color-charts-palette-categorical-29 | Yes |
| 30 | charts-orange-800#8a3603 | charts-orange-800#ffb68b | $color-charts-palette-categorical-30 | Yes |
| 31 | charts-blue-2-1100#1f3191 | charts-blue-2-1100#dfe6ff | $color-charts-palette-categorical-31 | Yes |
| 32 | charts-pink-300#da7596 | charts-pink-300#c64a70 | $color-charts-palette-categorical-32 | Yes |
| 33 | charts-teal-1100#01443e | charts-teal-1100#c2f0e6 | $color-charts-palette-categorical-33 | Yes |
| 34 | charts-purple-300#a783e1 | charts-purple-300#8d59de | $color-charts-palette-categorical-34 | Yes |
| 35 | charts-orange-1100#692801 | charts-orange-1100#ffe1cf | $color-charts-palette-categorical-35 | Yes |
| 36 | charts-blue-2-400#5978e3 | charts-blue-2-400#6384f5 | $color-charts-palette-categorical-36 | Yes |
| 37 | charts-pink-600#b1325c | charts-pink-600#eb92ad | $color-charts-palette-categorical-37 | Yes |
| 38 | charts-teal-400#1c8e81 | charts-teal-400#009d89 | $color-charts-palette-categorical-38 | Yes |
| 39 | charts-purple-600#7749bf | charts-purple-600#bf9bf9 | $color-charts-palette-categorical-39 | Yes |
| 40 | charts-orange-400#cc5f21 | charts-orange-400#de6923 | $color-charts-palette-categorical-40 | Yes |
| 41 | charts-blue-2-700#314fbf | charts-blue-2-700#a2b8ff | $color-charts-palette-categorical-41 | Yes |
| 42 | charts-pink-900#8b1b42 | charts-pink-900#ffc1d4 | $color-charts-palette-categorical-42 | Yes |
| 43 | charts-teal-700#06645a | charts-teal-700#5fccb7 | $color-charts-palette-categorical-43 | Yes |
| 44 | charts-purple-900#59309d | charts-purple-900#dfc8ff | $color-charts-palette-categorical-44 | Yes |
| 45 | charts-orange-700#983c02 | charts-orange-700#fca572 | $color-charts-palette-categorical-45 | Yes |
| 46 | charts-blue-2-1000#23379b | charts-blue-2-1000#d2dcff | $color-charts-palette-categorical-46 | Yes |
| 47 | charts-pink-1200#6f062f | charts-pink-1200#ffecf1 | $color-charts-palette-categorical-47 | Yes |
| 48 | charts-teal-1000#014b44 | charts-teal-1000#ace9db | $color-charts-palette-categorical-48 | Yes |
| 49 | charts-purple-1200#431d84 | charts-purple-1200#f5edff | $color-charts-palette-categorical-49 | Yes |
| 50 | charts-orange-1000#732c02 | charts-orange-1000#ffd4bb | $color-charts-palette-categorical-50 | Yes |
## Threshold colors

Thresholds can be effective accent elements to provide additional context to a line chart or bar chart. Use the following colors for threshold lines based on what the threshold represents. They can be used on a chart with any color palette. The color tokens in this palette can be [themed](/foundation/visual-foundation/theming/index.html.md) and are marked as themeable in the table below.

*Example: A line chart with a threshold representing a positive metric and a mixed chart with a threshold representing a neutral metric. *

### Threshold colors  (4)

Sass JavaScript Sass 

| Light mode | Dark mode | Name | Description | Themeable |
| --- | --- | --- | --- | --- | 

| Light mode | Dark mode | Name | Description | Themeable |
| --- | --- | --- | --- | --- |
| error-600#db0000 | error-400#ff7a7a | $color-charts-threshold-negative | The color to represent a threshold with a negative outcome. For example: A maximum limit | Yes |
| success-600#00802f | success-500#2bb534 | $color-charts-threshold-positive | The color to represent a threshold with a positive outcome. For example: A designated pass rate | Yes |
| info-600#006ce0 | info-300#75cfff | $color-charts-threshold-info | The color to represent an informational threshold to highlight special circumstances that may have or will occur. For example: A forecasted estimate | Yes |
| neutral-600#656871 | neutral-450#a4a4ad | $color-charts-threshold-neutral | The color to represent a threshold with a neutral outcome. For example: An average or baseline | Yes |
## Error bar series colors

Error bars communicate uncertainty or variability in the data and should be visually distinct without overpowering the primary chart elements. Use the following color palette for your chart series to ensure error bars are clear and consistent across different chart types and color palettes. Visit [cartesian charts](/components/cartesian-chart/index.html.md) for more information on error bars.

### Recommended colors for charts with error bars  (8)

Sass JavaScript Sass 

| Light mode | Dark mode | Name | Description | Themeable |
| --- | --- | --- | --- | --- | 

| Light mode | Dark mode | Name | Description | Themeable |
| --- | --- | --- | --- | --- |
| charts-blue-2-300#688ae8 | charts-blue-2-300#486de8 | $color-charts-palette-categorical-1 | Color #1 on the categorical data visualization palette. | Yes |
| charts-pink-300#da7596 | charts-pink-300#c64a70 | $color-charts-palette-categorical-32 | Color #32 on the categorical data visualization palette. | Yes |
| charts-teal-300#2ea597 | charts-teal-300#018977 | $color-charts-palette-categorical-3 | Color #3 on the categorical data visualization palette. | Yes |
| charts-purple-300#a783e1 | charts-purple-300#8d59de | $color-charts-palette-categorical-34 | Color #34 on the categorical data visualization palette. | Yes |
| charts-orange-300#e07941 | charts-orange-300#c55305 | $color-charts-palette-categorical-5 | Color #5 on the categorical data visualization palette. | Yes |
| charts-blue-2-400#5978e3 | charts-blue-2-400#6384f5 | $color-charts-palette-categorical-36 | Color #36 on the categorical data visualization palette. | Yes |
| charts-pink-400#ce567c | charts-pink-400#d56889 | $color-charts-palette-categorical-17 | Color #17 on the categorical data visualization palette. | Yes |
| charts-teal-400#1c8e81 | charts-teal-400#009d89 | $color-charts-palette-categorical-38 | Color #38 on the categorical data visualization palette. | Yes |
## Building custom palettes

For charts that represent unique data types, such as sequential data or a specific industry standard, use the full data visualization color set to build a custom color palette. The full set includes 9 scales, each for a different hue with 10 values selected for consistent contrast across each scale.

When building a custom palette, consider the following:

- Use darker values to represent data of higher importance or larger numbers.
- Use multiple hues to represent sequential data rather than a monochromatic palette with only one hue. This will allow for easier recognition across the palette.
- Avoid selecting colors based on cultural metaphors unless they are a global standard.  

  - For example: Green may commonly be used as a reference to money in the the United States. However this is not true for many other countries where local currency is a variety of other colors.
- Don't select a wide range of colors for the sake of coloring. Use color to purposefully support the intention of the data, message, readability, and hierarchy.
- Select colors with accessibility in mind for users with visual impairments such as color blindness. Every person's ability to perceive color is different. Do not rely on vision simulators as a precise representation or replacement for direct user feedback when evaluating whether the values in your color palette have sufficient contrast to each other.
- When selecting multiple values from the same scale, avoid selecting adjacent values. Opt to select values that are farther apart to each other on the scale for higher contrast.  

  - For example: Don't use $color-charts-teal-300 and $color-charts-teal-400 together.
- Evaluate the contrast between colors based on the chart type and size. Our ability to perceive color is dependent on the size of the element. The colors on a bar chart with 16px wide rectangles are easier for users to perceive compared to the colors on a line chart with 2px lines.

The color tokens in this palette cannot be [themed](/foundation/visual-foundation/theming/index.html.md).

### Color scales  (90)

Sass JavaScript Sass 

| Light mode | Dark mode | Name | Themeable |
| --- | --- | --- | --- | 

| Light mode | Dark mode | Name | Themeable |
| --- | --- | --- | --- |
| #ea7158 | #d63f38 | $color-charts-red-300 | No |
| #dc5032 | #ed5958 | $color-charts-red-400 | No |
| #d13313 | #fe6e73 | $color-charts-red-500 | No |
| #ba2e0f | #ff8a8a | $color-charts-red-600 | No |
| #a82a0c | #ffa09e | $color-charts-red-700 | No |
| #972709 | #ffb3b0 | $color-charts-red-800 | No |
| #892407 | #ffc4c0 | $color-charts-red-900 | No |
| #7d2105 | #ffd2cf | $color-charts-red-1000 | No |
| #721e03 | #ffe0dd | $color-charts-red-1100 | No |
| #671c00 | #ffecea | $color-charts-red-1200 | No |
| #e07941 | #c55305 | $color-charts-orange-300 | No |
| #cc5f21 | #de6923 | $color-charts-orange-400 | No |
| #bc4d01 | #f27c36 | $color-charts-orange-500 | No |
| #a84401 | #f89256 | $color-charts-orange-600 | No |
| #983c02 | #fca572 | $color-charts-orange-700 | No |
| #8a3603 | #ffb68b | $color-charts-orange-800 | No |
| #7e3103 | #ffc6a4 | $color-charts-orange-900 | No |
| #732c02 | #ffd4bb | $color-charts-orange-1000 | No |
| #692801 | #ffe1cf | $color-charts-orange-1100 | No |
| #602400 | #ffede2 | $color-charts-orange-1200 | No |
| #b2911c | #977001 | $color-charts-yellow-300 | No |
| #9c7b0b | #b08400 | $color-charts-yellow-400 | No |
| #8a6b05 | #c59600 | $color-charts-yellow-500 | No |
| #7b5f04 | #d3a61c | $color-charts-yellow-600 | No |
| #6f5504 | #dfb52c | $color-charts-yellow-700 | No |
| #654d03 | #eac33a | $color-charts-yellow-800 | No |
| #5d4503 | #f1cf65 | $color-charts-yellow-900 | No |
| #553f03 | #f7db8a | $color-charts-yellow-1000 | No |
| #4d3901 | #fce5a8 | $color-charts-yellow-1100 | No |
| #483300 | #ffefc9 | $color-charts-yellow-1200 | No |
| #67a353 | #48851a | $color-charts-green-300 | No |
| #41902c | #5a9b29 | $color-charts-green-400 | No |
| #1f8104 | #69ae34 | $color-charts-green-500 | No |
| #1a7302 | #7dbd4c | $color-charts-green-600 | No |
| #176702 | #8fca61 | $color-charts-green-700 | No |
| #145d02 | #9fd673 | $color-charts-green-800 | No |
| #125502 | #b2df8d | $color-charts-green-900 | No |
| #104d01 | #c5e7a8 | $color-charts-green-1000 | No |
| #0f4601 | #d5efbe | $color-charts-green-1100 | No |
| #0d4000 | #e4f7d5 | $color-charts-green-1200 | No |
| #2ea597 | #018977 | $color-charts-teal-300 | No |
| #1c8e81 | #009d89 | $color-charts-teal-400 | No |
| #0d7d70 | #00b09b | $color-charts-teal-500 | No |
| #096f64 | #40bfa9 | $color-charts-teal-600 | No |
| #06645a | #5fccb7 | $color-charts-teal-700 | No |
| #045b52 | #77d7c3 | $color-charts-teal-800 | No |
| #03524a | #94e0d0 | $color-charts-teal-900 | No |
| #014b44 | #ace9db | $color-charts-teal-1000 | No |
| #01443e | #c2f0e6 | $color-charts-teal-1100 | No |
| #003e38 | #d7f7f0 | $color-charts-teal-1200 | No |
| #529ccb | #00819c | $color-charts-blue-1-300 | No |
| #3184c2 | #0497ba | $color-charts-blue-1-400 | No |
| #0273bb | #08aad2 | $color-charts-blue-1-500 | No |
| #0166ab | #44b9dd | $color-charts-blue-1-600 | No |
| #015b9d | #63c6e7 | $color-charts-blue-1-700 | No |
| #015292 | #79d2f0 | $color-charts-blue-1-800 | No |
| #014a87 | #98dcf5 | $color-charts-blue-1-900 | No |
| #01437d | #b3e4f8 | $color-charts-blue-1-1000 | No |
| #003c75 | #caedfc | $color-charts-blue-1-1100 | No |
| #00366d | #ddf4ff | $color-charts-blue-1-1200 | No |
| #688ae8 | #486de8 | $color-charts-blue-2-300 | No |
| #5978e3 | #6384f5 | $color-charts-blue-2-400 | No |
| #4066df | #7698fe | $color-charts-blue-2-500 | No |
| #3759ce | #8ea9ff | $color-charts-blue-2-600 | No |
| #314fbf | #a2b8ff | $color-charts-blue-2-700 | No |
| #2c46b1 | #b1c5ff | $color-charts-blue-2-800 | No |
| #273ea5 | #c3d1ff | $color-charts-blue-2-900 | No |
| #23379b | #d2dcff | $color-charts-blue-2-1000 | No |
| #1f3191 | #dfe6ff | $color-charts-blue-2-1100 | No |
| #1b2b88 | #ecf0ff | $color-charts-blue-2-1200 | No |
| #a783e1 | #8d59de | $color-charts-purple-300 | No |
| #9469d6 | #a173ea | $color-charts-purple-400 | No |
| #8456ce | #b088f5 | $color-charts-purple-500 | No |
| #7749bf | #bf9bf9 | $color-charts-purple-600 | No |
| #6b40b2 | #cbabfc | $color-charts-purple-700 | No |
| #6237a7 | #d6baff | $color-charts-purple-800 | No |
| #59309d | #dfc8ff | $color-charts-purple-900 | No |
| #512994 | #e8d5ff | $color-charts-purple-1000 | No |
| #4a238b | #efe2ff | $color-charts-purple-1100 | No |
| #431d84 | #f5edff | $color-charts-purple-1200 | No |
| #da7596 | #c64a70 | $color-charts-pink-300 | No |
| #ce567c | #d56889 | $color-charts-pink-400 | No |
| #c33d69 | #e07f9d | $color-charts-pink-500 | No |
| #b1325c | #eb92ad | $color-charts-pink-600 | No |
| #a32952 | #f5a2bb | $color-charts-pink-700 | No |
| #962249 | #ffb0c8 | $color-charts-pink-800 | No |
| #8b1b42 | #ffc1d4 | $color-charts-pink-900 | No |
| #81143b | #ffd1de | $color-charts-pink-1000 | No |
| #780d35 | #ffdfe8 | $color-charts-pink-1100 | No |
| #6f062f | #ffecf1 | $color-charts-pink-1200 | No |

### Sequencing large categorical palettes

If using adjacent values from the same scale is unavoidable for a custom categorical palette, consider sequencing the values in a pattern that will allow the adjacent values to be further apart from each other in the final order. The sequence illustrated below uses a chevron pattern across 5 scales with 10 values each, skipping two values on the scales as the sequence rotates from orange back to blue. This is how the categorical color palette was generated.

Start from beginning To automate this sequence, use `makeChevronPalette` from the code below. This function accepts a list of color scales, each represented as arrays as well. The algorithm flattens and reorders the input elements and does not require them to be any specific type. However, it is highly recommended to use Cloudscape design tokens here to support different visual modes. Make sure to pass in the colors in ascending order by color contrast per scale. The output is a list of color values (or tokens) that you can use in your charts in that particular order.

This algorithm was already applied to the system's generic categorical palette, including minor adjustments for color contrast. Only use this for your custom palettes.

```
// The function takes an array of color scales, with each scale being an array of color values (or token names)
function makeChevronPalette(scales) {
  const scaleCount = scales.length;
  const colorsPerScale = scales[0].length;
  const finalColors = new Array(scaleCount * colorsPerScale);

  for (let i = 0; i < scaleCount * colorsPerScale; i++) {
    const round = Math.floor(i / scaleCount);
    const scaleIndex = i % scaleCount;
    const colorIndex = ((scaleIndex % 2 === 0 ? 0 : 2) + ((3 * round) % colorsPerScale)) % colorsPerScale;
    finalColors[i] = scales[scaleIndex][colorIndex];
  }

  return finalColors;
}

// Example usage
import * as awsui from '@cloudscape-design/design-tokens/index.js';

const colors = makeChevronPalette([
  // Receives a total of 30 color values from three different scales, returns the 30 color values in a new order.
  [awsui.colorChartsRed300, awsui.colorChartsRed400, /* ... */ awsui.colorChartsRed1200],
  [awsui.colorChartsTeal300, awsui.colorChartsTeal400,  /* ... */ awsui.colorChartsTeal1200],
  [awsui.colorChartsOrange300, awsui.colorChartsOrange400, /* ... */ awsui.colorChartsOrange1200],
]);
```

## General guidelines

### Do

- Be consistent with colors when presenting the data series across multiple charts.
- Place charts only on the default [container](/components/container/index.html.md)   background color for both light and dark mode.
- Use a 2px divider to separate segments on stacked bar charts, pie charts, and donut charts for higher contrast between colors.
- Consider displaying only up to 8 data series for a line chart or bar chart, and up to 5 data points for a pie chart or donut chart.

### Don't

- Don't use colors specific to data visualization for UI elements. For those purposes, follow the guidelines for [colors foundation](/foundation/visual-foundation/colors/index.html.md)  .
- Don't apply a different color across multiple attributes from the same data series. Minimize the number of colors used on a given chart. For example, for a bar chart that represents the total cost of a resource by month, do not use a different color for each month. Use one color instead.
- Don't apply colors for decoration purposes.

## Accessibility guidelines

### General guidelines

- All colors have been selected to meet the minimum 3:1 contrast against the container background.
- Provide multiple formats to a chart when possible, to give users the ability to select their preferred format in case one format may be easier for them to recognize colors over another.  

  - For example: A user may prefer reading a chart as a bar chart over a line chart because of the use of wider rectangles over thinner lines*.*

### Color-blind safe palette

There is no such thing as a true "color-blind safe" palette as everyone's ability to perceive color is unique to them. Though color is a primary element for data visualizations, it should not used as the only method of communicating what the data on a chart represents. Make sure that other methods of identification is also available on a chart for recognition. Such as:

- Labels, such as those that directly point to each slice on a pie chart or a popover that labels a line when a user interacts with it.
- Filters that allow users to select specific data series to focus on.

## Implementation

Whenever possible, make sure to use the design tokens for data visualization that are listed in this article. Follow the general and development [guidelines of design tokens](/foundation/visual-foundation/design-tokens/index.html.md).

If you cannot use design tokens, be aware that different [visual modes](/foundation/visual-foundation/visual-modes/index.html.md) such as dark mode will affect how your colors are perceived by users.

When using the general categorical palette, or any custom palette that was generated with the same chevron algorithm, make sure to pass it to your data visualization component in the given order. For example: on a line chart with 5 lines, use the first 5 values of the categorical palette and not just any 5 values of the palette.
