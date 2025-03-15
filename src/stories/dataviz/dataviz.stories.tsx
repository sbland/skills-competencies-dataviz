import type { Meta, StoryObj } from "@storybook/react";

import { IDataItem } from "../../../lib/data-viz/lib";
import { DataVizSelector } from "../../../lib/data-viz/select-dataviz";

const demodata: IDataItem[] = [
  { skill: "node", category: "Tech Skill", lvl: 7 },
  { skill: "react", category: "Tech Skill", lvl: 6 },
  { skill: "Gitf", category: "Tech Skill", lvl: 5 },
  { skill: "Code", category: "Tech Skill", lvl: 1 },
  { skill: "Mangroupr", category: "Leadership", lvl: 2 },
  { skill: "PM", category: "Leadership", lvl: 1 },
  { skill: "Leader", category: "Leadership", lvl: 5 },
  { skill: "Networking", category: "Communication", lvl: 4 },
  { skill: "Presenting", category: "Communication", lvl: 1 },
  { skill: "Writing", category: "Communication", lvl: 3 },
  { skill: "Design", category: "Tech Skill", lvl: 4 },
  { skill: "Testing", category: "Tech Skill", lvl: 5 },
  { skill: "Debugging", category: "Tech Skill", lvl: 6 },
  { skill: "Mentoring", category: "Leadership", lvl: 4 },
  { skill: "Planning", category: "Leadership", lvl: 3 },
  { skill: "Collaboration", category: "Communication", lvl: 5 },
  { skill: "Documentation", category: "Communication", lvl: 2 },
  { skill: "Research", category: "Tech Skill", lvl: 3 },
  { skill: "Analysis", category: "Tech Skill", lvl: 4 },
];

const generateRandomData = (n: number, categoryCount: number) =>
  Array.from({ length: n }, (_, i) => ({
    skill: `skill-${i}`,
    category: `category-${Math.floor(Math.random() * categoryCount)}`,
    lvl: Math.floor(Math.random() * 10),
  }));

const meta = {
  title: "DataViz",
  component: DataVizSelector,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof DataVizSelector>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    data: demodata,
  },
};

export const RandomData: Story = {
  args: {
    data: generateRandomData(40, 8),
  },
};
