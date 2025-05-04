import type { Meta, StoryObj } from "@storybook/react";
import { ThirdBentoAnimation } from "./third-bento-animation";

const meta: Meta<typeof ThirdBentoAnimation> = {
  title: "Components/ThirdBentoAnimation",
  component: ThirdBentoAnimation,
  tags: ["autodocs"],
  argTypes: {
    color: { control: "color" },
  },
  args: {
    data: [10, 20, 30, 25, 40, 35, 50],
    toolTipValues: [10, 20, 30, 25, 40, 35, 50],
    color: "#2979FF",
    startAnimationDelay: 0,
    once: false,
  },
};

export default meta;
type Story = StoryObj<typeof ThirdBentoAnimation>;

export const Default: Story = {};
