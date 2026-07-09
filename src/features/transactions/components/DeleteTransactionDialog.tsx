import { useState } from 'react'

import { ApiError } from '../../../lib/api/apiError'
import { transactionsApi } from '../api/transactionsApi'
import type { TransactionResponse } from '../model/transactionTypes'

type DeleteTransactionDialogProps = {
  transaction: TransactionResponse
  onDeleted: (transactionId: string) => void
  onCancel: () => void
}

function DeleteTransactionDialog({
  transaction,
  onDeleted,
  onCancel,
}: DeleteTransactionDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  async function handleDelete() {
    try {
      setIsDeleting(true)
      setErrorMessage(null)

      await transactionsApi.delete(transaction.id)

      onDeleted(transaction.id)
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(error.message)
      } else {
        setErrorMessage('Não foi possível excluir a transação.')
      }
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isDeleting) {
          onCancel()
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-transaction-title"
        className="w-full max-w-md rounded-xl border border-slate-800 bg-slate-950 p-6 shadow-xl"
      >
        <h2 id="delete-transaction-title" className="text-lg font-semibold">
          Excluir transação?
        </h2>

        <p className="mt-3 text-sm text-slate-400">
          A transação <strong>{transaction.description}</strong> será excluída permanentemente.
        </p>

        {errorMessage && <p className="mt-4 text-sm text-red-400">{errorMessage}</p>}

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            disabled={isDeleting}
            onClick={onCancel}
            className="rounded-lg border border-slate-700 px-4 py-2.5 font-medium text-slate-300 transition hover:bg-slate-900 disabled:opacity-50"
          >
            Cancelar
          </button>

          <button
            type="button"
            disabled={isDeleting}
            onClick={() => void handleDelete()}
            className="rounded-lg bg-red-500 px-4 py-2.5 font-semibold text-white transition hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isDeleting ? 'Excluindo...' : 'Excluir'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteTransactionDialog
