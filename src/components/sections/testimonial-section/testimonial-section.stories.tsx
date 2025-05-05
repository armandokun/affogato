import type { Meta, StoryObj } from "@storybook/react";
import TestimonialSection from "./testimonial-section";

const meta: Meta<typeof TestimonialSection> = {
  title: "Sections/TestimonialSection",
  component: TestimonialSection,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof TestimonialSection>;

export const Default: Story = {};
