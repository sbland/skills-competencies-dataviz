import { IDataItem } from "../lib";
import "./styles.css";

export interface IRadialBarPlotProps {
  data: IDataItem[];
  width?: number;
  height?: number;
  categoryPadding?: number;
  skillPadding?: number;
  innerRadius?: number;
  outerPadding?: number;
  arcPercent?: number;
  arcStartOffset?: number;
  annotationPadding?: number;
  lineThickness?: number;
  labelTextColor?: string;
  lvlTextColor?: string;
  lvlArcColor?: string;
  colourList?: readonly string[];
}

export type Category = string;
export type ArcDataItemGenerator = d3.Arc<unknown, IDataItem>;
export type ArcCategoryGenerator = d3.Arc<unknown, string>;
export type ArcLvlGenerator = d3.Arc<unknown, number>;

export interface IRadialBarDataProcessingProps {
  data: IDataItem[];
  width: number;
  height: number;
  categoryPadding?: number;
  skillPadding?: number;
  innerRadius?: number;
  outerPadding?: number;
  arcPercent?: number;
  arcStartOffset?: number;
  categoryFocus: Category | false;
}
