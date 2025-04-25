import type { Meta, StoryObj } from "@storybook/react";

import { RadialBarChart } from "../../../lib/data-viz/radial-plot";
import { IDataItem } from "../../../lib/data-viz/lib";

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

const meta = {
  title: "DataViz/RadialPlot",
  component: RadialBarChart,
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
} satisfies Meta<typeof RadialBarChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    data: demodata,
  },
};
