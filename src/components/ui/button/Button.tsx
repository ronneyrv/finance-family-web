import type { ButtonHTMLAttributes } from 'react'

import { cn } from '../../../lib/utils/cn'

type ButtonVariant = 'primary' | 'secondary' | 'danger'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  fullWidth?: boolean
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-emerald-500 text-slate-950 font-semibold hover:bg-emerald-400',

  secondary:
    'border border-(--color-border) bg-transparent font-medium text-(--color-text) hover:bg-(--color-surface-hover)',

  danger: 'bg-red-500 text-white font-semibold hover:bg-red-400',
}

function Button({
  variant = 'primary',
  fullWidth = false,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={cn(
        'rounded-lg px-4 py-2.5 font-semibold transition disabled:cursor-not-allowed disabled:opacity-60',
        fullWidth && 'w-full',
        variantClasses[variant],
        className,
      )}
    >
      {children}
    </button>
  )
}

export default Button
