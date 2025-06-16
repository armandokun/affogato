import type { Meta, StoryObj } from '@storybook/react'
import AnimatedGradientBackground from './animated-gradient-background'

const meta: Meta<typeof AnimatedGradientBackground> = {
  title: 'Components/AnimatedGradientBackground',
  component: AnimatedGradientBackground,
  tags: ['autodocs'],
  argTypes: {
    startingGap: { control: 'number' },
    Breathing: { control: 'boolean' },
    animationSpeed: { control: 'number' },
    breathingRange: { control: 'number' },
    topOffset: { control: 'number' }
  },
  args: {
    startingGap: 125,
    Breathing: true,
    animationSpeed: 0.02,
    breathingRange: 5,
    topOffset: 0
  }
}

export default meta
type Story = StoryObj<typeof AnimatedGradientBackground>

export const Default: Story = {}
