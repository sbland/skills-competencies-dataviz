import { DataVizSelector } from "../lib/data-viz/select-dataviz";

const generateRandomData = (n: number, categoryCount: number) =>
  Array.from({ length: n }, (_, i) => ({
    skill: `skill-${i}`,
    category: `category-${Math.floor(Math.random() * categoryCount)}`,
    lvl: Math.floor(Math.random() * 10),
  }));

export const DemoComponent = () => {
  const data = generateRandomData(40, 8);
  return <DataVizSelector data={data} />;
};
