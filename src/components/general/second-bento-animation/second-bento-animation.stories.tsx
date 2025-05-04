import type { Meta, StoryObj } from "@storybook/react";
import { SecondBentoAnimation } from "./second-bento-animation";

const meta: Meta<typeof SecondBentoAnimation> = {
  title: "Components/SecondBentoAnimation",
  component: SecondBentoAnimation,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof SecondBentoAnimation>;

export const Default: Story = {};
