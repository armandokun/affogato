import type { Meta, StoryObj } from '@storybook/react'
import { NavMenu } from './nav-menu'

const meta: Meta<typeof NavMenu> = {
  title: 'Components/NavMenu',
  component: NavMenu,
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof NavMenu>

export const Default: Story = {}
