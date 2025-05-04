import type { Meta, StoryObj } from "@storybook/react";
import { HeroVideoSection } from "./hero-video-section";

const meta: Meta<typeof HeroVideoSection> = {
  title: "Sections/HeroVideoSection",
  component: HeroVideoSection,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof HeroVideoSection>;

export const Default: Story = {};
