---
scraped_at: '2026-04-20T08:50:49+00:00'
section: get-started
source_url: https://cloudscape.design/get-started/dev-guides/charts-migration/index.html.md
title: Charts migration
---

# Charts migration

Migration instructions from legacy to new Cloudscape charts.

## Introduction

The new chart components are built on Highcharts, providing enhanced customization, better scalability, and full visual alignment with Cloudscape. Their APIs have been updated to support both current and future features.

While legacy chart components will continue to receive bug fixes throughout the Cloudscape v3 lifecycle, we strongly recommend adopting the new components for all new charting needs.

#### Using Highcharts

**Note:** Because Highcharts is a commercial third-party library, your product **must have a valid license** to use the new chart components. Refer to the [licensing section](/components/charts/index.html.md) in the hub page for more information.

#### Comparison overview

See how the legacy and new Cloudscape chart implementations compare:

```
import Highcharts from "highcharts";
import LineChart from "@cloudscape-design/components/line-chart";
import CartesianChart from '@cloudscape-design/chart-components/cartesian-chart';

function ChartNew() {
  return (
    <CartesianChart
      highcharts={Highcharts}
      ariaLabel="Line chart"
      series={[
        { name: "Site 1", type: "line", data: data1 },
        { name: "Site 2", type: "line", data: data2 },
        { type: "y-threshold", name: "Performance goal", value: 250000 },
      ]}
      xAxis={{ type: "datetime", title: "Time (UTC)" }}
      yAxis={{ title: "Bytes transferred", min: 0, max: 500000 }}
    />
  );
}

function ChartLegacy() {
  return (
    <LineChart
      ariaLabel="Line chart"
      series={[
        { title: "Site 1", type: "line", data: data1 },
        { title: "Site 2", type: "line", data: data2 },
        { type: "threshold", title: "Performance goal", y: 250000 },
      ]}
      yDomain={[0, 500000]}
      xScaleType="time"
      xTitle="Time (UTC)"
      yTitle="Bytes transferred"
    />
  );
}
```

The sections below provide a detailed overview of API differences between legacy and new charts. To see complete code, refer to the [playground examples](/components/cartesian-chart/index.html.md).

## Cartesian chart

- Refer to [development guidelines](/components/cartesian-chart/index.html.md)   to get instructions on providing Highcharts instance, and more.
- Refer to [usage guidelines](/components/cartesian-chart/index.html.md)   and [accessibility guidelines](/components/cartesian-chart/index.html.md)   to see the full list of available features, and accessibility requirements.

### No-data states

The new charts include four no-data states: empty, no-match, loading, and error. These states are similar to those in the legacy charts (see [empty line chart](/components/line-chart/index.html.md) ). The no-data configuration is grouped under the `noData` property (see [empty cartesian chart](/components/cartesian-chart/index.html.md) ).

### Series types

The new cartesian charts support all series types ( *area* , *bar* , *line* , and *mixed line and bar* ) from the legacy charts. However, these series have different representations in the API:

1. The "bar" series type is replaced with the "column" series type, which behaves in the same way.
2. The area series are no longer stacked by default. Use `stacking: "normal"`   with area series to make them stack (see [stacked area chart](/components/cartesian-chart/index.html.md)   ).
3. There is no longer `stackedBars`   property to make columns stacked. Use `stacking: "normal"`   instead (see [stacked column chart](/components/cartesian-chart/index.html.md)   ).
4. There is no longer `horizontalBars`   property to invert the chart axes. Use `inverted: true`   instead (see [horizontal column chart](/components/cartesian-chart/index.html.md)   ).
5. The "threshold" series type of the legacy charts is replaced with two separate series types: "x-threshold" and "y-threshold" in the new charts (see [line chart with threshold](/components/cartesian-chart/index.html.md)   ).

### Axes and formatting

The legacy charts support four x scale types ( *linear* , *time* , *log* , *categorical* ) and two y scale types ( *linear* , *log* ). The new charts support four axis types ( *linear* , *datetime* , *category* , *logarithmic* ) for both x and y axes, represented with the `xAxis.type` and `yAxis.type` properties.

