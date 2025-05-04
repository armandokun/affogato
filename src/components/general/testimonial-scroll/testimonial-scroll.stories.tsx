import type { Meta, StoryObj } from "@storybook/react";
import { SocialProofTestimonials } from "./testimonial-scroll";

const meta: Meta<typeof SocialProofTestimonials> = {
  title: "Components/SocialProofTestimonials",
  component: SocialProofTestimonials,
  tags: ["autodocs"],
  args: {
    testimonials: [
      {
        id: "1",
        name: "Ada Lovelace",
        role: "Mathematician",
        img: "https://github.com/shadcn.png",
        description:
          "The Analytical Engine weaves algebraic patterns just as the Jacquard loom weaves flowers and leaves.",
      },
      {
        id: "2",
        name: "Alan Turing",
        role: "Computer Scientist",
        img: "https://randomuser.me/api/portraits/men/1.jpg",
        description:
          "We can only see a short distance ahead, but we can see plenty there that needs to be done.",
      },
      {
        id: "3",
        name: "Grace Hopper",
        role: "Rear Admiral",
        img: "https://randomuser.me/api/portraits/women/2.jpg",
        description:
          'The most dangerous phrase in the language is, "We\'ve always done it this way."',
      },
    ],
  },
};

export default meta;
type Story = StoryObj<typeof SocialProofTestimonials>;

export const Default: Story = {};
