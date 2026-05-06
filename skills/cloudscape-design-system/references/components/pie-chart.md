---
scraped_at: '2026-04-20T08:48:58+00:00'
section: components
source_url: https://cloudscape.design/components/pie-chart/index.html.md
title: Pie and donut charts
---

# Pie and donut charts

Pie and donut charts visualize the relationship or correlation between data metrics in a dataset.

 [Get design library](/get-started/for-designers/design-resources/index.html.md) [Browse code](https://github.com/cloudscape-design/chart-components/tree/main/src/pie-chart) [View in demo](/examples/react/dashboard.html) These new chart components are built on top of Highcharts, which is a [commercial third-party library](https://www.highcharts.com/) . Refer to the [licensing section on Charts](/components/charts/index.html.md) for more details.
The API properties for this component are found here: [API Properties](https://cloudscape.design/components/pie-chart/index.html.json)

## Development guidelines

To migrate from legacy to new charts, refer to the [migration guide](/get-started/dev-guides/charts-migration/index.html.md).

### Providing Highcharts

The Pie chart requires a Highcharts instance as an argument. You can resolve this instance either statically or dynamically. When Highcharts instance is null, the chart displays a fallback state that you can customize using the `fallback` property.

Load the [accessibility module](https://www.highcharts.com/docs/accessibility/accessibility-module) with the Highcharts instance to ensure proper accessibility features.

```
// Loading Highcharts statically

import Highcharts from "highcharts";
import "highcharts/modules/accessibility";

function MyChart(props) {
  return <PieChart highcharts={Highcharts} {...props} />
}

// Loading Highcharts dynamically

function MyChart(props) {
  const [highcharts, setHighcharts] = useState(null);
  useEffect(() => {
    const load = async () => {
      const Highcharts = await import("highcharts");
      await import("highcharts/modules/accessibility");
      setHighcharts(Highcharts);
    };
    load();
  }, []);
  return <PieChart highcharts={highcharts} {...props} />
}
```

Supported Highcharts versions: v12.

### State management

By default, the chart component automatically filters segments as you interact with the default filter, legend, and the chart itself. If you want to control the visible segments, you need to explicitly set the `visibleSegments` property and the `onVisibleSegmentsChange` listener.

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
  {...otherProps}
  series={{
    type: "pie",
    name: "Resouce count",
    data: [
      { name: 'Running', y: 60, color: colorChartsStatusPositive },
      { name: 'Failed', y: 30, color: colorChartsStatusHigh },
      { name: 'Pending', y: 10, color: colorChartsStatusNeutral },
    ]
  }}
/>
```

Both the default color palette as well as any custom colors you pick from our data visualization colors use [design tokens](/foundation/visual-foundation/design-tokens/index.html.md) . This means that they will automatically react to the current [visual mode](/foundation/visual-foundation/visual-modes/index.html.md) , for example dark mode.

If you are new to test utility classes, you can learn more in the [introduction article](/get-started/testing/introduction/index.html.md).
## Testing guidelines

### Resolving unit test issues with Vitest

If you encounter `TypeError: tk.CSS?.supports is not a function error` when testing the new charts with Vitest, refer to [this ticket](https://github.com/highcharts/highcharts/issues/22910) for mitigation.

## Unit testing APIs

PieChartWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findApplication | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | Returns a focusable element that controls keyboard interactions. | - |
| findChart | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findDefaultFilter | [ChartFilterWrapper](/index.html.md) &#124; null | - | - |
| findDetailPopover | [ChartPopoverWrapper](/index.html.md) &#124; null | - | - |
| findFilterContainer | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findHighlightedSegment | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findHighlightedSegmentLabel | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findInnerContent | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findLegend | [ChartLegendWrapper](/index.html.md) &#124; null | - | - |
| findSegmentLabels | Array<[ElementWrapper](/index.html.md)> | - | - |
| findSegments | Array<[ElementWrapper](/index.html.md)> | - | - |
| findStatusContainer | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findApplication | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | Finds focusable chart application element. When focused, it renders a focus outline around the chart,and accepts keyboard commands. The application element is not available in empty charts. | - |
| findFallback | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | Finds fallback slot, rendered when highcharts=null. | - |
| findFilter | [BaseChartFilterWrapper](/index.html.md) &#124; null | Finds chart's filters area when default series filter or additional filters are defined. | - |
| findInnerAreaDescription | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | Finds donut chart's inner area description when defined. | - |
| findInnerAreaTitle | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | Finds donut chart's inner area title when defined. | - |
| findLegend | [BaseChartLegendWrapper](/index.html.md) &#124; null | Finds chart's legend when defined. | __0:Optional axis ID to target a specific legend (e.g. "primary", "secondary"). |
| findNoData | [BaseChartNoDataWrapper](/index.html.md) &#124; null | Finds chart's no-data when the chart is in no-data state. | - |
| findSegments | Array<[ElementWrapper](/index.html.md)> | Finds segments elements. Use this to assert the number of visible segments. | - |
| findTooltip | [ChartTooltipWrapper](/index.html.md) &#124; null | Finds chart's tooltip when visible. | - |
| findXAxisTitle | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | Finds visible title of the x axis. | - |
| findYAxisTitle | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | Finds visible title of the y axis. | __0:Optional axis ID to target a specific y axis title (e.g. "secondary"). | ChartFilterWrapper 

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
| findTitle | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - | BaseChartFilterWrapper 

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
| findRetryButton | [ButtonWrapper](/components/button/index.html.md) &#124; null | Finds no-data retry button when the chart is in error state, and uses the default recovery button. | - | ChartTooltipWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findBody | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findDismissButton | [ButtonWrapper](/components/button/index.html.md) &#124; null | - | - |
| findFooter | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findHeader | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - | OptionsDropdownContentWrapper 

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

PieChartWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findApplication | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Returns a focusable element that controls keyboard interactions. | - |
| findChart | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findDefaultFilter | [ChartFilterWrapper](/index.html.md) | - | - |
| findDetailPopover | [ChartPopoverWrapper](/index.html.md) | - | - |
| findFilterContainer | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findHighlightedSegment | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findHighlightedSegmentLabel | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findInnerContent | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findLegend | [ChartLegendWrapper](/index.html.md) | - | - |
| findSegmentLabels | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[ElementWrapper](/get-started/testing/core-classes/index.html.md)> | - | - |
| findSegments | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[ElementWrapper](/get-started/testing/core-classes/index.html.md)> | - | - |
| findStatusContainer | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findApplication | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds focusable chart application element. When focused, it renders a focus outline around the chart,and accepts keyboard commands. The application element is not available in empty charts. | - |
| findFallback | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds fallback slot, rendered when highcharts=null. | - |
| findFilter | [BaseChartFilterWrapper](/index.html.md) | Finds chart's filters area when default series filter or additional filters are defined. | - |
| findInnerAreaDescription | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds donut chart's inner area description when defined. | - |
| findInnerAreaTitle | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds donut chart's inner area title when defined. | - |
| findLegend | [BaseChartLegendWrapper](/index.html.md) | Finds chart's legend when defined. | __0:Optional axis ID to target a specific legend (e.g. "primary", "secondary"). |
| findNoData | [BaseChartNoDataWrapper](/index.html.md) | Finds chart's no-data when the chart is in no-data state. | - |
| findSegments | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[ElementWrapper](/get-started/testing/core-classes/index.html.md)> | Finds segments elements. Use this to assert the number of visible segments. | - |
| findTooltip | [ChartTooltipWrapper](/index.html.md) | Finds chart's tooltip when visible. | - |
| findXAxisTitle | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds visible title of the x axis. | - |
| findYAxisTitle | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds visible title of the y axis. | __0:Optional axis ID to target a specific y axis title (e.g. "secondary"). | ChartFilterWrapper 

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
| findTitle | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - | BaseChartFilterWrapper 

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
| findRetryButton | [ButtonWrapper](/components/button/index.html.md) | Finds no-data retry button when the chart is in error state, and uses the default recovery button. | - | ChartTooltipWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findBody | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findDismissButton | [ButtonWrapper](/components/button/index.html.md) | - | - |
| findFooter | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findHeader | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - | OptionsDropdownContentWrapper 

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

- When defining segment colors, ensure that the order of colors defined in the [color palette](/foundation/visual-foundation/data-vis-colors/index.html.md)   is maintained across the order of segments in the pie or donut chart.
- Use a pie or donut chart to visualize up to five data metrics. If more than five data metrics need to be visualized, use a [stacked bar chart](/components/cartesian-chart/index.html.md)   instead.
- Try to limit the number of items in a metric breakdown to seven to help conserve space. Prioritize content that adds value to the user.

### Don't

- Don't use a pie or donut chart to visualize time series. Use a [bar chart](/components/cartesian-chart/index.html.md)   or [line chart](/components/cartesian-chart/index.html.md)   instead.
- Don't use a pie chart to visualize a single data metric as they are meant to show part-to-whole relationship which needs at least 2 metrics.
- Avoid truncating names describing data metrics. If truncation is necessary, ensure that unique identifiers included in the string are visible to users. For example: a chart showing S3 resources where segment labels include long ARNs. Ensure that the portion of an ARN which helps users identify the resource is visible after truncation.
- In chart series detail don't add links to both metric key and metric value. Instead, pick one or the other.

## Features

Pie and donut charts depict part-to-whole relationships between data metrics in a data set. They represent data for a snapshot of time.

- #### Chart types

  - **Pie chart**     : A pie chart helps users see the relationship between different data metrics in a data set.    

    - For example: A pie chart showing the distribution of resources by compliance status.
  - **Donut chart**     : A donut chart is a variant of a pie chart with its center removed. The empty area in the center of this chart is used to display a metric corresponding to the sum or net value of all metrics visualized in the chart.    

    - For example: A donut chart showing the distribution of revenue generated from five different products. The total revenue generated by all five resources is displayed in the center of the donut.
- #### Segments

  Individual metrics in a data set are shown as segments. The size of a segment is relative to the value of data metric it represents.  

  There is a minimum segment size to ensure all available metrics are visible, even if the metric is a relatively small part of the total. Data metrics of zero value will not show as a segment.  

  Arrange segments starting at the 12 o'clock position in clockwise direction, in one of the following orders:  

  - **Decreasing order of size: **     The segment of largest size is shown first, followed by smaller segments in the decreasing order of size.    

    - For example: In a donut chart showing the breakdown of total expenses, the segment representing the largest expense is shown first, and the smallest expense is shown last.
  - **Inherent order of metrics:**     If the metrics in a data set have an inherent ranking or order, arrange the segments in that order, irrespective of the size of each segment.    

    - For example: In a pie chart showing resources categorized by severity, the segments are arranged in a decreasing order of severity from critical to low.
- #### Segment label title - optional

  Provide a name or description for the associated data metric in the segment label title. This helps to make the chart more accessible to users with low vision or color blindness as they can identify data using these labels. These titles correspond to the labels displayed in the legend.  

  Since the segment labels don't wrap dynamically, they might not be visible in smaller viewports.
- #### Segment label description - optional

  Display the associated metric value and percentage next to each segment. This helps users interpret the chart better.  

  If users filter data that changes segment size of visualized data metrics, the new percentage should be displayed in the segment label description.
- #### Inner metric value - optional

  Use the empty area inside a donut chart to display the total or net value of all data metrics visualized in the chart.  

  The inner metric value can be used to display:  

  - Sum of all data metrics visualized in the chart. If a user filters out some data metrics, show the new sum.    

    - For example: Total cost of all services used this month.
  - If the chart is focused on one primary metric, such as percent complete or score, show that metric rather than the sum.    

    - For example: Average security score of a resource.
- #### Inner metric description - optional

  Provide an additional unit or short description corresponding to the inner metric if needed. Due to limited area inside a donut chart, the content displayed here should be concise.
- #### Details popover

  Information about a segment such as the name, value, and percentage of the associated data metric are displayed in a popover as key-value pairs, use [links](/components/link/index.html.md)   or text. By default, the associated value and percentage is displayed for each segment. More key-value pairs can also be displayed to better understand the breakdown of a segment's data.  

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
- #### Legend - optional

  Displays a list of all metrics in the source data set. A legend item comprises a visual indicator with an adjoining text label describing the metric.  

  A legend is required when the data set contains metrics with a value of zero. Since metrics with a zero value are shown in the legend, but not visualized in the chart, having a legend provides users an overview of all measured metrics.  

  A legend is optional when all data metrics in a data set are visualized and the segments are annotated using segment labels, as it provides no additional information to the user.
- #### Legend title - optional

  Use the legend title to briefly describe the legend items.  

  The legend title is not required when sufficient descriptive information about the legend is provided elsewhere on the page, such as the chart title or page title.
- #### Built-in filter - optional

  The chart component has a built-in filter. With it, users can select which data metrics show on the chart. By default, all data metrics in the source data are selected to show on the chart.  

  Use a filter in a pie or donut chart when the source data set has at least three data metrics.
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

#### Chart title

- Use nouns to describe what the visualization contains.
- For example: *Monthly bill*   or *Compliance details*

#### Segment label description

- Use the format *\[numeric value\] \[description or unit\], \[percentage value\]*  

  - For example:* 245 Gigabytes*     , *36% *     or *20 items*     , *20%*

#### Details popover

- When providing additional key-value pairs, use the format *\[key\] \[value\]*  

  - For example: *Value 200*     , *Percentage 20%*     , or *Total 1000*

#### Legend title

- Use nouns to describe what items the legend contains.  

  - For example:* Resource status*

#### Built-in filter

- For placeholder, use this text: *Filter data*

#### Inner metric

- When applicable, include relevant typographic symbols with numeric values, such as currency denomination or degree symbol for temperature.  

  - For example:* $4000*

#### Inner description

- Be concise, typically one to two words.
- If relevant, include the associated unit in the description.  

  - For example:* Revenue (USD)*

#### Loading state

- Use this text: *Loading chart*
- Follow the guidelines for [loading states](/patterns/general/loading-and-refreshing/index.html.md)  .

#### Error state

- **Error message**  

  - Use this text: *The data couldn't be fetched. Try again later.*
  - Follow the guidelines for [validation](/patterns/general/errors/validation/index.html.md)     and [alert](/components/alert/index.html.md)    .
- **Recovery action**  

  - Use this text: *Retry*
  - Follow the writing guidelines for [button](/components/button/index.html.md)    .

#### No match state

- **Heading**  

  - Use this text: *There is no matching data found*
  - Follow the guidelines for [empty states.](/patterns/general/empty-states/index.html.md)
- **Description**   - *optional*  

  - Explain why the data wasn't found.    

    - For example: *There is no matching data to display.*
- **Action button**  

  - Provides an action button to set the visualization back to the default state. This should always be a [secondary button](/components/button/index.html.md)    .
  - Use this text: *Clear filter*
  - Follow the writing guidelines for [button](/components/button/index.html.md)    .

#### Empty state

- **Heading**  

  - Use this text: *There is no data available*
  - Follow the guidelines for [empty states.](/patterns/general/empty-states/index.html.md)
- **Description **   - *optional*  

  - Explain why there is no data available.    

    - For example:* There is no data available in the source data set.*

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
