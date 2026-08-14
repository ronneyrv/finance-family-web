import type { ReactNode } from 'react'

import { cn } from '../../../lib/utils/cn'

export type ToastVariant = 'success' | 'error' | 'warning' | 'info'

type ToastProps = {
  variant?: ToastVariant
  children: ReactNode
  onClose?: () => void
}

const variants: Record<ToastVariant, string> = {
  success: 'border-emerald-800 bg-emerald-950 text-emerald-300',
  error: 'border-red-800 bg-red-950 text-red-300',
  warning: 'border-yellow-800 bg-yellow-950 text-yellow-300',
  info: 'border-sky-800 bg-sky-950 text-sky-300',
}

function Toast({ variant = 'info', children, onClose }: ToastProps) {
  return (
    <div
      role={variant === 'error' || variant === 'warning' ? 'alert' : 'status'}
      className={cn(
        'flex items-start justify-between gap-4 rounded-xl border p-4 text-sm shadow-lg',
        variants[variant],
      )}
    >
      <div className="flex-1">{children}</div>

      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Close notification"
          className="shrink-0 opacity-70 transition-opacity hover:opacity-100"
        >
          ×
        </button>
      )}
    </div>
  )
}

export default Toast
