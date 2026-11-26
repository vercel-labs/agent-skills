---
scraped_at: '2026-04-20T08:48:46+00:00'
section: components
source_url: https://cloudscape.design/components/mixed-line-bar-chart/index.html.md
title: Mixed line and bar chart
---

# Mixed line and bar chart

Visualizes different, but related, series of data on a single chart.

 [Get design library](/get-started/for-designers/design-resources/index.html.md) [Browse code](https://github.com/cloudscape-design/components/tree/main/src/mixed-line-bar-chart) Consider using new charts powered by Highcharts The chart components on this page are now considered "legacy" and are replaced by [new chart components powered by Highcharts](/components/charts/index.html.md) . Cloudscape will continue to support legacy chart components, but we highly recommend that you consider using the new chart components which are more flexible and feature-rich. Keep in mind that Highcharts is a commercial third-party library, so you need to acquire the appropriate licenses. For more information, refer to the [new charts page](/components/charts/index.html.md) and the [charts migration guide](/get-started/dev-guides/charts-migration/index.html.md).
The API properties for this component are found here: [API Properties](https://cloudscape.design/components/mixed-line-bar-chart/index.html.json)

## Development guidelines

### State management

By default, the chart components automatically filter and highlight series as you interact with the default filter and the chart itself.

If you want to control the visible series, you need to explicitly set the `visibleSeries` property and the `onFilterChange` listener.

If you want to control the highlighted series, you need to explicitly set the `highlightedSeries` property and the `onHighlightChange` listener.

Leaving the behavior uncontrolled requires the series to remain unchanged during the lifetime of the component. If you need to regenerate the objects passed as `series` , you should use the controlled behavior, and also update `visibleSeries` and `highlightedSeries` accordingly when the `series` array changes.

Learn more about the [state management](/get-started/dev-guides/state-management/index.html.md) of Cloudscape components.

[Learn more](/get-started/dev-guides/state-management/index.html.md)

### Usage of color

By default, the chart components use the Cloudscape generic categorical color palette as described in our [data visualization colors](/foundation/visual-foundation/data-vis-colors/index.html.md) article. If you want to use other colors, we recommend to use our data visualization colors as well. Custom colors are defined as part of the `data` property:

```
import {
  colorChartsStatusNeutral,
  colorChartsStatusHigh,
  colorChartsStatusPositive
} from '@cloudscape-design/design-tokens';

<PieChart
  data={[
    {
      title: 'Running',
      value: 60,
      color: colorChartsStatusPositive
    },
    {
      title: 'Failed',
      value: 30,
      color: colorChartsStatusHigh
    },
    {
      title: 'Pending',
      value: 10,
      color: colorChartsStatusNeutral
    }
  ]}
/>
```

*Note: The example above uses the pie chart component, but the same guidance applies for the * *color** properties on all chart components.*

Both the default color palette as well as any custom colors you pick from our data visualization colors use [design tokens](/foundation/visual-foundation/design-tokens/index.html.md) . This means that they will automatically react to the current [visual mode](/foundation/visual-foundation/visual-modes/index.html.md) , for example dark mode.

Design tokens use [CSS custom properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*) , also known as CSS variables, which are not supported in Internet Explorer 11. However, this component automatically makes sure that colors which use CSS custom properties are displayed correctly in Internet Explorer 11 by always using the light mode color, i.e. the fallback value.

### Order of data

When displaying a line series on a `linear` or `time` scale, make sure that the data points in the data arrays are in the correct order, i.e. the `x` values follow the order of the `xDomain` . If this is not the case, the component will attempt to render them out of order, which can result in an unwanted visualization. The rendering of the chart data is done by the third-party library [D3](https://github.com/d3/d3).

However, charts with a `categorical` scale always follow the order of the `xDomain` array, regardless of the order of the `data` array.

### Responsiveness of axis labels

The axis labels on the left-hand side of the chart do not support line breaks and will take as much horizontal space as they need. The width of the chart area will be reduced to accommodate for that. You can format these labels with the `i18nStrings.yTickFormatter` property (or `xTickFormatter` if you are using a horizontal bar chart).

The axis labels on the bottom of the chart do not automatically wrap. You can format them and add line breaks ( `\n` ) with the `i18nStrings.xTickFormatter` property (or `yTickFormatter` if you are using a horizontal bar chart).

If you are new to test utility classes, you can learn more in the [introduction article](/get-started/testing/introduction/index.html.md).
## Unit testing APIs

MixedLineBarChartWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findApplication | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | Returns a focusable element that controls keyboard interactions. | - |
| findBarGroups | Array<[ElementWrapper](/index.html.md)> | Returns an array of bar groups, which are used for mouse navigation if a chart contains bar series. | - |
| findChart | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findDefaultFilter | [ChartFilterWrapper](/index.html.md) &#124; null | - | - |
| findDetailPopover | [ChartPopoverWrapper](/index.html.md) &#124; null | - | - |
| findFilterContainer | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findHighlightedSeries | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findLegend | [ChartLegendWrapper](/index.html.md) &#124; null | - | - |
| findSeries | Array<[ElementWrapper](/index.html.md)> | Returns an array of chart series. Note that thresholds count as series as well. | - |
| findStatusContainer | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findXAxisTitle | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findXTicks | Array<[ElementWrapper](/index.html.md)> | - | - |
| findYAxisTitle | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findYTicks | Array<[ElementWrapper](/index.html.md)> | - | - | ChartFilterWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| clickSelectAll | - | Selects all options by triggering corresponding events on the element that selects or deselects all options in Multiselect when using the enableSelectAll flag.This utility does not open the dropdown of the given select. You will need to call openDropdown first in your test.Example:wrapper.openDropdown();wrapper.clickSelectAll(); | options:* expandToViewport (boolean) - Use this when the component under test is rendered with an `expandToViewport` flag. |
| closeDropdown | - | - | options:* expandToViewport (boolean) - Use this when the component under test is rendered with an `expandToViewport` flag. |
| findDropdown | [OptionsDropdownContentWrapper](/index.html.md) | - | options:* expandToViewport (boolean) - Use this when the component under test is rendered with an `expandToViewport` flag. |
| findPlaceholder | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findTrigger | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> | - | - |
| openDropdown | - | - | - |
| selectOption | - | Selects an option for the given index by triggering corresponding events.This utility does not open the dropdown of the given select. You will need to call openDropdown first in your test.On selection the dropdown will close automatically.Example:wrapper.openDropdown();wrapper.selectOption(1); | index:1-based index of the option to selectoptions:* expandToViewport (boolean) - Use this when the component under test is rendered with an `expandToViewport` flag. |
| selectOptionByValue | - | Selects an option for the given value by triggering corresponding events.This utility does not open the dropdown of the given select. You will need to call openDropdown first in your test.On selection the dropdown will close automatically.Example:wrapper.openDropdown();wrapper.selectOptionByValue('option_1'); | value:value of the optionoptions:* expandToViewport (boolean) - Use this when the component under test is rendered with an `expandToViewport` flag. | ChartPopoverWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findContent | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findDismissButton | [ButtonWrapper](/components/button/index.html.md) &#124; null | - | - |
| findHeader | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findSeries | Array<[ChartPopoverSeriesWrapper](/index.html.md)> &#124; null | - | - | ChartLegendWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findHighlightedItem | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findItems | Array<[ElementWrapper](/index.html.md)> | - | - |
| findNativeList | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findTitle | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - | OptionsDropdownContentWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findDisabledOptions | Array<[OptionWrapper](/index.html.md)> | - | - |
| findFooterRegion | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findGroup | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | Returns an option group from the dropdown. | index:1-based index of the group to select. |
| findGroups | Array<[ElementWrapper](/index.html.md)> | Returns all option groups in the dropdown. | - |
| findHighlightedAriaLiveRegion | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findHighlightedMatches | Array<[ElementWrapper](/index.html.md)> | Returns highlighted text fragments from all of the options.Options get highlighted when they match the value of the input field. | - |
| findHighlightedOption | [OptionWrapper](/index.html.md) &#124; null | - | - |
| findOpenDropdown | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findOption | [OptionWrapper](/index.html.md) &#124; null | Returns an option from the dropdown. | optionIndex:1-based index of the option to select. |
| findOptionByValue | [OptionWrapper](/index.html.md) &#124; null | - | value: |
| findOptionInGroup | [OptionWrapper](/index.html.md) &#124; null | Returns an option from the dropdown. | groupIndex:1-based index of the group to select an option in.optionIndex:1-based index of the option to select. |
| findOptions | Array<[OptionWrapper](/index.html.md)> | - | - |
| findOptionsContainer | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | Use this element to scroll through the list of options | - |
| findSelectAll | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findSelectedOptions | Array<[OptionWrapper](/index.html.md)> | - | - | ChartPopoverSeriesWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findKey | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> | - | - |
| findSubItems | Array<[ChartPopoverSeriesItemWrapper](/index.html.md)> | - | - |
| findValue | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> | - | - | OptionWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findDescription | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findDisabledReason | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findLabel | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> | Finds the label wrapper of this option. | - |
| findLabelTag | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findTags | Array<[ElementWrapper](/index.html.md)> &#124; null | - | - |
| isDisabled | boolean | - | - | ChartPopoverSeriesItemWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findKey | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> | - | - |
| findValue | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> | - | - |
## Integration testing APIs

MixedLineBarChartWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findApplication | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Returns a focusable element that controls keyboard interactions. | - |
| findBarGroups | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[ElementWrapper](/get-started/testing/core-classes/index.html.md)> | Returns an array of bar groups, which are used for mouse navigation if a chart contains bar series. | - |
| findChart | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findDefaultFilter | [ChartFilterWrapper](/index.html.md) | - | - |
| findDetailPopover | [ChartPopoverWrapper](/index.html.md) | - | - |
| findFilterContainer | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findHighlightedSeries | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findLegend | [ChartLegendWrapper](/index.html.md) | - | - |
| findSeries | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[ElementWrapper](/get-started/testing/core-classes/index.html.md)> | Returns an array of chart series. Note that thresholds count as series as well. | - |
| findStatusContainer | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findXAxisTitle | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findXTicks | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[ElementWrapper](/get-started/testing/core-classes/index.html.md)> | - | - |
| findYAxisTitle | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findYTicks | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[ElementWrapper](/get-started/testing/core-classes/index.html.md)> | - | - | ChartFilterWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findDropdown | [OptionsDropdownContentWrapper](/index.html.md) | - | options:* expandToViewport (boolean) - Use this when the component under test is rendered with an `expandToViewport` flag. |
| findPlaceholder | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findTrigger | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - | ChartPopoverWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findContent | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findDismissButton | [ButtonWrapper](/components/button/index.html.md) | - | - |
| findHeader | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findSeries | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[ChartPopoverSeriesWrapper](/index.html.md)> | - | - | ChartLegendWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findHighlightedItem | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findItems | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[ElementWrapper](/get-started/testing/core-classes/index.html.md)> | - | - |
| findNativeList | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findTitle | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - | OptionsDropdownContentWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findDisabledOptions | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[OptionWrapper](/index.html.md)> | - | - |
| findFooterRegion | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findGroup | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Returns an option group from the dropdown. | index:1-based index of the group to select. |
| findGroups | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[ElementWrapper](/get-started/testing/core-classes/index.html.md)> | Returns all option groups in the dropdown. | - |
| findHighlightedAriaLiveRegion | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findHighlightedMatches | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[ElementWrapper](/get-started/testing/core-classes/index.html.md)> | Returns highlighted text fragments from all of the options.Options get highlighted when they match the value of the input field. | - |
| findHighlightedOption | [OptionWrapper](/index.html.md) | - | - |
| findOpenDropdown | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findOption | [OptionWrapper](/index.html.md) | Returns an option from the dropdown. | optionIndex:1-based index of the option to select. |
| findOptionByValue | [OptionWrapper](/index.html.md) | - | value: |
| findOptionInGroup | [OptionWrapper](/index.html.md) | Returns an option from the dropdown. | groupIndex:1-based index of the group to select an option in.optionIndex:1-based index of the option to select. |
| findOptions | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[OptionWrapper](/index.html.md)> | - | - |
| findOptionsContainer | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Use this element to scroll through the list of options | - |
| findSelectAll | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findSelectedOptions | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[OptionWrapper](/index.html.md)> | - | - | ChartPopoverSeriesWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findKey | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findSubItems | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[ChartPopoverSeriesItemWrapper](/index.html.md)> | - | - |
| findValue | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - | OptionWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findDescription | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findDisabledReason | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findLabel | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds the label wrapper of this option. | - |
| findLabelTag | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findTags | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[ElementWrapper](/get-started/testing/core-classes/index.html.md)> | - | - | ChartPopoverSeriesItemWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findKey | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findValue | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
## General guidelines

### Do

- Show time units on the X axis.
- Use for categorical data only.
- Skip axis labels for time series in regular intervals to avoid an overwhelming number of labels.
- Try to limit the number of items in a metric breakdown to seven to help conserve space. Priority should be given to the content that adds value to the user.

### Don't

- Don't use a filter when the visualization has only one metric or data series.
- Don't use a legend when there is only one metric on the chart and the data shown is explained in the chart title.
- Don't truncate a data series name if the entire string is necessary to identify the data presented.
- Don't use a mixed line and bar chart when all data series are the same type of metric. For example: Average network load for two instances.
- In chart series detail don't add links to both metric key and metric value. Instead, pick one or the other.

## Features

- #### Data area

  The data area is where the data is visualized.  

  - The data area is delineated  by the X and Y axes, which provide context to the data series represented in the data area.
  - The data area can contain a single data series, or multiple data series. The data area can also include thresholds.
  - If there are gaps in the data, then these should show as gaps in the data series.

  A mixed chart shows one data series as bars and one or more data series as lines. This provides the ability to visualize related data series that share axis labels and helps users differentiate the data thanks to the distinct visual representation styles.  

  For example: A chart that shows total data transferred using bars (to emphasize the measure of volume) and the average amount transferred as a line (to emphasize the measure of change over time).
- #### Data area

  The data area is where data is visualized.  

  - The data area is delineated  by the X and Y axes, which provide context to the data series represented.
  - The data area can contain a single data series, multiple data series, and thresholds.
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
- #### Axis titles - optional

  Axis titles provide additional explanation for axis labels. For example, for axis labels that contain temperature intervals, an axis title could be the following: *Temperature in Celsius*  .  

  If a set of axis labels is self-explanatory, such as a date interval, then the axis title isn't needed.
- #### Zero baseline - optional

  Using a zero baseline adds greater visual emphasis in the data visualization. For example, a visualization showing revenue should have the zero baseline emphasized because it delineates the threshold between positive and negative revenue.  

  In most cases, the zero baseline should be emphasized. However, there are two exceptions:  

  - When zero is not a meaningful threshold    

    - For example: F° temperature scale.
  - When relative changes are more meaningful to emphasize than absolute    

    - For example: a stock chart.
- #### Legend - optional

  The legend displays more information about the data that appears in the data area.  

  - **Legend title **     -The legend title provides additional context to the legend. It's not required when legend items are self-explanatory or the chart title provides sufficient context.
  - **Legend items **     - Each data series in the data area also has a legend item, which shows the style (color, design) of the element and the data series name.

  The legend is optional if the chart includes only one metric and the chart title or other metadata explains the data shown.
- #### Details popover - optional

  Provides additional information on specific data points using a popover. Information about a segment such as the name and value are displayed as key value pairs, use [links](/components/link/index.html.md)   or text. More key-value pairs can also be displayed to better understand the breakdown of a segment's data.  

  There are two main ways to interact with the details popover:  

  - **On hover: **     When a user hovers on the data area, the popover shows the name and value for each data point.
  - **On select:**     If a user selects the data area, the popover fixes in position. This works well for assistive devices and devices without hover states.

**Metric breakdown and drill down**  
  When there is additional information that makes up a metric, these can be displayed as key-value pairs that are nested under a metric that is made up of related child metrics.  

  This can be either be listed as key-value pairs or placed in an expandable section to conserve space. For example:  

  - A nested grouping of related child services under a parent key of *other services*    .
  - A list of accounts that contribute to a combined metric value of its parent.

  With links, you can provide access to a break down of more details on a new page.  

  - **Link in the Key:**     Add an external link, which opens details in a new page.    
    For example linking to a specific account to view customer details.
  - **Link in the Value:**     Add an external link to a value to provide a drill down into the value. For example, linking to a full page table to view a filtered list of accounts that are in an error state.

**Sizes**  
  The details popover supports all popover sizes. Use the appropriate popover size based on the amount of information you want to display, such as the length of associated labels.  

**Popover footer**  
  To enable additional actions and drill down on the selected metric you can use the footer area of the popover. Use the footer to add:  

  - **Actions:**     Up to two buttons. When you have more than two buttons group these in a button dropdown to conserve space.
  - **Drill down:**     Drill down functionality such as filters and text. See [chart metric drill down](/patterns/general/data-vis/chart-metric-drill-down/index.html.md)     for further information.
- #### Thresholds - optional

  A threshold is a dashed line shown on a chart's data area that helps define the metrics immediately preceding or following it. A threshold is a fixed number and does not change across the chart. It can be plotted against the X or Y axis as needed. For information about customizing the threshold color, see [threshold color](/foundation/visual-foundation/data-vis-colors/index.html.md)  .
- #### Responsive sizing

  Charts have a default set height. However, the width is dynamic and resizes to fill its container.
- #### Built-in filter - optional

  The chart component has a built-in filter so users can select what data metrics show on the chart. By default, all data metrics in the source data are selected to show on the chart. Use a filter when the source dataset has three or more data metrics.
- #### Additional filters - optional

  To support users' data exploration needs, you can add more filters in the chart component. For example: A [date picker](/components/date-picker/index.html.md)   so users can filter data based on different periods of time.

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

- Avoid truncating any parts of data series names that could be important in differentiating it from other data series.

#### Chart title

- Use nouns to describe what the visualization contains.  

  - For example: *Revenue*     or *CPU utilization*

#### Axis titles - optional

- Axis titles should be concise, typically from 1 to 3 words.
- If relevant, include the axis label's unit in the axis title.  

  - For example: *Billed (USD)*

#### Axis labels

- When writing date and times, follow the guidelines for [timestamps](/patterns/general/timestamps/index.html.md)  .
- Use common abbreviations to reduce visual complexity and make the visualization easier to scan.  

  - For example: *Sun*     instead of *Sunday*     , and *Jan*     instead of *January*
- Include relevant typographic symbols with label numbers, such as currency denomination or degree symbol for temperature (when appropriate).  

  - For example: *$10*     or *F°*

#### Legend title - optional

- Use nouns to describe what items the legend contains.  

  - For example:* Instance types *     or* Browsers*

#### Loading state

- Use this text *Loading chart*
- Follow the guidelines for [loading states](/patterns/general/loading-and-refreshing/index.html.md)  .

#### Error state

- Error message  

  - Use this text: *The data couldn't be fetched. Try again later.*
- Recovery action  

  - Use this text: *Retry*

#### Empty state

- No data available  

  - Use this text: *No data available*
- Zero results state  

  - For the message, use this text: *No data available*
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

#### Alternative text for chart description

- Provide alternative text for the chart. This is only referenced by screen readers or when a user hovers over the chart area with their pointer.  

  - Use the format: *\[Chart type\] showing the \[data displayed\].*     If applicable, also include the timeframe for the data displayed.    

    - For example: *Chart showing the number of resource errors in the last 6 months.*

## Component Documentation and API

[All Components](https://cloudscape.design/components/index.html.md) ([API](https://cloudscape.design/components/index.html.json))
