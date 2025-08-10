import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const chipVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline'
      },
      size: {
        default: 'h-8 px-3 py-1.5',
        sm: 'h-6 px-2 py-1 text-xs',
        lg: 'h-10 px-4 py-2'
      }
    },
    defaultVariants: {
      variant: 'outline',
      size: 'default'
    }
  }
)

export interface ChipProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'prefix'>,
    VariantProps<typeof chipVariants> {
  prefix?: React.ReactNode
  suffix?: React.ReactNode
}

const Chip = React.forwardRef<HTMLButtonElement, ChipProps>(
  ({ className, variant, size, prefix, suffix, children, ...props }, ref) => {
    return (
      <button className={cn(chipVariants({ variant, size, className }))} ref={ref} {...props}>
        {prefix && <span className="flex items-center justify-center">{prefix}</span>}
        {children && <span>{children}</span>}
        {suffix && <span className="flex items-center justify-center">{suffix}</span>}
      </button>
    )
  }
)
Chip.displayName = 'Chip'

export { Chip, chipVariants }
