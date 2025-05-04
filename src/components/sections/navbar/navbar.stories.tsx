import type { Meta, StoryObj } from "@storybook/react";
import Navbar from "./navbar";

const meta: Meta<typeof Navbar> = {
  title: "Sections/Navbar",
  component: Navbar,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Navbar>;

export const Default: Story = {};
