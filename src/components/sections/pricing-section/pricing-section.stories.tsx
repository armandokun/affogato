import type { Meta, StoryObj } from "@storybook/react";
import { PricingSection } from "./pricing-section";

const meta: Meta<typeof PricingSection> = {
  title: "Sections/PricingSection",
  component: PricingSection,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof PricingSection>;

export const Default: Story = {};
