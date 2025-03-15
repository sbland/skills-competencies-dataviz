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
  arcPercent?: number;
  arcStartOffset?: number;
}

function getColor(categories: string[]): (category: string) => string {
  return d3
    .scaleOrdinal()
    .domain(categories)
    .range(d3.schemeSpectral[categories.length])
    .unknown("#ccc") as (category: string) => string;
}

export function RadialBarChart({
  data,
  width = 640,
  height = undefined,
  innerRadius = 90,
  categoryPadding = 0,
  skillPadding = 0.1,
  arcPercent = 0.8,
  arcStartOffset = 0.1,
}: IRadialBarPlotProps) {
  const _height = height ?? width;
  const _outerRadius = Math.min(width, _height) / 2 - 100;
  const maxVal = d3.max(data, (d) => d.lvl) ?? 0;
  const lvlsArray = Array.from({ length: maxVal }, (v, k) => k + 1);

  const groupedByCategory = d3.group(data, (d) => d.category);

  const categoryIds = [...d3.union(data.map((d) => d.category)).keys()];

  const sortedCategories = categoryIds.sort();
  type Category = (typeof sortedCategories)[number];

  const fullCircleAngle = Math.PI * 2;
  const totalArcAngle = fullCircleAngle * arcPercent;

  const skillPaddingCount = sortedCategories.reduce((acc, category) => {
    const count = (groupedByCategory.get(category)?.length ?? 0) - 1;
    return acc + count;
  }, 0);

  const columnAngle =
    (totalArcAngle -
      categoryPadding * (categoryIds.length - 1) -
      skillPadding * skillPaddingCount) /
    data.length;

  const categoryStartAngle = sortedCategories.reduce(
    (acc, category) => [
      ...acc,
      acc[acc.length - 1] +
        ((groupedByCategory.get(category)?.length ?? 0) * columnAngle +
          ((groupedByCategory.get(category)?.length ?? 0) - 1) * skillPadding +
          categoryPadding),
    ],
    [fullCircleAngle * arcStartOffset],
  );

  const categoryStartAngleMap: Record<Category, number> = categoryStartAngle
    .slice(0, -1)
    .reduce((acc, v, i) => ({ ...acc, [sortedCategories[i]]: v }), {});

  const catAngleStart = (categoryId: Category) =>
    categoryStartAngleMap[categoryId] || 0;

  // const catAngleEnd = (categoryId: Category) =>
  //   catAngleStart(categoryId) +
  //   columnAngle * (groupedByCategory.get(categoryId)?.length ?? 0);

  const skillAngleStart = (categoryId: Category, skillId: string) =>
    catAngleStart(categoryId) +
    (groupedByCategory.get(categoryId)?.findIndex((s) => s.skill == skillId) ??
      0) *
      columnAngle +
    (groupedByCategory.get(categoryId)?.findIndex((s) => s.skill == skillId) ??
      0) *
      skillPadding;

  const y = d3
    .scaleRadial()
    .domain([0, maxVal])
    .range([innerRadius, _outerRadius]);

  const barArc = d3
    .arc()
    .startAngle((d: unknown) =>
      skillAngleStart((d as IDataItem).category, (d as IDataItem).skill),
    )
    .endAngle(
      (d: unknown) =>
        skillAngleStart((d as IDataItem).category, (d as IDataItem).skill) +
        columnAngle,
    )
    .innerRadius(innerRadius + 1)
    .outerRadius((d: unknown) => y((d as IDataItem).lvl));

  const barSegmentArc = d3
    .arc()
    .startAngle((d: unknown) =>
      skillAngleStart((d as IDataItem).category, (d as IDataItem).skill),
    )
    .endAngle(
      (d: unknown) =>
        skillAngleStart((d as IDataItem).category, (d as IDataItem).skill) +
        columnAngle,
    )
    .innerRadius((d, lvl) => y(lvl - 1) + 1)
    .outerRadius((d, lvl) => y(lvl + 0) - 1)
    .padRadius(-1)
    .padAngle(0.01);

  const annotationArc = d3
    .arc()
    .innerRadius(innerRadius - 5)
    .outerRadius(innerRadius)
    .startAngle((categoryId) => catAngleStart(categoryId) - 0.04)
    .endAngle(
      (categoryId) =>
        0.04 +
        catAngleStart(categoryId) +
        columnAngle * (groupedByCategory.get(categoryId)?.length ?? 0) +
        ((groupedByCategory.get(categoryId)?.length ?? 0) - 2) * skillPadding,
    );

  const catAnnotationPointInner = (categoryId: Category) => {
    const angle = catAngleStart(categoryId) - columnAngle / 2; // + (columnAngle * categoryData.length) / 2;
    const x = Math.sin(angle);
    const y = -Math.cos(angle);
    return { x, y };
  };

  const catAnnotationPointOuter = (categoryId: Category) => {
    const angle = -skillPadding + catAngleStart(categoryId) - columnAngle * 0.1; // + (columnAngle * categoryData.length) / 2;
    const x = Math.sin(angle);
    const y = -Math.cos(angle);
    return { x, y };
  };

  const skillAnnotationPoint = (categoryId: Category, skillId: string) => {
    const angle = skillAngleStart(categoryId, skillId) + columnAngle / 2;
    const x = Math.sin(angle);
    const y = -Math.cos(angle);
    return { x, y };
  };

  const getBarArc = (d: IDataItem) =>
    barArc(d as unknown as d3.DefaultArcObject);

  const color = getColor(sortedCategories);

  const ring = d3
    .arc()
    .innerRadius((lvl) => y(lvl) - 1)
    .outerRadius((lvl) => y(lvl) + 1)
    .startAngle(0)
    .endAngle(totalArcAngle + (fullCircleAngle - totalArcAngle) / 2);

  /* React component to render the radial bar chart */
  const createBars = (cat: string, dItems: IDataItem[]) => (
    <g
      key={cat}
      fill={color(cat)}
      className="categoryGroupBars"
      data-category={cat}
    >
      {dItems.map((d) => (
        <g key={`bar ${cat}-${d.skill}`} className="barGroup">
          <path
            data-key={`${cat}-${d.skill}`}
            d={getBarArc(d) ?? ""}
            tabIndex={0}
            className="bar"
            fillOpacity={0.0001}
          />
          <path
            data-key={`${cat}-${d.skill}`}
            d={getBarArc(d) ?? ""}
            className="barOutline"
            fill="none"
            stroke={color(cat)}
            strokeOpacity={0}
          />
          {Array.from({ length: d.lvl }, (v, k) => k + 1).map((lvl) => (
            <path
              key={`bar segment${cat}-${d.skill}`}
              data-key={`${cat}-${d.skill}`}
              d={barSegmentArc(d, lvl) ?? ""}
              fill={color(cat)}
              className="barSegment"
            />
          ))}
        </g>
      ))}
    </g>
  );
  /* React component to render the radial bar chart */
  const createBackground = (cat: string, dItems: IDataItem[]) => (
    <g
      key={cat}
      fill={color(cat)}
      className="categoryGroup"
      data-category={cat}
    >
      {lvlsArray.map((lvl) => (
        <path
          key={`${cat}-${lvl}`}
          data-key={`${cat}-${lvl}`}
          d={ring(lvl)}
          fill="rgba(0,0,0,0.008)"
          stroke="none"
          strokeWidth={1}
        />
      ))}
    </g>
  );
  const annotationPadding = 10;
  const lineColor = "#ccc";
  const createAnnotation = (cat: string, dItems: IDataItem[]) => (
    <g
      key={`annotation ${cat}`}
      fill={color(cat)}
      className="categoryGroup"
      data-category={cat}
    >
      <path
        d={annotationArc(cat)}
        fill={lineColor}
        stroke="none"
        strokeWidth={1}
      />
      <line
        x1={catAnnotationPointInner(cat).x * innerRadius * 0.93}
        y1={catAnnotationPointInner(cat).y * innerRadius * 0.93}
        x2={catAnnotationPointOuter(cat).x * (_outerRadius + annotationPadding)}
        y2={catAnnotationPointOuter(cat).y * (_outerRadius + annotationPadding)}
        stroke={lineColor}
        fill="none"
        strokeWidth={5}
        opacity={1}
      />
      <line
        x1={catAnnotationPointOuter(cat).x * (_outerRadius + annotationPadding)}
        y1={catAnnotationPointOuter(cat).y * (_outerRadius + annotationPadding)}
        x2={
          catAnnotationPointOuter(cat).x * (_outerRadius + annotationPadding) +
          (catAnnotationPointOuter(cat).x > 0 ? 100 : -100)
        }
        y2={catAnnotationPointOuter(cat).y * (_outerRadius + annotationPadding)}
        stroke={lineColor}
        fill="none"
        strokeWidth={5}
      />
      <text
        x={
          catAnnotationPointOuter(cat).x * (_outerRadius + annotationPadding) +
          (catAnnotationPointOuter(cat).x > 0 ? 100 : -100)
        }
        y={
          catAnnotationPointOuter(cat).y * (_outerRadius + annotationPadding) -
          5
        }
        fill="black"
        textAnchor={catAnnotationPointOuter(cat).x > 0 ? "end" : "start"}
      >
        {cat}
      </text>

      {dItems.map((d) => (
        <text
          key={`annotation lvl bar ${cat}-${d.skill}`}
          data-key={`${cat}-${d.skill}`}
          x={skillAnnotationPoint(cat, d.skill).x * y(d.lvl + 0.5)}
          y={skillAnnotationPoint(cat, d.skill).y * y(d.lvl + 0.5)}
          fill="black"
          textAnchor="middle"
        >
          {d.lvl}
        </text>
      ))}

      {lvlsArray.map((lvl) => (
        <text
          key={`annotation lvl ${cat}-${lvl}`}
          x={0}
          y={-y(lvl-0.1)}
          fill="black"
          textAnchor="middle"
          fontSize={10}
        >
          {lvl}
        </text>
      ))}
    </g>
  );
  /* React component to render the radial bar chart */
  const createForeground = (cat: string, dItems: IDataItem[]) => (
    <g
      key={cat}
      fill={color(cat)}
      className="categoryGroup"
      data-category={cat}
    >
      <g>
        {lvlsArray.map((lvl) => (
          <path
            key={`${cat}-${lvl}`}
            data-key={`${cat}-${lvl}`}
            d={ring(lvl)}
            fill="white"
            stroke="#fff"
            strokeWidth={1}
          />
        ))}
      </g>
    </g>
  );

  return (
    <svg
      width={width}
      height={_height}
      style={{ border: "1px solid black" }}
      viewBox={`${-width / 2} ${-_height / 2} ${width} ${_height}`}
    >
      <g>
        {sortedCategories.map((c) =>
          createBackground(c, groupedByCategory.get(c) ?? []),
        )}
      </g>
      <g>
        {sortedCategories.map((c) =>
          createBars(c, groupedByCategory.get(c) ?? []),
        )}
      </g>
      {/* <g>
        {sortedCategories.map((c) =>
          createForeground(c, groupedByCategory.get(c) ?? []),
        )}
      </g> */}
      <g>
        {sortedCategories.map((c) =>
          createAnnotation(c, groupedByCategory.get(c) ?? []),
        )}
      </g>
    </svg>
  );
}
