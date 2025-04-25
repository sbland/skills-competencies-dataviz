import { useState } from "react";
import * as d3 from "d3";
import "../styles.css";
import { IDataItem } from "../lib";
import { IRadialBarPlotProps } from "./lib";
import { getColor, radialBarChartPreProcessing } from "./data-processing";

export function RadialBarChart({
  data,
  width = 640,
  height: _height = undefined,
  innerRadius = 80,
  outerPadding = 100,
  categoryPadding = 0.1,
  skillPadding = 0.05,
  arcPercent = 0.8,
  arcStartOffset = 0.1,
  annotationPadding = 10,
  lineThickness = 2,
  labelTextColor = "black",
  lvlTextColor = "#ccc",
  lvlArcColor = "#444",
  colourList = d3.schemeAccent,
}: IRadialBarPlotProps) {
  const height = _height ?? width * 0.8; // Width needs to be larger than height to fit cat labels
  const [categoryFocus, setCategoryFocus] = useState<string | false>(false);
  const [highlightedSkill, setHighlightedSkill] = useState<IDataItem | false>(
    false,
  );
  const handleSkillSelect = (category: string) => {
    setCategoryFocus((prevCategoryFocus) =>
      prevCategoryFocus === category ? false : category,
    );
  };

  const {
    sortedCategories,
    filteredCategories,
    groupedByCategory,
    catAnnotationPointInner,
    catAnnotationPointOuter,
    barFullHeightArc,
    barSegmentArc,
    categoryBaseArc,
    lvlRing,
    lvlsArray,
    outerRadius,
    getYPoint,
  } = radialBarChartPreProcessing({
    data,
    width,
    height,
    innerRadius,
    outerPadding,
    categoryPadding,
    skillPadding,
    arcPercent,
    arcStartOffset,
    categoryFocus,
  });

  const color = sortedCategories
    ? getColor(sortedCategories, colourList)
    : () => "black";

  /* React component to render the radial bar chart bars

  Each bar is made up of a path for the bar itself and a path for each segment
  where each segment represents a lvl.

  A path is also created to handle the hover events for each bar
  */
  const renderBars = (cat: string, dItems: IDataItem[]) => (
    <g key={cat} fill={color(cat)} className="Bars">
      {dItems.map((d) => (
        <g
          key={`bar ${cat}-${d.skill}`}
          className="bar-group"
          onClick={() => handleSkillSelect(cat)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSkillSelect(cat);
          }}
          onMouseOver={() => setHighlightedSkill(d)}
          onMouseOut={() => setHighlightedSkill(false)}
          onFocus={() => setHighlightedSkill(d)}
          onBlur={() => setHighlightedSkill(false)}
        >
          <path
            d={barFullHeightArc(d)!}
            tabIndex={0}
            className="bar"
            fillOpacity={0.0001}
          />
          <path
            d={barFullHeightArc(d)!}
            className="bar-outline"
            fill="none"
            stroke={color(cat)}
            strokeOpacity={0}
          />
          {Array.from({ length: d.lvl }, (_, k) => k + 1).map((lvl) => (
            <path
              key={`bar-segment${cat}-${d.skill}-${lvl}`}
              d={barSegmentArc(d, lvl)!}
              fill={color(cat)}
              className="bar-segment"
            />
          ))}
        </g>
      ))}
    </g>
  );

  /* React component to render the rings indicating each level */
  const backgroundLvlRings = (cat: string) => (
    <g key={cat}>
      {lvlsArray.map((lvl) => (
        <path
          key={`${cat}-${lvl}`}
          d={lvlRing(lvl)!}
          fill={lvlArcColor}
          stroke="none"
          strokeWidth={1}
        />
      ))}
    </g>
  );

  const getCatLabelWidth = (cat: string) => {
    return cat.length * 10;
  };

  /* React component to render the annotations for each category
  Each annotation consists of a path for the arc, a line to the outer radius,
  a line to the label, a box around the label and the label itself.
  The label is positioned at the outer radius and is centered on the line
  */
  const renderAnnotations = (cat: string) => (
    <g key={`annotation ${cat}`} fill={color(cat)}>
      {/* Arc at base of category */}
      <path
        d={categoryBaseArc(cat)!}
        fill={color(cat)}
        stroke="none"
        strokeWidth={lineThickness}
      />
      {/* Line from base of category to annotation label */}
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
      {/* Line beneath category label */}
      <line
        x1={catAnnotationPointOuter(cat).x * (outerRadius + annotationPadding)}
        y1={catAnnotationPointOuter(cat).y * (outerRadius + annotationPadding)}
        x2={
          catAnnotationPointOuter(cat).x * (outerRadius + annotationPadding) +
          (catAnnotationPointOuter(cat).x > 0
            ? getCatLabelWidth(cat)
            : -getCatLabelWidth(cat))
        }
        y2={catAnnotationPointOuter(cat).y * (outerRadius + annotationPadding)}
        stroke={color(cat)}
        fill="none"
        strokeWidth={lineThickness}
      />
      {/* Category label text box */}
      <rect
        x={
          (catAnnotationPointOuter(cat).x > 0
            ? 0 - 0
            : -getCatLabelWidth(cat)) +
          catAnnotationPointOuter(cat).x * (outerRadius + annotationPadding)
        }
        y={
          catAnnotationPointOuter(cat).y * (outerRadius + annotationPadding) -
          (catAnnotationPointOuter(cat).y > 0 ? 0 : 30)
        }
        width={getCatLabelWidth(cat)}
        height={30}
        fill={color(cat)}
      />
      {/* Category label text */}
      <text
        x={
          catAnnotationPointOuter(cat).x * (outerRadius + annotationPadding) +
          (catAnnotationPointOuter(cat).x > 0
            ? getCatLabelWidth(cat) / 2
            : -getCatLabelWidth(cat) / 2)
        }
        y={
          catAnnotationPointOuter(cat).y * (outerRadius + annotationPadding) +
          (catAnnotationPointOuter(cat).y > 0 ? 20 : -10)
        }
        fill={labelTextColor}
        fontWeight={700}
        textAnchor="middle"
      >
        {cat}
      </text>
      {/* Category lvl annotations */}
      {lvlsArray.map((lvl) => (
        <text
          key={`annotation lvl ${cat}-${lvl}`}
          x={0}
          y={-getYPoint(lvl - 0.1)}
          fill={lvlTextColor}
          textAnchor="middle"
          fontSize={10}
        >
          {lvl}
        </text>
      ))}
    </g>
  );

  const renderSkillHighlight = () => {
    return highlightedSkill ? (
      <g>
        {/* Renders a circle */}
        <circle
          cx={0}
          cy={0}
          r={innerRadius - 10}
          fill={color(highlightedSkill.category)}
        />

        <text y="-5" textAnchor="middle">
          {highlightedSkill.category}
        </text>
        <text y="15" textAnchor="middle">
          {highlightedSkill.skill}
        </text>
        <text y="35" textAnchor="middle">
          {highlightedSkill.lvl}
        </text>
      </g>
    ) : null;
  };

  return (
    <svg
      width={width}
      height={height}
      viewBox={`${-width / 2} ${-height / 2} ${width} ${height}`}
    >
      <g>{filteredCategories.map((c) => backgroundLvlRings(c))}</g>
      <g>
        {filteredCategories.map((c) =>
          renderBars(c, groupedByCategory.get(c) ?? []),
        )}
      </g>
      <g>{filteredCategories.map((c) => renderAnnotations(c))}</g>
      <g>{renderSkillHighlight()}</g>
    </svg>
  );
}
