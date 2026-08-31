---
scraped_at: '2026-04-20T08:52:07+00:00'
section: patterns
source_url: https://cloudscape.design/patterns/general/data-vis/chart-metric-drill-down/index.html.md
title: Chart metric drill down
---

# Chart metric drill down

Drill into chart metrics by starting at the highest level of data and then exploring lower levels of data.

## Objectives

The objective of metric drill down is for users to get a deeper understanding of their data by exploring it at different levels of granularity. It helps users explore and analyze data in a hierarchical manner, starting from a broad perspective and progressively focusing on finer details. This process is especially useful in decision-making and identifying trends or patterns within complex datasets, for example:

- **Troubleshooting: **   Users notice an aberration/anomaly in the data visualization and they want to drill down to focus on the reason for the problem.
- **Monitoring: **   Users notice a trend in their data visualization and want to drill down to monitor over time period how this develops.

By interacting with the data points in the chart they can drill down into data. There are three drill down interaction types:

- **Metric breakdown: **   Users can select a metric and view a breakdown of the data in the context of the chart popover. Users can then be linked to additional metric details or further drill down on a separate page.
- **Singular chart drill down: **   Users can filter out data in a specific chart to drill into deviations or trends.
- **Page level drill down: **   Users can apply filters to data globally across multiple charts or in a tabular view.

## Types of metric drill down

## Metric breakdown

By selecting a specific data point or section within a chart, users can access a breakdown of sub-data related to that particular data point. This is displayed in a popover.

A B C
#### A. Details popover

Provides additional information on specific data points by using a popover.

#### B. Metric breakdown

Provides breakdown details of the selected metric. Can be featured either in a list or in an expandable section.

- Example: Show a list of accounts with associated costs for a service.

#### C. External links

Each metric key or value can link to a separate details page for further drill down via external links.

- Example: Link to details page for a resource.
- Example: Link to a full page table showing accounts that are filtered by expired and the date.

## Singular chart drill down

Filters in the chart support users' data exploration in the chart view. By selecting a specific data point or section within a chart, users can apply predefined filters to the chart in order to drill down into spikes and anomalies.  Example: While viewing a chart showing the cost of services over time, users can select a spike in a data point to then add a filter for the date and the service name to refocus the chart to better understand the anomaly.

A B C D E F
#### A. Chart data filters

Filtering helps users to select what data metrics show on the chart.

#### B. Popover drill down

Popover drill down can be achieved by using the footer area to add form elements that apply filters to the chart based on the content of the selected popover.

#### C. Drill down title and description

Provide details of what the users is drilling down into and also where the filters will be added.

#### D. Pre-applied inputs

When pre-applying a filter, show this to the user in a read-only state.

- Example: A users selects a metric series for a specific date, which is then applied as a chart filter.

#### E. Drill down selection - optional

Users can then choose a series by which to filter the chart. Use a select or a multiselect for the popover drill down elements.

- Example: While viewing a popover listing out metrics for a specific date, a user can then select a service such as EC2 to drill down filtering the chart by the data and selected service.

#### F. Apply filters button

Apply the filters to the chart data filters.

## Page drill down

Use this option for drilling down on a page with multiple data representations. When selecting a metric on a chart, users can apply global filters from the popover. This provides a way to visually explore metrics on a chart and then drill down into data with multiple data representations.

A B C D E F A B C D E F
#### A. Global data filters

Global page filters are used to filter multiple charts and data representations at once. This can be in the page header or in a side panel.

#### B. Popover drill down

Popover drill down can be achieved by using the footer area to add form elements that apply filters to the chart based on the content of the selected popover.

- Example: A user looking at a dashboard can select a metric within a specific region for a chart. The user can then filter all page charts by that region to better understand the region and how to increase performance of application workloads.
- Example: Selecting metrics to apply filters to a on page table to compare data.

#### C. Drill down title and description

Provide details of what filters are applied and their location.

#### D. Pre-applied inputs

When pre-applying a filter, show this to the user in a read-only state.

- Example: A users selects a metric series for a specific date, which is then shown in a popover in a read-only state. Upon submission this is applied as a global filter.

#### E. Selection - optional

Users can then choose a series to filter the chart by. Use a select or a multiselect for the popover drill down elements.

- Example: Viewing a popover listing out metrics for a specific date. The user can then select a service such as EC2 to drill down filtering the chart by the data and selected service.

#### F. Apply filters button

Apply button which adds the filters to the global data filters.

## General guidelines

### Do

- Allow users to clear filters from the data visualization so that they can return charts to their default state.
- When applying filters from a popover, always specify which filters are being applied.
- Within the drill down in a popover footer, specify a clear title and description to indicate where filters are being applied.
- When applying filters to the page or chart through a popover, always feature the selected filter in the on-page filters.

### Don't

- Don't combine chart drill down with page drill down on the same page. Always use one or the other. The two filters have different granular levels which will conflict, creating a confusing experience for users.

## Writing guidelines

- Keep labels and descriptions clear and concise.
- Include descriptive titles for the popover drill down section so users clearly understand where the filters will be applied to.  

  - Example: Drill down by 'date' and 'service' on the chart.
  - Example: Drill down by 'date' and 'service' on the page.
- Use sentence case for all text. Don't use title case.
- Use present-tense verbs and active voice wherever possible.
- Don't use "please," "thank you," or Latinisms such as "e.g.," "i.e.," or "etc."
- Localize the text on the user interface.  

  - For example: If the interface is in French, all text should be written in French.

## Accessibility guidelines

### General accessibility guidelines

- Follow the guidelines on alternative text and Accessible Rich Internet Applications (ARIA) regions for each component.
- Make sure to define ARIA labels aligned with the language context of your application.
- Don't add unnecessary markup for roles and landmarks. Follow the guidelines for each component.
- Provide keyboard functionality to all available content in a logical and predictable order. The flow of information should make sense.

## Related patterns

### Charts

Charts are a graphic representation of information and quantitative data, built on the Highcharts library, designed to provide a clear and interactive way to convey meaning.

[View Documentation](/components/charts/index.html.md)

### Bar chart

Visualizes one or many series of data, with an emphasis on the total amount of each data point.

[View Documentation](/components/bar-chart/index.html.md)

### Line chart

Visualizes one or many series of data, with an emphasis on how the data changes over time.

[View Documentation](/components/line-chart/index.html.md)

### Pie and donut charts

Legacy pie and donut charts visualize the relationship or correlation between data metrics in a dataset.

[View Documentation](/components/pie-chart-legacy/index.html.md)

### Mixed line and bar chart

Visualizes different, but related, series of data on a single chart.

[View Documentation](/components/mixed-line-bar-chart/index.html.md)

### Area chart

The area chart visualizes two or more series of data. Through stacked data series, it emphasizes the part-to-whole relationship of data over a period of time.---

[View Documentation](/components/area-chart/index.html.md)
