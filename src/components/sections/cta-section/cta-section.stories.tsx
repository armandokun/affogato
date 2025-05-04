import type { Meta, StoryObj } from "@storybook/react";
import { CTASection } from "./cta-section";

const meta: Meta<typeof CTASection> = {
  title: "Sections/CTASection",
  component: CTASection,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof CTASection>;

export const Default: Story = {};
