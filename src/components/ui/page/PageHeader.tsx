import type { ReactNode } from 'react'

type PageHeaderProps = {
  section: ReactNode
  title: ReactNode
  description?: ReactNode
}

function PageHeader({ section, title, description }: PageHeaderProps) {
  return (
    <header>
      <p className="text-sm font-medium text-emerald-400">{section}</p>

      <h1 className="mt-1 text-2xl font-bold sm:text-3xl">{title}</h1>

      {description && <p className="mt-2 text-sm text-(--color-text-muted)">{description}</p>}
    </header>
  )
}

export default PageHeader
