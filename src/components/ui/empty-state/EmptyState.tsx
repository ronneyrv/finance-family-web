import type { ReactNode } from 'react'

import { cn } from '../../../lib/utils/cn'
import { Card } from '../card'

type EmptyStateProps = {
  title: string
  description?: ReactNode
  className?: string
}

function EmptyState({ title, description, className }: EmptyStateProps) {
  return (
    <Card className={cn('mt-8 p-8 text-center', className)}>
      <p className="font-medium">{title}</p>

      {description && <p className="mt-2 text-sm text-(--color-text-muted)">{description}</p>}
    </Card>
  )
}

export default EmptyState