There is no more `xDomain` and `yDomain` properties to set the axes extremes. Instead, the extremes are defined with `min` and `max` properties of the corresponding axis, and it is also possible to set the tick interval with the `tickInterval` property. The categorical domain is controlled with a dedicated `categories` property.

```
// Before
<LineChart
  ariaLabel="Line chart"
  series={series}
  xTitle="X"
  xScaleType="categorical"
  xDomain={["A", "B", "C", "D"]}
  yTitle="Y"
  yScaleType="linear"
  yDomain={[0, 100]}
  {...otherProps}
/>

// After
<CartesianChart
  highcharts={Highcharts}
  ariaLabel="Line chart"
  series={series}
  xAxis={{ title: "X", type: "category", categories: ["A", "B", "C", "D"] }}
  yAxis={{ title: "Y", type: "linear", min: 0, max: 100, tickInterval: 5 }}
  {...otherProps}
/>
```

The axis ticks of both x- and y axes can be formatted with `xAxis.valueFormatter` , and `yAxis.valueFormatter` functions. The formatters are not used for categorical axes. Instead, pass the already formatted strings as categories. The formatter takes the tick value of type `null | number` , and returns a formatted string.

```
<CartesianChart
  highcharts={Highcharts}
  ariaLabel="Line chart"
  series={series}
  xAxis={{ title: "Dates", type: "datetime", valueFormatter: dateFormatter }}
  yAxis={{ title: "Prices", type: "linear", valueFormatter: priceFormatter }}
  {...otherProps}
/>

function dateFormatter(value) {
  return new Date(value).toISOString().slice(0, 10);
}

function priceFormatter(value) {
  return `$${value}`;
}
```

### Data types

The legacy charts support three data types for x values ( *number* , *string* , *Date* ), and a single data type for y values ( *number* ). The new charts only support numerical x and y values. The below sections describe the migration from the legacy charts using x values of type *Date* or *string*.

#### Date values

In the legacy charts with `xScaleType: "time"` the x values can be of type Date (see [line chart with time axis](/components/line-chart/index.html.md) ). In the new cartesian charts, use `xAxis.type: "datetime"` , and convert the date values to the epoch time (see [cartesian chart with time axis](/components/cartesian-chart/index.html.md) ):

```
<CartesianChart
  highcharts={Highcharts}
  ariaLabel="Line chart"
  series={[
    {
      type: "line",
      name: "Site 1",
      data: [
        new Date("2020-01-01").getTime(),
        new Date("2020-02-01").getTime(),
        new Date("2020-03-01").getTime(),
        // ...
      ],
    },
  ]}
  xAxis={{ type: "datetime", title: "Time (UTC)", valueFormatter: (value) => value === null ? "" : format(new Date(value)) }}
  yAxis={{ title: "Bytes transferred" }}
  {...otherProps}
/>
```

#### Categorical (string) values

In the legacy charts with `xScaleType: "categorical"` the x values can be of type string, which can also be used to represent dates in bar charts (see [bar chart with categorical dates](/components/bar-chart/index.html.md) ). In the new cartesian charts, provide the available categories using `xAxis.categories` , and make sure the series values order follows the order of the categories. The x values can be set to the corresponding category index, or omitted (see [cartesian chart with categorical dates](/components/cartesian-chart/index.html.md) ):

```
<CartesianChart
  highcharts={Highcharts}
  ariaLabel="Bar chart"
  series={[
    { name: "Severe", type: "column", data: [1, 2, 3, /*...*/] },
    { name: "Moderate", type: "column", data: [{ y: 4 }, { y: 5 }, { y: 6 }, /*...*/] },
    { name: "Low", type: "column", data: [{ x: 0, y: 7 }, { x: 1, y: 8 }, { x: 2, y: 9 }, /*...*/] },
  ]}
  xAxis={{
    type: "category",
    title: "Time (UTC)",
    categories: ["2020-01-01", "2020-02-01", "2020-03-01", /*...*/],
  }}
  yAxis={{ title: "Error count" }}
  {...otherProps}
/>
```

Note: the `xAxis.valueFormatter` is not applicable for categories.

### Tooltip details

