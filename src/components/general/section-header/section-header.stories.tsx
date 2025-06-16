import type { Meta, StoryObj } from '@storybook/react'
import { SectionHeader } from './section-header'

const meta: Meta<typeof SectionHeader> = {
  title: 'Components/SectionHeader',
  component: SectionHeader,
  tags: ['autodocs'],
  args: {
    children: (
      <>
        <h2>Section Title</h2>
        <p>This is a section description for Storybook.</p>
      </>
    )
  }
}

export default meta
type Story = StoryObj<typeof SectionHeader>

export const Default: Story = {}
