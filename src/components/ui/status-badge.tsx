'use client'

import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'

const statusBadgeVariants = cva(
  // Base styles
  'inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium backdrop-blur-md transition-all duration-300',
  {
    variants: {
      variant: {
        default: 'bg-white/10 border border-white/10 text-white',
        success: 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400',
        warning: 'bg-amber-500/10 border border-amber-500/20 text-amber-400',
        danger: 'bg-red-500/10 border border-red-500/20 text-red-400',
        info: 'bg-blue-500/10 border border-blue-500/20 text-blue-400',
      },
      size: {
        sm: 'px-3 py-1.5 text-[10px]',
        md: 'px-4 py-2 text-xs',
        lg: 'px-5 py-2.5 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statusBadgeVariants> {
  /** The status text to display */
  children?: React.ReactNode
  /** Whether to show the ping animation */
  showPing?: boolean
  /** Whether the status is active (green dot) */
  active?: boolean
  /** Custom dot color */
  dotColor?: string
}

/**
 * StatusBadge Component
 * 
 * A glassmorphism-style status badge with an animated ping indicator.
 * 
 * @example
 * // Basic usage
 * <StatusBadge>Available for opportunities</StatusBadge>
 * 
 * @example
 * // With custom variant
 * <StatusBadge variant="success" showPing>
 *   Online
 * </StatusBadge>
 * 
 * @example
 * // Without ping animation
 * <StatusBadge showPing={false}>
 *   Away
 * </StatusBadge>
 */
export function StatusBadge({
  className,
  variant = 'default',
  size = 'md',
  children = 'Available for opportunities',
  showPing = true,
  active = true,
  dotColor,
  ...props
}: StatusBadgeProps) {
  const dotColorClass = dotColor || (active ? 'bg-emerald-500' : 'bg-slate-400')
  const pingColorClass = dotColor || (active ? 'bg-emerald-500' : 'bg-slate-400')

  return (
    <div
      className={cn(statusBadgeVariants({ variant, size }), className)}
      {...props}
    >
      {/* Status dot with optional ping animation */}
      <span className="relative flex h-2 w-2">
        {showPing && active && (
          <span
            className={cn(
              'absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping',
              pingColorClass
            )}
          />
        )}
        <span
          className={cn(
            'relative inline-flex rounded-full h-2 w-2',
            dotColorClass
          )}
        />
      </span>
      
      {/* Status text */}
      <span className="whitespace-nowrap font-sans">{children}</span>
    </div>
  )
}

export { statusBadgeVariants }
