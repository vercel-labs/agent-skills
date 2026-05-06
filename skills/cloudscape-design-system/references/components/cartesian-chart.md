---
scraped_at: '2026-04-20T08:47:13+00:00'
section: components
source_url: https://cloudscape.design/components/cartesian-chart/index.html.md
title: Cartesian charts
---

# Cartesian charts

Cartesian charts display information along horizontal and vertical axes to clearly show patterns, comparisons, and relationships between values. It includes line, bar, area, scatter, bubble, and mixed charts.

 [Get design library](/get-started/for-designers/design-resources/index.html.md) [Browse code](https://github.com/cloudscape-design/chart-components/tree/main/src/cartesian-chart) [View in demo](/examples/react/dashboard.html) These new chart components are built on top of Highcharts, which is a [commercial third-party library](https://www.highcharts.com/) . Refer to the [licensing section on Charts](/components/charts/index.html.md) for more details.
The API properties for this component are found here: [API Properties](https://cloudscape.design/components/cartesian-chart/index.html.json)

## Development guidelines

To migrate from legacy to new charts, refer to the [migration guide](/get-started/dev-guides/charts-migration/index.html.md).

### Providing Highcharts

The Cartesian chart requires a Highcharts instance as an argument. You can resolve this instance either statically or dynamically. When Highcharts instance is null, the chart displays a fallback state that you can customize using the `fallback` property.

Load the [accessibility module](https://www.highcharts.com/docs/accessibility/accessibility-module) with the Highcharts instance to ensure proper accessibility features. When using *errorbar* series, load the `highcharts-more` module.

```
// Loading Highcharts statically

import Highcharts from "highcharts";
import "highcharts/modules/accessibility";
import "highcharts/highcharts-more";

function MyChart(props) {
  return <CartesianChart highcharts={Highcharts} {...props} />
}

// Loading Highcharts dynamically

function MyChart(props) {
  const [highcharts, setHighcharts] = useState(null);
  useEffect(() => {
    const load = async () => {
      const Highcharts = await import("highcharts");
      await import("highcharts/modules/accessibility");
      await import("highcharts/highcharts-more");
      setHighcharts(Highcharts);
    };
    load();
  }, []);
  return <CartesianChart highcharts={highcharts} {...props} />
}
```

Supported Highcharts versions: v12.

### State management

By default, the chart component automatically filters series as you interact with the default filter, legend, and the chart itself. If you want to control the visible series, you need to explicitly set the `visibleSeries` property and the `onVisibleSeriesChange` listener.

Learn more about the [state management](/get-started/dev-guides/state-management/index.html.md) of Cloudscape components.

[Learn more](/get-started/dev-guides/state-management/index.html.md)

### Usage of color

By default, the chart components use the Cloudscape generic categorical color palette as described in our [data visualization colors](/foundation/visual-foundation/data-vis-colors/index.html.md) article. If you want to use other colors, we recommend to use our data visualization colors as well. Custom colors are defined as part of the `data` property:

```
import { colorChartsThresholdNegative } from '@cloudscape-design/design-tokens';

<CartesianChart
  {...otherProps}
  series={[
    { type: 'line', name: 'Site 1', data: dataSite1 },
    { type: 'line', name: 'Site 2', data: dataSite2 },
    { type: 'y-threshold', name: 'Limit', value: 10, color: colorChartsThresholdNegative },
  ]}
/>
```

Both the default color palette as well as any custom colors you pick from our data visualization colors use [design tokens](/foundation/visual-foundation/design-tokens/index.html.md) . This means that they will automatically react to the current [visual mode](/foundation/visual-foundation/visual-modes/index.html.md) , for example dark mode.

### Order of data

Ensure series data is sorted by ascending x values to avoid [Highcharts error #15](https://www.highcharts.com/forum/viewtopic.php?t=50446).

### Responsiveness of axis labels

The labels of x and y axes do not automatically wrap. You can format them and add line breaks (\n) with the `xAxis.valueFormatter` and `yAxis.valueFormatter` functions.

If you are new to test utility classes, you can learn more in the [introduction article](/get-started/testing/introduction/index.html.md).
## Testing guidelines

### Resolving unit test issues with Vitest

If you encounter `TypeError: tk.CSS?.supports is not a function error` when testing the new charts with Vitest, refer to [this ticket](https://github.com/highcharts/highcharts/issues/22910) for mitigation.

## Unit testing APIs

CartesianChartWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findApplication | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | Finds focusable chart application element. When focused, it renders a focus outline around the chart,and accepts keyboard commands. The application element is not available in empty charts. | - |
| findFallback | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | Finds fallback slot, rendered when highcharts=null. | - |
| findFilter | [BaseChartFilterWrapper](/index.html.md) &#124; null | Finds chart's filters area when default series filter or additional filters are defined. | - |
| findLegend | [BaseChartLegendWrapper](/index.html.md) &#124; null | Finds chart's legend when defined. | __0:Optional axis ID to target a specific legend (e.g. "primary", "secondary"). |
| findNoData | [BaseChartNoDataWrapper](/index.html.md) &#124; null | Finds chart's no-data when the chart is in no-data state. | - |
| findSeries | Array<[ElementWrapper](/index.html.md)> | Finds series elements. Use this to assert the number of visible series. | - |
| findTooltip | [CartesianChartTooltipWrapper](/index.html.md) &#124; null | Finds chart's tooltip when visible. | - |
| findXAxisTitle | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | Finds visible title of the x axis. | - |
| findYAxisTitle | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | Finds visible title of the y axis. | __0:Optional axis ID to target a specific y axis title (e.g. "secondary"). | BaseChartFilterWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findAdditionalFilters | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | Finds custom additional filters slot when defined. | - |
| findSeriesFilter | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | Finds default series filter when defined. | - | BaseChartLegendWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findActions | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | Finds legend's actions slot when defined. | - |
| findItems | Array<[ElementWrapper](/index.html.md)> | Finds legend items that match given options:active (optional, boolean) - Matches only active legend items when true, and only inactive when false.When options are not set, the function matches all legend items. | options: |
| findTitle | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | Finds legend's visible title element when defined. | - | BaseChartNoDataWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findEmpty | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | Finds no-data empty slot when the chart is in empty state. | - |
| findError | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | Finds no-data error slot when the chart is in error state. | - |
| findLoading | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | Finds no-data loading slot when the chart is in loading state. | - |
| findNoMatch | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | Finds no-data no-match slot when the chart is in no-match state. | - |
| findRetryButton | [ButtonWrapper](/components/button/index.html.md) &#124; null | Finds no-data retry button when the chart is in error state, and uses the default recovery button. | - | CartesianChartTooltipWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findBody | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findDismissButton | [ButtonWrapper](/components/button/index.html.md) &#124; null | - | - |
| findFooter | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findHeader | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findPoints | Array<[PointDetailsItemWrapper](/index.html.md)> | Finds matched tooltip points. | - | PointDetailsItemWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findDescription | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | Finds tooltip point description when defined. | - |
| findKey | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> | Finds tooltip point key. | - |
| findSubItems | Array<[PointDetailsSubItemWrapper](/index.html.md)> | Finds point sub-items when defined. | - |
| findValue | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> | Finds tooltip point value. | - | PointDetailsSubItemWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findDescription | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | Finds tooltip point description when defined. | - |
| findKey | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> | Finds tooltip point key. | - |
| findValue | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> | Finds tooltip point value. | - |
## Integration testing APIs

CartesianChartWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findApplication | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds focusable chart application element. When focused, it renders a focus outline around the chart,and accepts keyboard commands. The application element is not available in empty charts. | - |
| findFallback | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds fallback slot, rendered when highcharts=null. | - |
| findFilter | [BaseChartFilterWrapper](/index.html.md) | Finds chart's filters area when default series filter or additional filters are defined. | - |
| findLegend | [BaseChartLegendWrapper](/index.html.md) | Finds chart's legend when defined. | __0:Optional axis ID to target a specific legend (e.g. "primary", "secondary"). |
| findNoData | [BaseChartNoDataWrapper](/index.html.md) | Finds chart's no-data when the chart is in no-data state. | - |
| findSeries | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[ElementWrapper](/get-started/testing/core-classes/index.html.md)> | Finds series elements. Use this to assert the number of visible series. | - |
| findTooltip | [CartesianChartTooltipWrapper](/index.html.md) | Finds chart's tooltip when visible. | - |
| findXAxisTitle | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds visible title of the x axis. | - |
| findYAxisTitle | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds visible title of the y axis. | __0:Optional axis ID to target a specific y axis title (e.g. "secondary"). | BaseChartFilterWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findAdditionalFilters | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds custom additional filters slot when defined. | - |
| findSeriesFilter | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds default series filter when defined. | - | BaseChartLegendWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findActions | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds legend's actions slot when defined. | - |
| findItems | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[ElementWrapper](/get-started/testing/core-classes/index.html.md)> | Finds legend items that match given options:active (optional, boolean) - Matches only active legend items when true, and only inactive when false.When options are not set, the function matches all legend items. | options: |
| findTitle | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds legend's visible title element when defined. | - | BaseChartNoDataWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findEmpty | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds no-data empty slot when the chart is in empty state. | - |
| findError | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds no-data error slot when the chart is in error state. | - |
| findLoading | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds no-data loading slot when the chart is in loading state. | - |
| findNoMatch | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds no-data no-match slot when the chart is in no-match state. | - |
| findRetryButton | [ButtonWrapper](/components/button/index.html.md) | Finds no-data retry button when the chart is in error state, and uses the default recovery button. | - | CartesianChartTooltipWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findBody | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findDismissButton | [ButtonWrapper](/components/button/index.html.md) | - | - |
| findFooter | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findHeader | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findPoints | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[PointDetailsItemWrapper](/index.html.md)> | Finds matched tooltip points. | - | PointDetailsItemWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findDescription | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds tooltip point description when defined. | - |
| findKey | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds tooltip point key. | - |
| findSubItems | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[PointDetailsSubItemWrapper](/index.html.md)> | Finds point sub-items when defined. | - |
| findValue | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds tooltip point value. | - | PointDetailsSubItemWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findDescription | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds tooltip point description when defined. | - |
| findKey | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds tooltip point key. | - |
| findValue | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds tooltip point value. | - |
## General guidelines

### Do

- All cartesian charts
- Skip axis labels for time series in regular intervals to avoid an overwhelming number of labels.
- Try to limit the number of items in a metric breakdown to seven to help conserve space. Prioritize content that adds value to the user.
- Bar chart
- Use for categorical data only.
- Error bars
- Show the error type in the footer to reduce visual noise, unless you are combining multiple error bar types, then show these near the series and in the footer. See an example for [mixed line and bar with error bars](/components/cartesian-chart/index.html.md)  .
- If error values are identical for all series, move this information to the tooltip footer to reduce visual noise.
- Ensure sufficient color contrast for error bars, especially as they often overlap with series lines, bars, and backgrounds.

### Don't

- All cartesian charts
- Don't show time units on the Y axis.
- Don't use a filter when the visualization has only one metric or data series.
- Don't use a legend when there is only one metric on the chart and the data shown is explained in the chart title.
- Don't truncate a data series name if the entire string is necessary to identify the data presented.
- In details of chart series, don't add links to both metric key and metric value. Instead, pick one or the other.
- Area chart
- Don't use area charts to visualize only one data series, use line charts instead.
- Don't use area charts when showing negative data. Use line or bar charts instead.
- Don't use area charts for non-stacked data. Instead, use line series.
- Mixed line and bar chart
- Don't use a mixed line and bar chart when all data series are the same type of metric. For example, average network load for two EC2 instances.
- Error bars
- Don't use error bars on scatter, or grouped bar charts.

## Features

### Chart types

Cartesian charts display information along horizontal and vertical axes to clearly show patterns, comparisons, and relationships between values. It includes line, bar, area, scatter, bubble, and mixed charts.

- #### Line chart

  Visualizes one or many series of data, with an emphasis on how the data changes over time. For example, A line chart showing the monthly trend of website traffic over the past year.
- #### Bar chart

  Visualizes one or many series of data, with an emphasis on the total amount of each data point. For example, A bar chart comparing the revenue generated by different product categories in Q1.
- #### Area chart

  The area chart visualizes two or more series of data. Through stacked data series, it emphasizes the part-to-whole relationship of data over a period of time. For example, An area chart showing the cumulative number of active users over time, segmented by user tier (Free, Pro, Enterprise).
- #### Scatter chart

  Visualizes the relationships between data in two dimensions. For example, A scatter chart illustrating the relationship between height and weight of athletes.
- #### Bubble chart

  Visualizes the relationships between data in three dimensions, using position for two variables and bubble size for a third. For example, a bubble chart comparing storage buckets by total size, number of objects, and average object size.
- #### Mixed charts

  Visualizes different, but related, series of data on a single chart. For example, A mixed chart with bars showing monthly sales and a line representing the monthly profit margin.

### All cartesian charts

- #### Data area

  The data area is where data is visualized.  

  - The data area is delineated by the X and Y axes, which provide context to the data series represented.
  - The data area can contain a single data series, multiple data series, and thresholds.
  - If there are gaps in the data, then these should show as gaps in the data series.

  A mixed cartesian chart shows one data series as bars and one or more data series as lines. This provides the ability to visualize related data series that share axis labels and helps users differentiate the data thanks to the distinct visual representation styles.  
  For example:  

  - A mixed bar and line chart that shows total data transferred using bars (to emphasize the measure of volume) and the average amount transferred as a line (to emphasize the measure of change over time).
  - A mixed scatter and line chart that shows a computed trend line for a dataset.
- #### Axis labels

  Axis labels provide context for the visualized data in the data area.  
  Axis labels are placed in two locations:  

  - **Y axis labels: **     Shown to the left of the Y axis and often used for sequential values.
  - **X axis labels: **     Shown below the X axis and often used for time intervals.

  There are two types of axis labels:  

  - **Numerical: **     Values are quantitative and continual.    

    - For example: *0, 10K, 20K, 30K*
  - **Categorical: **     Grouping of data that does not have a typical order.    

    - For example: different types of resource instances.
- #### Axis titles

  Axis titles provide additional explanation for axis labels. For example, for axis labels that contain temperature intervals, an axis title could be the following: *Temperature in Celsius*  .  
  If a set of axis labels is self-explanatory, such as a date interval, then the axis title isn't needed.  
  The axis title placement customisation is supported for the axis which is rendered as vertical. Usually, it is the Y-axis, but in inverted charts it can also be the X-axis.
- #### Zero baseline

  Using a zero baseline adds greater visual emphasis in the data visualization. For example, a visualization showing revenue should have the zero baseline emphasized because it delineates the threshold between positive and negative revenue.  
  In most cases, the zero baseline should be emphasized. However, there are two exceptions:  

  - When zero is not a meaningful threshold.    

    - For example: F° temperature scale
  - When relative changes are more meaningful to emphasize than absolute.    

    - For example: a stock chart
- #### Legend

  The legend displays more information about the data that appears in the data area.  

  - **Legend title: **     The legend title provides additional context to the legend. It's not required when legend items are self-explanatory or when the chart title provides sufficient context.
  - **Legend items:**    

    - Each data series in the data area also has a legend item, which shows the style (color, design) of the element and the data series name.
    - **Show and hide: **       Users can show or hide a series by toggling a legend item.

  The legend is optional if the chart includes only one metric and the chart title or other metadata explains the data shown.
- #### Marker

  A marker is the symbol that shows each data point on the chart. You can customize markers by:  

  - **Shape**     : Choose from `'circle'`     , `'square'`     , `'diamond'`     , `'triangle'`     , or `'triangle-down'`    .
  - **Color**     : Use different colors to show different data series.
- #### Details popover

  Provides additional information on specific data points using a popover. Information about a segment such as the name and value are displayed as key value pairs, use [links](/components/link/index.html.md)   or text. More key-value pairs can also be displayed to better understand the breakdown of a segment's data.  
  There are two main ways to interact with the details popover:  

  - **On hover: **     When a user hovers on the data area, the popover shows the name and value for each data point.
  - **On select: **     If a user selects the data area, the popover fixes in position. This works well for assistive devices and devices without hover states.

**Metric breakdown and drill down**  
  When there is additional information that makes up a metric, these can be displayed as key-value pairs that are nested under a metric that is made up of related child metrics.  
  This can be either be listed as key-value pairs or placed in an expandable section to conserve space. For example:  

  - A nested grouping of related child services under a parent key of *other services*    .
  - A list of accounts that contribute to a combined metric value of its parent.

  With links, you can provide access to a break down of more details on a new page.  

  - **Link in the Key:**     Add an external link, which opens details in a new page.    

    - For example, linking to a specific account to view customer details.
  - **Link in the Value: **     Add an external link to a value to provide a drill down into the value.    

    - For example, linking to a full page table to view a filtered list of accounts that are in an error state.

**Sizes**  
  The details popover supports all popover sizes. Use the appropriate popover size based on the amount of information you want to display, such as the length of associated labels.  

**Series details **  
  Below each series is a space to display supporting details for the series. For example, showing the error metrics for standard deviation. See error bars below for more information.  

**Popover footer **  
  To enable additional actions and drill down on the selected metric you can use the footer area of the popover. Use the footer to add:  

  - **Actions: **     Up to two buttons. When you have more than two buttons group these in a button dropdown to conserve space.
  - **Drill down: **     Drill down functionality such as filters and text. See [chart metric drill down](/patterns/general/data-vis/chart-metric-drill-down/index.html.md)     for further information.

**Popover position**  
  You can place the popover in middle of the data area or outside of the data area.
- #### Thresholds

  A threshold is a dashed line shown on a chart's data area that helps define the metrics immediately preceding or following it. A threshold is a fixed number and does not change across the chart. It can be plotted against the X or Y axis as needed. For information about customizing the threshold color, see [threshold color](/foundation/visual-foundation/data-vis-colors/index.html.md)  .
- #### Error bars

  Error bars are visual markers used to represent uncertainty or variability in data. They help users interpret how precise a data point is by showing a range, such as standard deviation, or error range directly on line, bar, and mixed charts.  

**Error metrics**  
  Display each error metric within the popover:  

  - Metric errors are different for each series: Show the error type and error metric below the series for each error.    

    - For example: [Error range: 100 - 200](/components/cartesian-chart/index.html.md)      .
  - All error metrics are the same for each series: Show the Error type and error metrics in the footer.    

    - For example: [Error range: ±50](/components/cartesian-chart/index.html.md)      .

  Use the [error bar series color palette](/foundation/visual-foundation/data-vis-colors/index.html.md)   to ensure error bars are clear and consistent across different chart types.
- #### Responsive sizing

  Charts have a default set height. However, the width is dynamic and resizes to fill its container.
- #### Built-in filter

  The chart component has a built-in filter so users can select what data metrics show on the chart. By default, all data metrics in the source data are selected to show on the chart. Use a filter when the source dataset has three or more data metrics.
- #### Additional filters

  To support users' data exploration needs, you can add more filters in the chart component. For example, A [date picker](/components/date-picker/index.html.md)   so users can filter data based on different periods of time.
- #### Linked series

  Linked series do not appear as a separate legend items and they inherit colour, visibility, and hover state from the respective primary series. Use this for projected, forecast, or supplementary series.
- #### Dual y-axis

  A cartesian chart supports up to two Y axes, allowing comparison of metrics with different units or scales on the same chart. Each series is assigned to one of the axes.

### Bar chart

- #### Chart orientation

  Bar chart data can be orientated in two ways:  

  - **Vertically**     : Displays bars vertically. Useful for showing time series data in the X axis.    

    - For example, a chart showing revenue over time.
  - **Horizontally**     : Displays bars horizontally. Useful for grouped bar charts with many categories, since more categories can be added on the Y axis without impacting label legibility.    

    - For example, a chart showing web traffic to several URLs, categorized by traffic source (desktop, mobile, and tablet).
- #### Categorized data

  When showing multiple data series on a bar chart, the data can be shown in two different ways:  

  - **Grouped: **     Displays each data point as an individual bar, grouped together by category. Useful for showing categorized data over time.    

    - For example, total bytes transferred from different data centers.
  - **Stacked: **     Displays each data point as part of a single bar representing the total category. Useful for showing categorized data which is cumulative or part of a larger whole.    

    - For example, a chart showing percentage of total of web traffic by source (such as desktop, mobile, and tablet)

[View Documentation](/components/bar-chart/index.html.md)

### States

- #### Loading

  The state of fetching data prior to the visualization being displayed. Show loading state text when the component is in this state.
- #### Error

  The state of the component when it fails to fetch data. Display error state text and provide a recovery action as a recovery mechanism.
- #### No match

  The state of visualization when there is no data to display after a user applied filters. Display no match state text and provide an action button to revert to the default state of the visualization.
- #### Empty

  The state of the component when there is no data to display. It could occur when the source data set has no metrics*.*   Display empty state text when the component is in this state.

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

#### Chart title

- Use nouns to describe what the visualization contains.  

  - For example:* Revenue*     or* CPU utilization*

#### Axis titles - optional

- Axis titles should be concise, typically from 1 to 3 words.
- If relevant, include the axis label's unit in the axis title.  

  - For example: *Billed (USD)*

#### Axis labels

- When writing date and times, follow the guidelines for [timestamps](/patterns/general/timestamps/index.html.md)  .
- Use common abbreviations to reduce visual complexity and make the visualization easier to scan.  

  - For example: *Sun *     instead of *Sunday*     , and* Jan*     instead of* January*
- Include relevant typographic symbols with label numbers, such as currency denomination or degree symbol for temperature (when appropriate).  

  - For example: *$10*     or *F°*

#### Legend title - optional

- Use nouns to describe what items the legend contains.  

  - For example: *Instance types*     or *Browsers*

#### Legend item

- For bubble charts, include the unit that represents the size of the bubble in the series title.  

  - For example: *Buckets (Object count)*

#### Loading state

- Use this text: *Loading chart*
- Follow the guidelines for [loading states](/patterns/general/loading-and-refreshing/index.html.md)  .

#### Error state

- Error message  

  - Use this text: *The data couldn't be fetched. Try again later.*
- Recovery action  

  - Use this text: *Retry*

#### Empty state

- No data available  

  - Use this text: *There is no data available.*
- Zero results state  

  - For the message, use this text: *There is no data available.*
  - For the button, use this text: *Reset filters*

## Accessibility guidelines

### General accessibility guidelines

- Follow the guidelines on alternative text and Accessible Rich Internet Applications (ARIA) regions for each component.
- Make sure to define ARIA labels aligned with the language context of your application.
- Don't add unnecessary markup for roles and landmarks. Follow the guidelines for each component.
- Provide keyboard functionality to all available content in a logical and predictable order. The flow of information should make sense.

### Component-specific guidelines

- For the default filter, follow the guidelines for [multiselect accessibility](/components/multiselect/index.html.md)  .
- Use an accessible color palette for visualizations. Follow the guidelines for [data visualization color](/foundation/visual-foundation/data-vis-colors/index.html.md)  .

#### Alternative text

- Provide alternative text for the chart. Use `ariaLabel`   to give the chart a label that matches its visible title, for example from the container header.
- Additionally, provide an alternative chart description through the `ariaDescription`   property. Use the format: *\[Chart type\] showing the \[data displayed\]. *   If applicable, also include the timeframe for the data displayed.  

  - For example: *Line chart showing the number of critical resource errors in the last one month.*

## Component Documentation and API

[All Components](https://cloudscape.design/components/index.html.md) ([API](https://cloudscape.design/components/index.html.json))
