import type { Meta, StoryObj } from "@storybook/react";

import { BarPlot } from "../../../lib/data-viz/bar-plot";
import { IDataItem } from "../../../lib/data-viz/lib";

const demodata: IDataItem[] = [
  { skill: "node", category: "Tech Skill", skill_level: 7 },
  { skill: "react", category: "Tech Skill", skill_level: 6 },
  { skill: "Gitf", category: "Tech Skill", skill_level: 5 },
  { skill: "Code", category: "Tech Skill", skill_level: 1 },
  { skill: "Mangroupr", category: "Leadership", skill_level: 2 },
  { skill: "PM", category: "Leadership", skill_level: 1 },
  { skill: "Leader", category: "Leadership", skill_level: 5 },
  { skill: "Networking", category: "Communication", skill_level: 4 },
  { skill: "Presenting", category: "Communication", skill_level: 1 },
];

const meta = {
  title: "DataViz/BarPlot",
  component: BarPlot,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof BarPlot>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    data: demodata,
  },
};
