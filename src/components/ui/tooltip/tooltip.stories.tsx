import React from 'react'
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from './tooltip'
import Button from '../button'

const meta = {
  title: 'UI/Tooltip',
  component: Tooltip
}

export default meta

export const Basic = () => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <Button>Hover me</Button>
      </TooltipTrigger>
      <TooltipContent>Tooltip text</TooltipContent>
    </Tooltip>
  </TooltipProvider>
)

export const CustomContent = () => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <Button>Hover for custom</Button>
      </TooltipTrigger>
      <TooltipContent>
        <div>
          <strong>Custom</strong> <em>content</em>
        </div>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
)
