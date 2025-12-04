import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-purple-500/20 text-purple-300 hover:bg-purple-500/30',
        secondary:
          'border-transparent bg-white/10 text-gray-300 hover:bg-white/20',
        destructive:
          'border-transparent bg-red-500/20 text-red-300 hover:bg-red-500/30',
        outline: 'border-white/20 text-gray-300',
        success:
          'border-transparent bg-green-500/20 text-green-300 hover:bg-green-500/30',
        hot: 'border-transparent bg-gradient-to-r from-orange-500 to-red-500 text-white animate-pulse',
        free: 'border-transparent bg-emerald-500/20 text-emerald-300',
        pro: 'border-transparent bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
