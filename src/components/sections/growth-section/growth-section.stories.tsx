import type { Meta, StoryObj } from "@storybook/react";
import { GrowthSection } from "./growth-section";

const meta: Meta<typeof GrowthSection> = {
  title: "Sections/GrowthSection",
  component: GrowthSection,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof GrowthSection>;

export const Default: Story = {};
