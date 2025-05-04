import type { Meta, StoryObj } from "@storybook/react";
import Markdown from "./markdown";

const meta: Meta<typeof Markdown> = {
  title: "UI/Markdown",
  component: Markdown,
  tags: ["autodocs"],
  argTypes: {
    children: { control: "text" },
  },
  args: {
    children:
      "# Hello, Storybook!\nThis is **markdown** rendered in a component.",
  },
};

export default meta;
type Story = StoryObj<typeof Markdown>;

export const Default: Story = {};
