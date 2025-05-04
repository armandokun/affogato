import type { Meta, StoryObj } from "@storybook/react";
import { FirstBentoAnimation } from "./first-bento-animation";

const meta: Meta<typeof FirstBentoAnimation> = {
  title: "Components/FirstBentoAnimation",
  component: FirstBentoAnimation,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof FirstBentoAnimation>;

export const Default: Story = {};
