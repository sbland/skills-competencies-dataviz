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
  innerRadius = 65,
  categoryPadding = 30,
  skillPadding = 6,
  marginRight = 20,
  marginBottom = 20,
  marginLeft = 20,
}: IDataVizSelectorProps) => {
  const [chartType, setChartType] = React.useState<"bar" | "radial">("bar");
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
          categoryPadding: categoryPadding / 100,
          skillPadding: skillPadding / 200,
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
