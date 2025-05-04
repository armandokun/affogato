import type { Meta, StoryObj } from "@storybook/react";
import { FourthBentoAnimation } from "./fourth-bento-animation";

const meta: Meta<typeof FourthBentoAnimation> = {
  title: "Components/FourthBentoAnimation",
  component: FourthBentoAnimation,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof FourthBentoAnimation>;

export const Default: Story = {};
