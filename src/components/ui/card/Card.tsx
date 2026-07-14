import type { ElementType, ComponentPropsWithoutRef } from 'react'

import { cn } from '../../../lib/utils/cn'

type CardProps<T extends ElementType = 'div'> = {
  as?: T
} & ComponentPropsWithoutRef<T>

function Card<T extends ElementType = 'div'>({ as, className, children, ...props }: CardProps<T>) {
  const Component = as ?? 'div'

  return (
    <Component
      className={cn(
        'rounded-xl border border-(--color-border) bg-(--color-surface) p-4',
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  )
}

export default Card
