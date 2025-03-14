import * as d3 from "d3";

export interface IBarPlotProps {
  data: number[];
  width?: number;
  height?: number;
  marginTop?: number;
  marginRight?: number;
  marginBottom?: number;
  marginLeft?: number;

}

export function BarPlot({
  data,
  width = 640,
  height = 400,
  marginTop = 20,
  marginRight = 20,
  marginBottom = 20,
  marginLeft = 20,
}: IBarPlotProps) {
  const domainX = [0, data.length - 1];
  const rangeX = [marginLeft, width - marginRight];

  const x = d3.scaleLinear(
    domainX,
    rangeX,
  );
  const y = d3.scaleLinear(d3.extent(data) as [number, number], [height - marginBottom, marginTop]);
  const line = d3.line((_, i) => x(i), y);
  return (
    <svg width={width} height={height}>
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        d={line(data) ?? undefined}
      />
      <g fill="white" stroke="currentColor" strokeWidth="1.5">
        {data.map((d, i) => (
          <circle key={`${d.toString()}-${i.toString()}`} cx={x(i)} cy={y(d)} r="2.5" />
        ))}
      </g>
    </svg>
  );
}
