import type { Meta, StoryObj } from "@storybook/react";
import { CompanyShowcase } from "./company-showcase";

const meta: Meta<typeof CompanyShowcase> = {
  title: "Sections/CompanyShowcase",
  component: CompanyShowcase,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof CompanyShowcase>;

export const Default: Story = {};
