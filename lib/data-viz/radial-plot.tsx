import * as d3 from "d3";

export interface IDataItem {
  skill: string;
  category: string;
  lvl: number;
}
const categoryAxisLabelsHeight = 30;

export interface IBarPlotProps {
  data: IDataItem[];
  width?: number;
  height?: number;
  categoryPadding?: number;
  skillPadding?: number;
  innerRadius?: number;
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
  innerRadius = 180,
  categoryPadding = 0,
  skillPadding = 0.1,
}: IBarPlotProps) {
  const _height = height ?? width;
  const _outerRadius = Math.min(width, _height) / 2 - 40;
  const maxVal = d3.max(data, (d) => d.lvl) ?? 0;

  const groupedByCategory = d3.group(data, (d) => d.category);

  const categoryIds = [...d3.union(data.map((d) => d.category)).keys()];

  const sortedCategories = categoryIds.sort();
  type Category = (typeof sortedCategories)[number];

  // const sortedSkills = d3.sort(data, (D) => `${D.category}-${D.skill}`).map((d) => d.skill);
  // const sortedSkills = d3
  //   .sort(data, (D) => `${D.category}`)
  //   .map((d) => d.skill);
  // console.info(sortedSkills);

  const totalArcAngle = Math.PI * 2;

  const skillPaddingCount = sortedCategories.reduce((acc, category) => {
    const count = (groupedByCategory.get(category)?.length ?? 0) - 1;
    return acc + count;
  }, 0);

  const columnAngle =
    (totalArcAngle -
      categoryPadding * categoryIds.length -
      skillPadding * skillPaddingCount) /
    data.length;

  const categoryStartAngle = sortedCategories.reduce(
    (acc, category) => [
      ...acc,
      acc[acc.length - 1] +
        (groupedByCategory.get(category)?.length ?? 0) * columnAngle +
        ((groupedByCategory.get(category)?.length ?? 0) - 1) * skillPadding +
        categoryPadding,
    ],
    [0],
  );

  const categoryStartAngleMap: Record<Category, number> = categoryStartAngle
    .slice(0, -1)
    .reduce((acc, v, i) => ({ ...acc, [sortedCategories[i]]: v }), {});

  const catAngleStart = (categoryId: Category) =>
    categoryStartAngleMap[categoryId] || 0;

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

  const arc = d3
    .arc()
    .innerRadius(innerRadius)
    .outerRadius((d: unknown) => y((d as IDataItem).lvl))
    .startAngle((d: unknown) =>
      skillAngleStart((d as IDataItem).category, (d as IDataItem).skill),
    )
    .endAngle(
      (d: unknown) =>
        skillAngleStart((d as IDataItem).category, (d as IDataItem).skill) +
        columnAngle,
    )
    .padAngle(1.5 / innerRadius)
    .padRadius(innerRadius);

  const getArc = (d: IDataItem) => arc(d as unknown as d3.DefaultArcObject);

  const color = getColor(sortedCategories);

  /* React component to render the radial bar chart */
  const createAxisNode = (cat: string, dItems: IDataItem[]) => (
    <g
      key={cat}
      fill={color(cat)}
      className="categoryGroup"
      data-category={cat}
    >
      {dItems.map((d) => (
        <path
          key={`${cat}-${d.skill}`}
          data-key={`${cat}-${d.skill}`}
          d={getArc(d) ?? ""}
        />
      ))}
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
          createAxisNode(c, groupedByCategory.get(c) ?? []),
        )}
      </g>
    </svg>
  );
}
