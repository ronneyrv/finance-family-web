import Dialog from './Dialog'

type ConfirmDialogProps = {
  open: boolean
  title: string
  description: string

  confirmLabel?: string
  cancelLabel?: string

  confirmVariant?: 'danger' | 'primary'

  onConfirm: () => void
  onCancel: () => void
}

function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  confirmVariant = 'danger',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} title={title} onClose={onCancel}>
      <p className="text-sm text-(--color-text-muted)">{description}</p>

      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-(--color-border) px-4 py-2 text-sm font-medium transition hover:bg-(--color-surface-hover)"
        >
          {cancelLabel}
        </button>

        <button
          type="button"
          onClick={onConfirm}
          className={[
            'rounded-lg px-4 py-2 text-sm font-semibold text-white transition',
            confirmVariant === 'danger'
              ? 'bg-red-600 hover:bg-red-500'
              : 'bg-emerald-500 hover:bg-emerald-400',
          ].join(' ')}
        >
          {confirmLabel}
        </button>
      </div>
    </Dialog>
  )
}

export default ConfirmDialog