The new cartesian chart offers the same capabilities as legacy charts to customize the tooltip details by formatting y values, replacing matched series keys and values, adding nested (drill-down) series, and adding custom footer content (see [legacy bar chart with customized tooltip details](/components/bar-chart/index.html.md) ). The new tooltip API is grouped under the `tooltip` property (see [cartesian chart with customized tooltip details](/components/cartesian-chart/index.html.md) ):

1. The data points shown in the tooltip can be customized with the `tooltip.point()`   render function, similar to the `detailPopoverSeriesContent`   from the legacy charts.
2. The matched points values are formatted with the `yAxis.valueFormatter`   function, if defined, or with a default formatter otherwise.
3. The tooltip footer content is defined with the `tooltip.footer()`   render function. It adds a horizontal separator line automatically.

```
// Before
<LineChart
  series={series}
  detailPopoverSeriesContent={({ series, x, y }) => ({
    key: series.title,
    value: <ItemLink value={y}>{formatValue(y)}</ItemLink>
  })}
  detailPopoverFooter={(x) => (
    <div>
      <hr />
      <FooterActions value={x} />
    </div>
  )}
  {...otherProps}
/>

// After
<CartesianChart
  highcharts={Highcharts}
  series={series}
  tooltip={{
    point: ({ item }) => ({
      value: <ItemLink value={item.y}>{formatValue(item.y)}</ItemLink>
    }),
    footer: ({ x }) => <FooterActions value={x} />,
  }}
  {...otherProps}
/>
```

### Tooltip details total

In the legacy area charts the tooltip shows the total row below matched series points (see [legacy stacked area chart](/components/area-chart/index.html.md) ). In the new charts, it is no longer the case. However, the total row can still be added as a footer customization (see [new stacked area chart](/components/cartesian-chart/index.html.md) ):

```
<CartesianChart
  highcharts={Highcharts}
  series={series}
  tooltip={{
    footer({ items }) {
      const total = items.map(i => i.y ?? 0).reduce((a, b) => a + b, 0);
      return (
        <div style={{ display: "flex", justifyContent: "space-between", gap: "16px" }}>
          <span>Total</span>
          <span>{numberFormatter(total)}</span>
        </div>
      );
    },
  }}
  {...otherProps}
/>
```

### Series visibility

In legacy charts, series visibility can be controlled or uncontrolled (managed by the chart). The new cartesian charts support this functionality as well. However, series are now matched by their IDs instead of references. This change prevents a known issue where series visibility state becomes invalid when series references change after React render.

```
function MyChart() {
  const [visibleSeries, setVisibleSeries] = useState(["s1", "s2"]);
  return (
    <CartesianChart
      highcharts={Highcharts}
      series={[
        { type: "line", id: "s1", name: "Site 1", data: site1Data },
        { type: "line", id: "s2", name: "Site 2", data: site2Data },
        { type: "line", id: "s3", name: "Site 3", data: site2Data },
      ]}
      visibleSeries={visibleSeries}
      onVisibleSeriesChange={({ detail: { visibleSeries } }) =>
        setVisibleSeries(visibleSeries)
      }
      {...otherProps}
    />
  );
}
```

When series IDs aren't provided, names are used instead. We recommend providing IDs to ensure uniqueness.

### Series highlighting

In the legacy charts, there is API to control series highlighting, represented with `highlightedSeries` and `onHighlightChange` properties. This API is currently **not supported** in the new charts, due to its impact on the component's performance.

If you are using the legacy series highlighting API in your code, please reach out and share your use case. The Cloudscape team will analyze it, and design a solution for you.

## Pie chart

- Refer to [development guidelines](/components/pie-chart/index.html.md)   to get instructions on providing Highcharts instance, and more.
- Refer to [usage guidelines](/components/pie-chart/index.html.md)   and [accessibility guidelines](/components/pie-chart/index.html.md)   to see the full list of available features, and accessibility requirements.

### No-data states

The new charts include four no-data states: empty, no-match, loading, and error. These states are similar to those in the legacy charts (see [legacy empty pie chart](/components/pie-chart-legacy/index.html.md) ). The no-data configuration is grouped under `noData` property (see [new empty pie chart](/components/pie-chart/index.html.md) ).

### Series types

