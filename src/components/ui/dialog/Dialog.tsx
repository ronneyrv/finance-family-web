import { useEffect, useRef, type ReactNode } from 'react'

type DialogProps = {
  open: boolean
  title: string
  children: ReactNode
  onClose: () => void
}

function Dialog({ open, title, children, onClose }: DialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const previousFocusedElement = useRef<HTMLElement | null>(null)

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Escape') {
      onClose()
    }
  }

  useEffect(() => {
    if (!open) {
      return
    }

    previousFocusedElement.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null

    dialogRef.current?.focus()

    return () => {
      previousFocusedElement.current?.focus()
    }
  }, [open])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose()
        }
      }}
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        onKeyDown={handleKeyDown}
        className="w-full max-w-md rounded-2xl border border-(--color-border) bg-(--color-surface) p-6 shadow-2xl"
      >
        <h2 id="dialog-title" className="text-lg font-semibold text-(--color-text)">
          {title}
        </h2>

        <div className="mt-4">{children}</div>
      </div>
    </div>
  )
}

export default Dialog
