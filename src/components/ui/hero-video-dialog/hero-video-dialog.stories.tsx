import type { Meta, StoryObj } from '@storybook/react'
import { HeroVideoDialog } from './hero-video-dialog'

const meta: Meta<typeof HeroVideoDialog> = {
  title: 'UI/HeroVideoDialog',
  component: HeroVideoDialog,
  tags: ['autodocs'],
  argTypes: {
    animationStyle: {
      control: 'select',
      options: [
        'from-bottom',
        'from-center',
        'from-top',
        'from-left',
        'from-right',
        'fade',
        'top-in-bottom-out',
        'left-in-right-out'
      ]
    }
  }
}

export default meta
type Story = StoryObj<typeof HeroVideoDialog>

export const Default: Story = {
  args: {
    videoSrc: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnailSrc: 'https://placehold.co/600x400',
    animationStyle: 'from-center'
  }
}
