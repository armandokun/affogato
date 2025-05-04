import type { Meta, StoryObj } from "@storybook/react";
import { BentoSection } from "./bento-section";

const meta: Meta<typeof BentoSection> = {
  title: "Sections/BentoSection",
  component: BentoSection,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof BentoSection>;

export const Default: Story = {};
