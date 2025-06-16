import type { Meta, StoryObj } from '@storybook/react'
import LoginTestimonialSection from './login-testimonial-section'

const meta: Meta<typeof LoginTestimonialSection> = {
  title: 'Sections/LoginTestimonialSection',
  component: LoginTestimonialSection,
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof LoginTestimonialSection>

export const Default: Story = {}
