import type { Meta, StoryObj } from '@storybook/react'
import OrbitingCircles from './orbiting-circle'

const meta: Meta<typeof OrbitingCircles> = {
  title: 'UI/OrbitingCircles',
  component: OrbitingCircles,
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof OrbitingCircles>

export const Default: Story = {
  render: () => (
    <div style={{ position: 'relative', width: 400, height: 400 }}>
      <OrbitingCircles>
        <span role="img" aria-label="star">
          ⭐️
        </span>
        <span role="img" aria-label="rocket">
          🚀
        </span>
        <span role="img" aria-label="planet">
          🪐
        </span>
        <span role="img" aria-label="moon">
          🌙
        </span>
      </OrbitingCircles>
    </div>
  )
}
