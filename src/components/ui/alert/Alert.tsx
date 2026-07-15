import type { ReactNode } from 'react'

import { cn } from '../../../lib/utils/cn'

type AlertVariant = 'error' | 'success' | 'warning' | 'info'

type AlertProps = {
  variant?: AlertVariant
  children: ReactNode
  className?: string
}

const variants: Record<AlertVariant, string> = {
  error: 'border-red-500/20 bg-red-500/10 text-red-300',
  success: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300',
  warning: 'border-yellow-500/20 bg-yellow-500/10 text-yellow-300',
  info: 'border-sky-500/20 bg-sky-500/10 text-sky-300',
}

function Alert({ variant = 'error', children, className }: AlertProps) {
  return (
    <div role="alert" className={cn('rounded-xl border p-4 text-sm', variants[variant], className)}>
      {children}
    </div>
  )
}

export default Alert
