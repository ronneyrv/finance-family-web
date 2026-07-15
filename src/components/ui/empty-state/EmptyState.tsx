import type { ReactNode } from 'react'

import { Card } from '../card'

type EmptyStateProps = {
  title: string
  description?: ReactNode
  className?: string
}

function EmptyState({ title, description, className }: EmptyStateProps) {
  return (
    <Card className={['mt-8 p-8 text-center', className].filter(Boolean).join(' ')}>
      <p className="font-medium">{title}</p>

      {description && <p className="mt-2 text-sm text-(--color-text-muted)">{description}</p>}
    </Card>
  )
}

export default EmptyState
