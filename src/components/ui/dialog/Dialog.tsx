import type { ReactNode } from 'react'

type DialogProps = {
  open: boolean
  title: string
  children: ReactNode
  onClose: () => void
}

function Dialog({ open, title, children, onClose }: DialogProps) {
  if (!open) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4">
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative w-full max-w-md rounded-2xl border border-(--color-border) bg-(--color-surface) p-6 shadow-2xl">
        <h2 className="text-lg font-semibold text-(--color-text)">{title}</h2>

        <div className="mt-4">{children}</div>
      </div>
    </div>
  )
}

export default Dialog
