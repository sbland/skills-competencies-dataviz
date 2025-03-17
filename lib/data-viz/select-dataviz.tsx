import React from "react";
import { BarPlot, IBarPlotProps } from "./bar-plot";
import { IRadialBarPlotProps, RadialBarChart } from "./radial-plot";

export interface IDataVizSelectorProps
  extends IBarPlotProps,
    IRadialBarPlotProps {}

export const DataVizSelector = ({
  data,
  width = 640,
  height = undefined,
  categoryPadding = 10,
  skillPadding = 2,
  marginRight = 20,
  marginBottom = 20,
  marginLeft = 20,
  innerRadius = 60,
  outerPadding = 120,
  arcPercent = 0.8,
  arcStartOffset = 0.1,
  annotationPadding = 30,
  categoryLabelWidth = 70,
}: IDataVizSelectorProps) => {
  const [chartType, setChartType] = React.useState<"bar" | "radial">("radial");
  const Chart = chartType === "bar" ? BarPlot : RadialBarChart;
  const _height = height ?? width;
  const args =
    chartType === "bar"
      ? {
          data,
          width,
          height: _height,
          marginRight,
          marginBottom,
          marginLeft,
          categoryPadding,
          skillPadding,
        }
      : {
          data,
          width,
          height: _height,
          innerRadius,
          categoryPadding: categoryPadding / 100, // Make similar to bar plot
          skillPadding: skillPadding / 200, // Make similar to bar plot
          outerPadding,
          arcPercent,
          arcStartOffset,
          annotationPadding,
          categoryLabelWidth,
        };
  return (
    <div>
      <button type="button" onClick={() => setChartType("bar")}>
        Bar
      </button>
      <button type="button" onClick={() => setChartType("radial")}>
        Radial
      </button>
      <Chart {...args} />
    </div>
  );
};
