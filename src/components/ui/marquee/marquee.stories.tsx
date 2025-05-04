import type { Meta, StoryObj } from "@storybook/react";
import { Marquee } from "./marquee";

const meta: Meta<typeof Marquee> = {
  title: "UI/Marquee",
  component: Marquee,
  tags: ["autodocs"],
  argTypes: {
    reverse: { control: "boolean" },
    pauseOnHover: { control: "boolean" },
    vertical: { control: "boolean" },
    repeat: { control: "number" },
    children: { control: "text" },
  },
  args: {
    children: "🚀 Storybook Marquee Example",
  },
};

export default meta;
type Story = StoryObj<typeof Marquee>;

export const Default: Story = {};
export const Vertical: Story = {
  args: { vertical: true, children: "⬆️ Vertical Marquee Example" },
};
export const PauseOnHover: Story = {
  args: { pauseOnHover: true, children: "⏸️ Pauses on Hover" },
};
export const Reverse: Story = {
  args: { reverse: true, children: "↔️ Reversed Direction" },
};
