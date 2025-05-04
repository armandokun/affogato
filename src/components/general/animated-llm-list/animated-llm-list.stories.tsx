import type { Meta, StoryObj } from "@storybook/react";
import AnimatedLlmList from "./animated-llm-list";

const meta: Meta<typeof AnimatedLlmList> = {
  title: "Components/AnimatedLlmList",
  component: AnimatedLlmList,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof AnimatedLlmList>;

export const Default: Story = {};
