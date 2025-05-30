import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RadialBarChart } from "./radial-plot.tsx";
import { IDataItem } from "../lib.ts";
import { IRadialBarPlotProps } from "./lib.ts";

export const renderRadialPlot = (
  element: HTMLElement,
  data: IDataItem[],
  options: Omit<IRadialBarPlotProps, "data">,
) => {
  createRoot(element).render(
    <StrictMode>
      <RadialBarChart data={data} {...options} />
    </StrictMode>,
  );
};
