import * as d3 from "d3";
import { IDataItem } from "./lib";

export interface IBarPlotProps {
  data: IDataItem[];
  width?: number;
  height?: number;
  marginTop?: number;
  marginRight?: number;
  marginBottom?: number;
  marginLeft?: number;
  categoryPadding?: number;
  skillPadding?: number;
  categoryAxisLabelsHeight?: number;
}

function getColor(categories: string[]): (category: string) => string {
  return d3
    .scaleOrdinal()
    .domain(categories)
    .range(d3.schemeSpectral[categories.length])
    .unknown("#ccc") as (category: string) => string;
}

type Category = string;

export function BarPlot({
  data,
  width = 640,
  height = 400,
  marginRight = 20,
  marginBottom = 20,
  marginLeft = 20,
  categoryPadding = 40,
  skillPadding = 20,
  categoryAxisLabelsHeight = 30,
}: IBarPlotProps) {
  const groupedByCategory = d3.group(data, (d) => d.category);
  const categoryIds = [...d3.union(data.map((d) => d.category)).keys()];
  const sortedCategories = categoryIds.sort();

  const color = getColor(sortedCategories);

  /* Calculate how many skills proceed each skill item
  This dictates the amount to offset (count * skillPadding) from the start angle
  */
  const skillPaddingCount = sortedCategories.reduce((acc, category) => {
    const count = (groupedByCategory.get(category)?.length ?? 0) - 1;
    return acc + count;
  }, 0);

  const usableWidth = width - marginLeft - marginRight;

  /* Calculate the column widths based on the available width
  shared between the categories and the skills with padding
  included
  */
  const columnWidth =
    (usableWidth -
      categoryPadding * (categoryIds.length - 1) -
      skillPadding * skillPaddingCount) /
    data.length;

  const categoryLeftPositions = sortedCategories.reduce(
    (acc, category) => [
      ...acc,
      acc[acc.length - 1] +
        (groupedByCategory.get(category)?.length ?? 0) * columnWidth +
        ((groupedByCategory.get(category)?.length ?? 0) - 1) * skillPadding +
        categoryPadding,
    ],
    [0],
  );
  const categoryLeftPositionsMap: Record<Category, number> =
    categoryLeftPositions
      .slice(0, -1)
      .reduce((acc, v, i) => ({ ...acc, [sortedCategories[i]]: v }), {});

  const catX = (categoryId: Category) =>
    categoryLeftPositionsMap[categoryId] || -1;

  const skillX = (categoryId: Category, skillId: string) =>
    (groupedByCategory.get(categoryId)?.findIndex((s) => s.skill == skillId) ??
      0) *
      columnWidth +
    (groupedByCategory.get(categoryId)?.findIndex((s) => s.skill == skillId) ??
      0) *
      skillPadding;

  const categoryWidthsMap: Record<Category, number> = sortedCategories.reduce(
    (acc, category) => ({
      ...acc,
      [category]:
        (groupedByCategory.get(category)?.length ?? 0) * columnWidth +
        ((groupedByCategory.get(category)?.length ?? -99) - 1) * skillPadding,
    }),
    {},
  );

  /* React component elements */
  const createAxisNode = (cat: string, dItems: IDataItem[]) => (
    <g
      key={cat}
      fill={color(cat)}
      className="categoryGroup"
      data-category={cat}
      transform={`translate(${catX(cat).toString()},${(height - marginBottom).toString()})`}
    >
      <rect
        transform={`translate(0, -${categoryAxisLabelsHeight.toString()})`}
        width={categoryWidthsMap[cat]}
        height={categoryAxisLabelsHeight}
      />
      <text
        transform={`translate(${(categoryWidthsMap[cat] / 2).toString()}, ${(
          -categoryAxisLabelsHeight / 4
        ).toString()})`}
        fill="black"
        textAnchor="middle"
      >
        {cat}
      </text>
      {dItems.map((d) => (
        <g
          key={`${cat}-${d.skill}`}
          transform={`translate(${skillX(d.category, d.skill).toString()}, -${(categoryAxisLabelsHeight + 10).toString()})`}
          data-skill={d.skill}
        >
          {/* <text
            transform={`translate(${(columnWidth / 2).toString()}, 0)`}
            fill="black"
            textAnchor="middle"
          >
            {d.skill}
          </text> */}
          <text
            transform={`translate(${(columnWidth / 2).toString()}, -${(d.lvl + 1.5) * 20})`}
            fill="black"
            textAnchor="middle"
          >
            {d.lvl}
          </text>
          {Array.from({ length: d.lvl }, (_v, k) => k + 1).map((lvl) => (
            <rect
              key={`${cat}-${d.skill}-${lvl}`}
              width={columnWidth}
              height={19}
              transform={`translate(0, -${(20 + lvl * 20).toString()})`}
            />
          ))}
          <rect
            width={columnWidth}
            height={d.lvl * 20}
            transform={`scale(1), translate(0, -${(20 + d.lvl * 20).toString()})`}
            fill="none"
            stroke="none"
            tabIndex={0}
          />
        </g>
      ))}
    </g>
  );

  return (
    <svg width={width} height={height} style={{ border: "1px solid black" }}>
      <g id="x-axis" transform={`translate(${marginLeft.toString()},0)`}>
        {sortedCategories.map((c) =>
          createAxisNode(c, groupedByCategory.get(c) ?? []),
        )}
      </g>
    </svg>
  );
}
