import type { Meta, StoryObj } from "@storybook/react";

import { ExampleReactComponent } from "../../lib/example-component";

const meta = {
  title: "Example/ExampleReactComponent",
  component: ExampleReactComponent,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof ExampleReactComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
