import React from "react";
import * as d3 from "d3";
import { IDataItem } from "./lib";
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
  categoryLabelWidth?: number;
  lineThickness?: number;
}

function getColor(categories: string[]): (category: string) => string {
  return d3
    .scaleOrdinal()
    .domain(categories)
    .range(d3.schemeSpectral[categories.length])
    .unknown("#ccc") as (category: string) => string;
}

type Category = string;
type ArcDataItemGenerator = d3.Arc<unknown, IDataItem>;
type ArcCategoryGenerator = d3.Arc<unknown, string>;
type ArcLvlGenerator = d3.Arc<unknown, number>;

const fullCircleAngle = Math.PI * 2;

export function RadialBarChart({
  data,
  width = 640,
  height: _height = undefined,
  innerRadius = 90,
  outerPadding = 120,
  categoryPadding = 0.1,
  skillPadding = 0.05,
  arcPercent = 0.8,
  arcStartOffset = 0.1,
  annotationPadding = 10,
  categoryLabelWidth = 100,
  lineThickness = 2,
}: IRadialBarPlotProps) {
  const height = _height ?? width;
  const outerRadius = Math.min(width, height) / 2 - outerPadding;
  const [categoryFocus, setCategoryFocus] = React.useState<string | false>(
    false,
  );
  const maxLvl = d3.max(data, (d) => d.lvl) ?? 0;
  const lvlsArray = Array.from({ length: maxLvl }, (_, k) => k + 1);
  const groupedByCategory = d3.group(data, (d) => d.category);
  const categoryIds = [...d3.union(data.map((d) => d.category)).keys()];
  const sortedCategories = categoryIds.sort();
  const handleSkillSelect = (category: string) => {
    setCategoryFocus((prevCategoryFocus) =>
      prevCategoryFocus === category ? false : category,
    );
  };

  const filteredCategories = categoryFocus ? [categoryFocus] : sortedCategories;

  const filteredData = data.filter((d) =>
    filteredCategories.includes(d.category),
  );

  const color = sortedCategories ? getColor(sortedCategories) : () => "black";

  /* Total angle used by skills. Remaining is left blank */
  const totalArcAngle = fullCircleAngle * arcPercent;

  /* Calculate how many skills proceed each skill item
  This dictates the amount to offset (count * skillPadding) from the start angle
  */
  const skillPaddingCount = filteredCategories.reduce((acc, category) => {
    const count = groupedByCategory.get(category)?.length ?? 0;
    return acc + count;
  }, 0);

  /* Calculate the column widths based on the available width
  shared between the categories and the skills with padding
  included
  */
  const columnAngle =
    (totalArcAngle -
      categoryPadding * (filteredCategories.length - 1) -
      skillPadding * skillPaddingCount) /
    filteredData.length;

  /* Calculate the start angle for each category based on the number of skills
  in each category and the position of previous categories
  */
  const categoryStartAngle = filteredCategories.reduce(
    (acc, category) => [
      ...acc,
      acc[acc.length - 1] +
        ((groupedByCategory.get(category)?.length ?? 0) * columnAngle +
          (groupedByCategory.get(category)?.length ?? 0) * skillPadding +
          categoryPadding),
    ],
    [fullCircleAngle * arcStartOffset],
  );

  /* Convert the category start angles to a map for easy access */
  const categoryStartAngleMap: Record<Category, number> = categoryStartAngle
    .slice(0, -1)
    .reduce((acc, v, i) => ({ ...acc, [filteredCategories[i]]: v }), {});

  const skillAngleStart: Record<string, number> = filteredData.reduce(
    (acc, d) => ({
      ...acc,
      [`${d.category}-${d.skill}`]:
        categoryStartAngleMap[d.category] +
        skillPadding +
        (groupedByCategory
          .get(d.category)
          ?.findIndex((s) => s.skill == d.skill) ?? 0) *
          columnAngle +
        (groupedByCategory
          .get(d.category)
          ?.findIndex((s) => s.skill == d.skill) ?? 0) *
          skillPadding,
    }),
    {},
  );

  const getSkillAngleStart = (d: IDataItem): number =>
    skillAngleStart[`${d.category}-${d.skill}`];

  const y = d3
    .scaleRadial()
    .domain([0, maxLvl])
    .range([innerRadius, outerRadius]);

  const barArc = (d3.arc() as unknown as ArcDataItemGenerator)
    .startAngle((d) => getSkillAngleStart(d))
    .endAngle((d) => getSkillAngleStart(d) + columnAngle)
    .innerRadius(innerRadius + 1)
    .outerRadius((d) => y(d.lvl));

  const barSegmentArc = (d3.arc() as unknown as ArcDataItemGenerator)
    .startAngle((d) => getSkillAngleStart(d))
    .endAngle((d) => getSkillAngleStart(d) + columnAngle)
    .innerRadius((_, lvl: number) => y(lvl - 1) + 1)
    .outerRadius((_, lvl: number) => y(lvl + 0) - 1)
    .padRadius(-1)
    .padAngle(0.01);

  const annotationArc = (d3.arc() as unknown as ArcCategoryGenerator)
    .innerRadius(innerRadius + 5)
    .outerRadius(innerRadius)
    .startAngle((category) => categoryStartAngleMap[category] + skillPadding)
    .endAngle(
      (category) =>
        categoryStartAngleMap[category] +
        columnAngle * (groupedByCategory.get(category)?.length ?? 0) +
        (groupedByCategory.get(category)?.length ?? 0) * skillPadding,
    );

  const catAnnotationPointInner = (categoryId: Category) => {
    const angle = categoryStartAngleMap[categoryId]; // + (columnAngle * categoryData.length) / 2;
    const x = Math.sin(angle);
    const y = -Math.cos(angle);
    return { x, y };
  };

  const catAnnotationPointOuter = (categoryId: Category) => {
    const angle = +categoryStartAngleMap[categoryId]; // + (columnAngle * categoryData.length) / 2;
    const x = Math.sin(angle);
    const y = -Math.cos(angle);
    return { x, y };
  };

  /* Get the point at the top of each skill bar for annotation */
  // const skillAnnotationPoint = (d: IDataItem) => {
  //   const angle = getSkillAngleStart(d) + columnAngle / 2;
  //   const x = Math.sin(angle);
  //   const y = -Math.cos(angle);
  //   return { x, y };
  // };

  const lvlRing = (d3.arc() as unknown as ArcLvlGenerator)
    .innerRadius((lvl) => y(lvl) - 0.5)
    .outerRadius((lvl) => y(lvl) + 0)
    .startAngle(0)
    .endAngle(totalArcAngle + (fullCircleAngle - totalArcAngle) / 2);

  /* React component to render the radial bar chart bars

  Each bar is made up of a path for the bar itself and a path for each segment
  where each segment represents a lvl.

  A path is also created to handle the hover events for each bar
  */
  const createBars = (cat: string, dItems: IDataItem[]) => (
    <g key={cat} fill={color(cat)} className="Bars">
      {dItems.map((d) => (
        <g
          key={`bar ${cat}-${d.skill}`}
          className="barGroup"
          onClick={() => handleSkillSelect(cat)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSkillSelect(cat);
          }}
        >
          <path
            d={barArc(d)!}
            tabIndex={0}
            className="bar"
            fillOpacity={0.0001}
          />
          <path
            d={barArc(d)!}
            className="barOutline"
            fill="none"
            stroke={color(cat)}
            strokeOpacity={0}
          />
          {Array.from({ length: d.lvl }, (_, k) => k + 1).map((lvl) => (
            <path
              key={`bar-segment${cat}-${d.skill}-${lvl}`}
              d={barSegmentArc(d, lvl)!}
              fill={color(cat)}
              className="barSegment"
            />
          ))}
        </g>
      ))}
    </g>
  );

  /* React component to render the radial bar chart */
  const backgroundLvlRings = (cat: string) => (
    <g key={cat}>
      {lvlsArray.map((lvl) => (
        <path
          key={`${cat}-${lvl}`}
          d={lvlRing(lvl)!}
          fill="rgba(127, 127, 127, 0.04)"
          stroke="none"
          strokeWidth={1}
        />
      ))}
    </g>
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const createAnnotation = (cat: string, dItems: IDataItem[]) => (
    <g key={`annotation ${cat}`} fill={color(cat)}>
      <path
        d={annotationArc(cat)!}
        fill={color(cat)}
        stroke="none"
        strokeWidth={lineThickness}
      />
      <line
        x1={catAnnotationPointInner(cat).x * innerRadius}
        y1={catAnnotationPointInner(cat).y * innerRadius}
        x2={catAnnotationPointOuter(cat).x * (outerRadius + annotationPadding)}
        y2={catAnnotationPointOuter(cat).y * (outerRadius + annotationPadding)}
        stroke={color(cat)}
        fill="none"
        strokeWidth={lineThickness}
        opacity={1}
      />
      <line
        x1={catAnnotationPointOuter(cat).x * (outerRadius + annotationPadding)}
        y1={catAnnotationPointOuter(cat).y * (outerRadius + annotationPadding)}
        x2={
          catAnnotationPointOuter(cat).x * (outerRadius + annotationPadding) +
          (catAnnotationPointOuter(cat).x > 0
            ? categoryLabelWidth + 20
            : -categoryLabelWidth - 20)
        }
        y2={catAnnotationPointOuter(cat).y * (outerRadius + annotationPadding)}
        stroke={color(cat)}
        fill="none"
        strokeWidth={lineThickness}
      />
      {/* box around text */}
      <rect
        x={
          (catAnnotationPointOuter(cat).x > 0
            ? 0 - 0
            : -(categoryLabelWidth + 20)) +
          catAnnotationPointOuter(cat).x * (outerRadius + annotationPadding)
        }
        y={
          catAnnotationPointOuter(cat).y * (outerRadius + annotationPadding) -
          (catAnnotationPointOuter(cat).y > 0 ? 0 : 30)
        }
        width={categoryLabelWidth + 20}
        height={30}
        fill={color(cat)}
      />
      <text
        x={
          catAnnotationPointOuter(cat).x * (outerRadius + annotationPadding) +
          (catAnnotationPointOuter(cat).x > 0
            ? categoryLabelWidth + 10
            : -categoryLabelWidth - 10)
        }
        y={
          catAnnotationPointOuter(cat).y * (outerRadius + annotationPadding) +
          (catAnnotationPointOuter(cat).y > 0 ? 20 : -10)
        }
        fill="white"
        fontWeight={700}
        textAnchor={catAnnotationPointOuter(cat).x > 0 ? "end" : "start"}
      >
        {cat}
      </text>

      {/* {dItems.map((d) => (
        <text
          key={`annotation lvl bar ${cat}-${d.skill}`}
          x={skillAnnotationPoint(d).x * y(d.lvl + 0.5)}
          y={skillAnnotationPoint(d).y * y(d.lvl + 0.5)}
          fill="black"
          textAnchor="middle"
        >
          {d.lvl}
        </text>
      ))} */}

      {lvlsArray.map((lvl) => (
        <text
          key={`annotation lvl ${cat}-${lvl}`}
          x={0}
          y={-y(lvl - 0.1)}
          fill="#ccc"
          textAnchor="middle"
          fontSize={10}
        >
          {lvl}
        </text>
      ))}
    </g>
  );

  return (
    <svg
      width={width}
      height={height}
      style={{ border: "1px solid black" }}
      viewBox={`${-width / 2} ${-height / 2} ${width} ${height}`}
    >
      <g>{filteredCategories.map((c) => backgroundLvlRings(c))}</g>
      <g>
        {filteredCategories.map((c) =>
          createBars(c, groupedByCategory.get(c) ?? []),
        )}
      </g>
      <g>
        {filteredCategories.map((c) =>
          createAnnotation(c, groupedByCategory.get(c) ?? []),
        )}
      </g>
    </svg>
  );
}
