import type { Meta, StoryObj } from "@storybook/react";

import { RadialBarChart, IDataItem } from "../../../lib/data-viz/radial-plot";


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
];


const meta = {
  title: "DataViz/RadialPlot",
  component: RadialBarChart,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof RadialBarChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    data: demodata,
  },
};
