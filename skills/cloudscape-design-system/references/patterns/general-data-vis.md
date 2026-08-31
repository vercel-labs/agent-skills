---
scraped_at: '2026-04-20T08:52:09+00:00'
section: patterns
source_url: https://cloudscape.design/patterns/general/data-vis/index.html.md
title: Data visualization
---

# Data visualization

Data visualization is a graphic representation of information and quantitative data intended to quickly and clearly convey meaning.

## Chart types

When using data visualization patterns to present data, choose the chart type that best shows the relationship between the data series. There are two chart components:

#### Cartesian charts

These use two axes to show data and help users see patterns or compare values.

- [Line chart](/components/cartesian-chart/index.html.md)   : Visualizes one or many series of data, with an emphasis on how the data changes over time.
- [Bar chart](/components/cartesian-chart/index.html.md)   : Visualizes one or many series of data, with an emphasis on the total amount of each data point.
- [Mixed chart](/components/cartesian-chart/index.html.md)   : Visualizes different, but related, series of data on a single chart.
- [Scatter chart](/components/cartesian-chart/index.html.md)   : Visualizes the relationships between data in two dimensions.
- [Bubble chart](/components/cartesian-chart/index.html.md)   :   Visualizes the relationships between data in three dimensions, using position for two variables and bubble size for a third.
- [Area chart](/components/cartesian-chart/index.html.md)   : The area chart visualizes two or more series of data. Through stacked data series, it emphasizes the part-to-whole relationship of data over a period of time.

#### Pie and donut charts

Pie and donut charts display portions of a whole unit so users can compare data points from a total set. A donut chart also includes a summary metric in the center of the chart.

- [Pie chart](/components/pie-chart/index.html.md)   : A pie chart helps users see the relationship between different data metrics in a data set.
- [Donut chart](/components/pie-chart/index.html.md)   : A donut chart is a variant of a pie chart with its center removed.

## Objectives

The objective of data visualization is for users to be able to quickly and clearly derive meaning from a set of data. Data visualization supports four common objectives:

- **Identifying trends: **   Users want to understand how a metric or set of metrics is changing over time, particularly if the changes correspond with other events in the user's services.
- **Identify aberrations/anomalies: **   Users want to spot deviations from a normal or expected range, often the significant increase or decrease of a particular metric.
- **Comparison: **   Users want to identify commonalities or divergences between two or more metrics.
- **Investigate problems: **   Users have been notified of a problem or found one during a review or investigation, and use a visualization to better understand what happened.

A data visualization can focus on one or more of these, as well as typically fulfill several of the these user objectives. It's important to understand the primary and secondary needs of your users, and to choose the right data and visualization to meet those needs.

## Criteria

|  | Line chart | Bar chart | Mixed line and bar chart | Area chart | Pie/donut chart |
| --- | --- | --- | --- | --- | --- |
| Data type | Numeric | Numeric or categorical | Numeric | Numeric | Categorical |
| Time period | Continuous | Continuous or snapshot | Continuous | Continuous | Snapshot |
| Number of metrics | 1 to 8 data series | 1 to 8 data series | 1 to 4 data series | 2 to 8 data points | 1 to 5 data points |

### Data type

Data can generally be divided in two main types: numeric (any quantitative measure) and categorical (qualitative data, usually expressed with text labels). Identify the data type your user needs and select the chart that best supports the data.

- #### Numeric

  Individual units of measurement, typically arrayed over a time or date range.  

  For example: A bar chart that shows the number of errors logged by an application over the past three months.
- #### Categorical

  Qualitative delineation between sets of data. Categories can be a ranked or ordered series of data (such as high, medium, and low severity). Or they can be grouped by type, which has no standard order (such as different types of databases).  

  For example: A stacked bar chart that shows the total number and severity of alerts over the past seven days.

### Time period

The time period of a chart is the way time is depicted in the chart's data and display.

- #### Continuous

  Shows multiple data points over multiple points or periods of time.  

  For example: A line chart that shows CPU usage of an instance over the course of 7 days.
- #### Snapshot

  Shows metrics from a single point or period of time.  

  For example: A pie chart that shows the number of different alert types logged in a specific day.

### Number of metrics

The number of metrics shown in a data visualization should be sufficient for the user to understand the visualization, but not too many that it becomes confusing or overwhelming.

There are two levels of metrics that should be considered:

- #### Data points

  Individual numerical points of data charted in the visualization. On charts that use X and Y axis, such as line charts, a data point is plotted on a specific X and Y coordinate. On charts that use polar coordinates, such as [pie charts](/components/pie-chart/index.html.md)   , the data point is represented as a segment of the total area. For example: The temperature of a CPU at a specific time.  

  The number of data points shown should reflect the granularity users need to properly interpret the visualization.
- #### Data series

  Data points that are related to each other and grouped to form a series. Some charts, such as line or bar charts, might have multiple data series on the same visualization. Other types of charts, such as pie charts, have only a single data series. For example: A set of CPU temperatures logged once a second for a minute.  

  The number of included data series shouldn't clutter the chart and overwhelm the user. Refer to the guidance for each chart type for the number of data series to show.

## General guidelines

### Do

- Use appropriate meta information, such as titles, labels, and the legend, to describe the chart's intention and ensure users understand how the data displayed relates to other information on the page.
- Include the minimum number of metrics and information users need to complete their desired task. Refer to the guidelines for each chart type for specific guidance.
- Avoid showing too many metrics on a single chart. If you're over the recommended number of metrics, consider showing multiple charts or grouping metrics.
- When showing a large number of metrics on a single chart, include data filters so users can decide which metrics to show.
- Ensure chart placement and size fits within the visual hierarchy of the page. When using multiple charts at the same level of importance, they should have consistent sizing.
- Minimize the number of charts displayed in a single view to avoid visual overload.
- Use a consistent and accessible color palette for your data visualization. For more information, see [data visualization colors](/foundation/visual-foundation/data-vis-colors/index.html.md)   for guidance.

### Don't

- Don't use data visualization for decoration.
- Never display data in a way that could mislead users to a false conclusion. For example, if the Y axis of a line or bar chart does not start at 0, changes are exaggerated, potentially creating a misleading impression of significant changes over time.

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

- Refer to the writing guidelines for different types of Cloudscape charts.
- When showing dates and times, such as in axis labels, refer to the [timestamp guidelines](/patterns/general/timestamps/index.html.md)  .

## Accessibility guidelines

### General accessibility guidelines

- Follow the guidelines on alternative text and Accessible Rich Internet Applications (ARIA) regions for each component.
- Make sure to define ARIA labels aligned with the language context of your application.
- Don't add unnecessary markup for roles and landmarks. Follow the guidelines for each component.
- Provide keyboard functionality to all available content in a logical and predictable order. The flow of information should make sense.

### Component-specific guidelines

- Refer to the accessibility guidelines for different types of charts.
- Use an accessible color palette for visualizations. Refer to [data visualization color guidance](/foundation/visual-foundation/data-vis-colors/index.html.md)  .

## Related patterns

### Data visualization colors

Color can be used as a powerful element to augment a chart or other data visualization when applied with a clear sense of purpose.---

[View Documentation](/foundation/visual-foundation/data-vis-colors/index.html.md)
