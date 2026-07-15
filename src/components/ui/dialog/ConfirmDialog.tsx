import type { ReactNode } from 'react'

import Dialog from './Dialog'
import { Alert } from '../alert'
import { Button } from '../button'

type ConfirmDialogProps = {
  open: boolean
  title: string
  description: ReactNode

  confirmLabel?: string
  confirmLoadingLabel?: string
  cancelLabel?: string

  confirmVariant?: 'danger' | 'primary'

  isLoading?: boolean
  errorMessage?: string | null

  onConfirm: () => void
  onCancel: () => void
}

function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirmar',
  confirmLoadingLabel = 'Processando...',
  cancelLabel = 'Cancelar',
  confirmVariant = 'danger',
  isLoading = false,
  errorMessage,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} title={title} onClose={isLoading ? () => {} : onCancel}>
      <div className="space-y-4">
        <div className="text-sm text-(--color-text-muted)">{description}</div>

        {errorMessage && <Alert>{errorMessage}</Alert>}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button type="button" variant="secondary" disabled={isLoading} onClick={onCancel}>
            {cancelLabel}
          </Button>

          <Button type="button" variant={confirmVariant} disabled={isLoading} onClick={onConfirm}>
            {isLoading ? confirmLoadingLabel : confirmLabel}
          </Button>
        </div>
      </div>
    </Dialog>
  )
}

export default ConfirmDialog
