import { ComponentPropsWithoutRef, CSSProperties } from 'react'

import { cn } from '@/lib/utils'

type Props = ComponentPropsWithoutRef<'span'> & {
  shimmerWidth?: number
}

const AnimatedShinyText = ({ children, className, shimmerWidth = 100, ...props }: Props) => {
  return (
    <span
      style={
        {
          '--shiny-width': `${shimmerWidth}px`
        } as CSSProperties
      }
      className={cn(
        'max-w-md text-neutral-400/70',
        'animate-shiny-text bg-clip-text bg-no-repeat [background-position:0_0] [background-size:var(--shiny-width)_100%] [transition:background-position_1s_cubic-bezier(.6,.6,0,1)_infinite]',
        'bg-gradient-to-r from-transparent via-50% to-transparent via-white/80',
        className
      )}
      {...props}>
      {children}
    </span>
  )
}

export default AnimatedShinyText
