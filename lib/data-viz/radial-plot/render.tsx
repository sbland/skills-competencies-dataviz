import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RadialBarChart } from "./radial-plot.tsx";
import { IDataItem } from "../lib.ts";

export const renderRadialPlot = (rootId: string, data: IDataItem[]) => {
  createRoot(document.getElementById(rootId)!).render(
    <StrictMode>
      <RadialBarChart data={data} />
    </StrictMode>,
  );
};
