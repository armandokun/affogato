import type { Meta, StoryObj } from "@storybook/react";
import { FAQSection } from "./faq-section";

const meta: Meta<typeof FAQSection> = {
  title: "Sections/FAQSection",
  component: FAQSection,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof FAQSection>;

export const Default: Story = {};
