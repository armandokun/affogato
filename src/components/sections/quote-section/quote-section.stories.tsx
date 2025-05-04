import type { Meta, StoryObj } from "@storybook/react";
import { QuoteSection } from "./quote-section";

const meta: Meta<typeof QuoteSection> = {
  title: "Sections/QuoteSection",
  component: QuoteSection,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof QuoteSection>;

export const Default: Story = {};
