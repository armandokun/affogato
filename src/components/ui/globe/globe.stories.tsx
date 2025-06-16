import type { Meta, StoryObj } from '@storybook/react'
import { Globe } from './globe'

const meta: Meta<typeof Globe> = {
  title: 'UI/Globe',
  component: Globe,
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof Globe>

export const Default: Story = {}
