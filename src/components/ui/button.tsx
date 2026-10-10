import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-gradient-to-r from-primary to-[#1b4332] text-white shadow hover:from-[#245942] hover:to-[#143226] focus-visible:ring-primary',
        destructive: 'bg-red-600 text-white hover:bg-red-700',
        outline: 'border border-border bg-white hover:bg-surface text-charcoal',
        secondary: 'bg-surface text-charcoal hover:bg-border',
        ghost: 'hover:bg-surface text-charcoal',
        link: 'text-primary underline-offset-4 hover:underline',
        accent: 'bg-accent text-white hover:bg-accent/90 focus-visible:ring-accent',
      },
      size: {
        default: 'h-10 px-5 py-2',
        sm: 'h-8 rounded-md px-4 text-xs',
        lg: 'h-12 rounded-md px-8 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return <Comp className={cn('ui-button', buttonVariants({ variant, size, className }))} data-variant={variant ?? 'default'} ref={ref} {...props} />
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
