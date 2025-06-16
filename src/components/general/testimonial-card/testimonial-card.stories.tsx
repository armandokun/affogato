import type { Meta, StoryObj } from '@storybook/react'
import TestimonialCard from './testimonial-card'

const meta: Meta<typeof TestimonialCard> = {
  title: 'Components/TestimonialCard',
  component: TestimonialCard,
  tags: ['autodocs'],
  argTypes: {
    avatarUrl: { control: 'text' },
    name: { control: 'text' },
    role: { control: 'text' },
    children: { control: 'text' }
  },
  args: {
    avatarUrl: 'https://github.com/shadcn.png',
    name: 'Ada Lovelace',
    role: 'CEO, The First Computer Company',
    children:
      '“That guy with his lava lamp inspired designs... Where are you going to put them next??”'
  }
}

export default meta
type Story = StoryObj<typeof TestimonialCard>

export const Default: Story = {}
