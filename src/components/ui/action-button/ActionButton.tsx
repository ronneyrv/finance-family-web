import type { ButtonHTMLAttributes } from 'react'
import { Pause, Pencil, Play, Trash2 } from 'lucide-react'

import { cn } from '../../../lib/utils/cn'

type ActionButtonVariant = 'edit' | 'delete' | 'activate' | 'deactivate'

type ActionButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant: ActionButtonVariant
  label: string
  showText?: boolean
}

const config = {
  edit: {
    icon: Pencil,
    text: 'Editar',
    className: 'text-(--color-text-muted) hover:bg-emerald-500/10 hover:text-emerald-400',
  },
  delete: {
    icon: Trash2,
    text: 'Excluir',
    className: 'text-(--color-text-muted) hover:bg-red-500/10 hover:text-red-400',
  },
  activate: {
    icon: Play,
    text: 'Ativar',
    className: 'text-(--color-text-muted) hover:bg-blue-500/10 hover:text-blue-400',
  },
  deactivate: {
    icon: Pause,
    text: 'Desativar',
    className: 'text-(--color-text-muted) hover:bg-amber-500/10 hover:text-amber-400',
  },
} satisfies Record<
  ActionButtonVariant,
  {
    icon: typeof Pencil
    text: string
    className: string
  }
>

function ActionButton({
  variant,
  label,
  showText = false,
  className,
  ...props
}: ActionButtonProps) {
  const { icon: Icon, text, className: variantClass } = config[variant]

  return (
    <button
      {...props}
      type="button"
      aria-label={label}
      title={label}
      className={cn(
        'inline-flex items-center gap-2 rounded-lg p-2 text-sm font-medium transition',
        variantClass,
        className,
      )}
    >
      <Icon size={16} />
      {showText && <span>{text}</span>}
    </button>
  )
}

export default ActionButton
