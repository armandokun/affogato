import type { Meta, StoryObj } from "@storybook/react";
import LoginPage from "./login-section";

const meta: Meta<typeof LoginPage> = {
  title: "Sections/LoginSection",
  component: LoginPage,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof LoginPage>;

export const Default: Story = {};
