import type { ButtonHTMLAttributes } from 'react'
import { Pencil, Trash2 } from 'lucide-react'

import { cn } from '../../../lib/utils/cn'

type ActionButtonVariant = 'edit' | 'delete'

type ActionButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant: ActionButtonVariant
  label: string
}

const config = {
  edit: {
    icon: Pencil,
    className: 'text-(--color-text-muted) hover:bg-emerald-500/10 hover:text-emerald-400',
  },
  delete: {
    icon: Trash2,
    className: 'text-(--color-text-muted) hover:bg-red-500/10 hover:text-red-400',
  },
} satisfies Record<
  ActionButtonVariant,
  {
    icon: typeof Pencil
    className: string
  }
>

function ActionButton({ variant, label, className, ...props }: ActionButtonProps) {
  const { icon: Icon, className: variantClass } = config[variant]

  return (
    <button
      {...props}
      type="button"
      aria-label={label}
      title={label}
      className={cn('inline-flex rounded-lg p-2 transition', variantClass, className)}
    >
      <Icon size={18} />
    </button>
  )
}

export default ActionButton
