import type { Meta, StoryObj } from "@storybook/react";
import { Feature } from "./feature-slideshow";

const meta: Meta<typeof Feature> = {
  title: "UI/Feature",
  component: Feature,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Feature>;

export const Default: Story = {
  args: {
    featureItems: [
      { id: 1, title: "Slide 1", content: "This is the first slide." },
      { id: 2, title: "Slide 2", content: "This is the second slide." },
      { id: 3, title: "Slide 3", content: "This is the third slide." },
    ],
  },
};
