import type { Meta, StoryObj } from "@storybook/react";

import { IDataItem } from "../../../lib/data-viz/lib";
import { DataVizSelector } from "../../../lib/data-viz/select-dataviz";

const demodata: IDataItem[] = [
  { skill: "node", category: "Tech Skill", skill_level: 7 },
  { skill: "react", category: "Tech Skill", skill_level: 6 },
  { skill: "Gitf", category: "Tech Skill", skill_level: 5 },
  { skill: "Code", category: "Tech Skill", skill_level: 1 },
  { skill: "Mangroupr", category: "Leadership", skill_level: 2 },
  { skill: "PM", category: "Leadership", skill_level: 1 },
  { skill: "Leader", category: "Leadership", skill_level: 5 },
  {
    skill: "Networking",
    category: "Communication and lots of other things",
    skill_level: 4,
  },
  { skill: "Presenting", category: "Communication", skill_level: 1 },
  { skill: "Writing", category: "Communication", skill_level: 3 },
  { skill: "Design", category: "Tech Skill", skill_level: 4 },
  { skill: "Testing", category: "Tech Skill", skill_level: 5 },
  { skill: "Debugging", category: "Tech Skill", skill_level: 6 },
  { skill: "Mentoring", category: "Leadership", skill_level: 4 },
  { skill: "Planning", category: "Leadership", skill_level: 3 },
  { skill: "Collaboration", category: "Communication", skill_level: 5 },
  { skill: "Documentation", category: "Communication", skill_level: 2 },
  { skill: "Research", category: "Tech Skill", skill_level: 3 },
  { skill: "Analysis", category: "Tech Skill", skill_level: 4 },
];

const generateRandomData = (n: number, categoryCount: number) =>
  Array.from({ length: n }, (_, i) => ({
    skill: `skill-${i}`,
    category: `category-${Math.floor(Math.random() * categoryCount)}`,
    skill_level: Math.floor(Math.random() * 10),
  }));

const meta = {
  title: "DataViz",
  component: DataVizSelector,
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <div style={{ border: "1px solid red" }}>
        <Story />
      </div>
    ),
  ],
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
