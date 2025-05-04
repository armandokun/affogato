import type { Meta, StoryObj } from "@storybook/react";
import { FeatureSection } from "./feature-section";

const meta: Meta<typeof FeatureSection> = {
  title: "Sections/FeatureSection",
  component: FeatureSection,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof FeatureSection>;

export const Default: Story = {};
