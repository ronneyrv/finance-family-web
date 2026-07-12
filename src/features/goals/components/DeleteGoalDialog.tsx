import { useState } from 'react'

import { ApiError } from '../../../lib/api/apiError'
import { goalsApi } from '../api/goalsApi'
import type { GoalResponse } from '../model/goalTypes'

type DeleteGoalDialogProps = {
  goal: GoalResponse
  onDeleted: (goalId: string) => void
  onCancel: () => void
}

function DeleteGoalDialog({ goal, onDeleted, onCancel }: DeleteGoalDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  async function handleDelete() {
    try {
      setIsDeleting(true)
      setErrorMessage(null)

      await goalsApi.delete(goal.id)

      onDeleted(goal.id)
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(error.message)
      } else {
        setErrorMessage('Não foi possível excluir a meta.')
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
        aria-labelledby="delete-goal-title"
        className="w-full max-w-md rounded-xl border border-(--color-border) bg-(--color-surface) p-6 shadow-2xl"
      >
        <h2 id="delete-goal-title" className="text-lg font-semibold">
          Excluir meta
        </h2>

        <p className="mt-3 text-sm leading-6 text-(--color-text-muted)">
          Tem certeza que deseja excluir a meta{' '}
          <span className="font-medium text-(--color-text)">{goal.name}</span>?
        </p>

        <p className="mt-2 text-sm text-(--color-text-muted)">Esta ação não poderá ser desfeita.</p>

        {errorMessage && <p className="mt-4 text-sm text-red-400">{errorMessage}</p>}

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="rounded-lg border border-(--color-border) px-4 py-2.5 font-medium text-(--color-text) transition hover:bg-(--color-surface-hover) disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={() => void handleDelete()}
            disabled={isDeleting}
            className="rounded-lg bg-red-500 px-4 py-2.5 font-semibold text-white transition hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isDeleting ? 'Excluindo...' : 'Excluir meta'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteGoalDialog
