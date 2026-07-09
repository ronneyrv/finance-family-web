import { useState } from 'react'

import { ApiError } from '../../../lib/api/apiError'
import { creditCardsApi } from '../api/creditCardsApi'
import type { CreditCardResponse } from '../model/creditCardTypes'

type DeleteCreditCardDialogProps = {
  creditCard: CreditCardResponse
  onDeleted: (creditCardId: string) => void
  onCancel: () => void
}

function DeleteCreditCardDialog({ creditCard, onDeleted, onCancel }: DeleteCreditCardDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  async function handleDelete() {
    try {
      setIsDeleting(true)
      setErrorMessage(null)

      await creditCardsApi.delete(creditCard.id)

      onDeleted(creditCard.id)
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(error.message)
      } else {
        setErrorMessage('Não foi possível excluir o cartão.')
      }
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4"
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-credit-card-title"
        className="w-full max-w-md rounded-xl border border-slate-800 bg-slate-950 p-6 shadow-2xl"
      >
        <h2 id="delete-credit-card-title" className="text-lg font-semibold">
          Excluir cartão
        </h2>

        <p className="mt-3 text-sm leading-6 text-slate-400">
          Tem certeza que deseja excluir o cartão{' '}
          <span className="font-medium text-slate-200">{creditCard.name}</span>?
        </p>

        <p className="mt-2 text-sm text-slate-500">Esta ação não poderá ser desfeita.</p>

        {errorMessage && <p className="mt-4 text-sm text-red-400">{errorMessage}</p>}

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="rounded-lg border border-slate-700 px-4 py-2.5 font-medium text-slate-300 transition hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={() => void handleDelete()}
            disabled={isDeleting}
            className="rounded-lg bg-red-500 px-4 py-2.5 font-semibold text-white transition hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isDeleting ? 'Excluindo...' : 'Excluir cartão'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteCreditCardDialog
