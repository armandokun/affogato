import type { Meta, StoryObj } from "@storybook/react";
import { FooterSection } from "./footer-section";

const meta: Meta<typeof FooterSection> = {
  title: "Sections/FooterSection",
  component: FooterSection,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof FooterSection>;

export const Default: Story = {};
