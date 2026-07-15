import type { ButtonHTMLAttributes } from 'react'
import { cn } from '../../../lib/utils/cn'

type ActionLinkProps = ButtonHTMLAttributes<HTMLButtonElement>

function ActionLink({ children, className, ...props }: ActionLinkProps) {
  return (
    <button
      {...props}
      className={cn(
        'inline-flex items-center gap-2 rounded-md p-2 text-sm font-medium text-(--color-text-muted) transition-colors hover:text-(--color-text) cursor-pointer',
        className,
      )}
    >
      {children}
    </button>
  )
}

export default ActionLink
