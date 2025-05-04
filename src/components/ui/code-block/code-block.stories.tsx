import type { Meta, StoryObj } from "@storybook/react";
import { CodeBlockCode } from "./code-block";

const meta: Meta<typeof CodeBlockCode> = {
  title: "UI/CodeBlockCode",
  component: CodeBlockCode,
  tags: ["autodocs"],
  argTypes: {
    code: { control: "text" },
    language: { control: "text" },
    theme: { control: "text" },
  },
  args: {
    code: 'console.log("Hello, Storybook!");',
    language: "js",
    theme: "github-light",
  },
};

export default meta;
type Story = StoryObj<typeof CodeBlockCode>;

export const Default: Story = {};