In the legacy charts, the pie segments are represented with `data` property, and the series type is represented with `variant` property, supporting "pie" and "donut" variants (see [legacy pie chart](/components/pie-chart-legacy/index.html.md) ). In the new charts, the same information is represented with the `series` property, which takes a series of type "pie" or "donut". The segments are represented as `series.data` (see [new pie chart](/components/pie-chart/index.html.md) ).

### Segment labels and inner area

The legacy charts allow customization of the segment labels and inner area (donut charts only). The same is supported in the new charts, but with an updated API (see [legacy donut chart](/components/pie-chart-legacy/index.html.md) , [new donut chart](/components/pie-chart/index.html.md) ):

- `segmentDescription`   , `hideTitles`   , and `hideDescriptions`   are replaced with `segmentTitle`   and `segmentDescription`   render functions.
- `innerMetricValue`   and `innerMetricDescription`   are replaced with `innerAreaTitle`   and `innerAreaDescription`  .

```
// Before
<PieChart
  data={data}
  variant="donut"
  hideTitles={true}
  segmentDescription={(datum, sum) => <Percentage value={datum.value} total={sum} />}
  innerMetricValue="100"
  {...otherProps}
/>

// After
<PieChart
  highcharts={Highcharts}
  series={{ type: "donut", name: "Resource count", data }}
  segmentTitle={() => ""}
  segmentDescription={(detail) => <Percentage value={detail.segmentValue} total={detail.totalValue} />}
  innerAreaTitle="100"
  {...otherProps}
/>
```

### Chart size

Legacy pie and donut charts offer flexible sizing using the `fitHeight` property. Without this property, you can choose from three predefined sizes: small, medium, or large. For new charts, use the `chartHeight` property to set the plot area height in pixels.

Note: the `fitHeight` behavior remains the same.

### Tooltip details

In the legacy charts, the tooltip body and footer content can be customized with `detailPopoverContent` and `detailPopoverFooter` properties. The content function takes a list of key-value pairs (see [legacy pie chart](/components/pie-chart-legacy/index.html.md) ). The new charts offer the same customization via the `tooltip.details()` , and `tooltip.footer()` render properties (see [new pie chart](/components/pie-chart/index.html.md) ).

By default, the legacy pie chart tooltip shows two key-value pairs. These are supported by built-in i18n: one for the property value and another for the percentage of the total visible segments. The new chart's default tooltip shows a simplified key-value pair (series name and segment value). Use details customization to match the previous behavior:

```
<PieChart
  highcharts={Highcharts}
  series={{
    name: "Resource count",
    type: "pie",
    data: [
      { name: "Running", y: 60 },
      { name: "Failed", y: 30 },
      { name: "In-progress", y: 10 },
    ],
  }}
  tooltip={{
    details({ segmentValue, totalValue }) {
      return [
        { key: "Value", value: segmentValue },
        { key: "Percentage", value: `${((segmentValue / totalValue) * 100).toFixed(0)}%` },
      ];
    },
  }}
  {...otherProps}
/>
```

### Segments visibility

In the legacy chart, segments visibility can be controlled or uncontrolled (managed by the chart). The new pie chart supports this functionality as well. However, segments are now matched by their IDs instead of references. This change prevents a known issue where segments visibility state becomes invalid when segments references change after React render.

```
function MyChart() {
  const [visibleSegments, setVisibleSegments] = useState(["s1", "s2"]);
  return (
    <PieChart
      highcharts={Highcharts}
      series={{
        name: "Resource count",
        type: "pie",
        data: [
          { id: "s1", name: "Segment 1", y: 10 },
          { id: "s2", name: "Segment 2", y: 30 },
          { id: "s3", name: "Segment 3", y: 60 },
        ]
      }}
      visibleSegments={visibleSegments}
      onVisibleSegmentsChange={({ detail: { visibleSegments } }) =>
        setVisibleSegments(visibleSegments)
      }
      {...otherProps}
    />
  );
}
```

When segments IDs aren't provided, names are used instead. We recommend providing IDs to ensure uniqueness.

### Segments highlighting

In the legacy charts, there is API to control segments highlighting, represented with `highlightedSegment` and `onHighlightChange` properties. This API is currently **not supported** in the new charts, due to its impact on the component's performance.

If you are using the legacy segments highlighting API in your code, please reach out and share your use case. The Cloudscape team will analyze it, and design a solution for you.
