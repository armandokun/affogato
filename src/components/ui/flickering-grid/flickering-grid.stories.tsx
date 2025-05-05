import type { Meta, StoryObj } from "@storybook/react";
import FlickeringGrid from "./flickering-grid";

const meta: Meta<typeof FlickeringGrid> = {
  title: "UI/FlickeringGrid",
  component: FlickeringGrid,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof FlickeringGrid>;

export const Default: Story = {};
