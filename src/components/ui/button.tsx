import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-xl text-[13px] font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1976d2] disabled:pointer-events-none disabled:opacity-50 cursor-pointer active:scale-[0.98]',
  {
    variants: {
      variant: {
        default: 'bg-[#1976d2] text-white hover:bg-[#1565c0] shadow-sm hover:shadow-md border border-transparent',
        destructive: 'bg-red-500 text-white hover:bg-red-600 shadow-sm border border-transparent',
        outline: 'border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 hover:border-gray-300',
        secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 border border-transparent',
        ghost: 'hover:bg-gray-100 text-gray-700 border border-transparent',
        link: 'text-[#1976d2] underline-offset-4 hover:underline border border-transparent',
      },
      size: {
        default: 'h-10 px-5 py-2.5',
        sm: 'h-9 px-4 py-2 text-xs',
        lg: 'h-11 px-6 py-3 text-sm rounded-2xl',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> { }

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
