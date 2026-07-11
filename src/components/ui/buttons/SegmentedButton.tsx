import type { ReactNode } from 'react'

type SegmentedButtonProps = {
  selected: boolean
  icon?: ReactNode
  children: ReactNode
  onClick: () => void
}

function SegmentedButton({ selected, icon, children, onClick }: SegmentedButtonProps) {
  const baseClass =
    'flex w-full items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-all'

  const activeClass =
    'border-(--color-primary) bg-(--color-primary-bg) text-(--color-primary) shadow-sm'

  const inactiveClass =
    'border-(--color-border) bg-(--color-surface) text-(--color-text-muted) hover:border-(--color-primary) hover:bg-(--color-primary-hover)'

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${baseClass} ${selected ? activeClass : inactiveClass}`}
    >
      {icon}
      {children}
    </button>
  )
}

export default SegmentedButton
