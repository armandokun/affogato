import type { Meta, StoryObj } from '@storybook/react'
import Icons from './icons'
import React from 'react'

const iconEntries = Object.entries(Icons)

const meta: Meta = {
  title: 'Components/Icons',
  tags: ['autodocs']
}

export default meta

type Story = StoryObj

export const AllIcons: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
        gap: 24
      }}>
      {iconEntries.map(([name, Icon]) => (
        <div
          key={name}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8
          }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>
            <Icon />
          </div>
          <span
            style={{
              fontSize: 12,
              color: '#666',
              wordBreak: 'break-all',
              textAlign: 'center'
            }}>
            {name}
          </span>
        </div>
      ))}
    </div>
  )
}
