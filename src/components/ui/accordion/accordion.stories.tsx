import type { Meta, StoryObj } from "@storybook/react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "./accordion";
import React from "react";

const meta: Meta<typeof Accordion> = {
  title: "UI/Accordion",
  component: Accordion,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Accordion>;

export const Default: Story = {
  render: () => (
    <Accordion type="single" collapsible defaultValue="item-1">
      <AccordionItem value="item-1">
        <AccordionTrigger>What is Storybook?</AccordionTrigger>
        <AccordionContent>
          Storybook is a tool for developing UI components in isolation for
          React, Vue, and Angular.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Why use Storybook?</AccordionTrigger>
        <AccordionContent>
          It helps you build, test, and document components independently from
          your app.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};
