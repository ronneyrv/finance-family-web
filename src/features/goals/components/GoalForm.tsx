import { useState, type SubmitEvent } from 'react'

import { ApiError } from '../../../lib/api/apiError'
import { goalsApi } from '../api/goalsApi'
import type { GoalResponse } from '../model/goalTypes'

type GoalFormProps = {
  goal?: GoalResponse
  onCreated?: (goal: GoalResponse) => void
  onUpdated?: (goal: GoalResponse) => void
  onCancelEdit?: () => void
}

function GoalForm({ goal, onCreated, onUpdated, onCancelEdit }: GoalFormProps) {
  const [name, setName] = useState(goal?.name ?? '')
  const [targetAmount, setTargetAmount] = useState(goal ? String(goal.targetAmount) : '')
  const [targetDate, setTargetDate] = useState(goal?.targetDate ?? '')

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()

    try {
      setIsSubmitting(true)
      setErrorMessage(null)

      const request = {
        name,
        targetAmount: Number(targetAmount),
        ...(targetDate && {
          targetDate,
        }),
      }

      if (goal) {
        const updatedGoal = await goalsApi.update(goal.id, request)

        onUpdated?.(updatedGoal)
      } else {
        const createdGoal = await goalsApi.create(request)

        onCreated?.(createdGoal)

        setName('')
        setTargetAmount('')
        setTargetDate('')
      }
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(error.message)
      } else {
        setErrorMessage(
          goal ? 'Não foi possível atualizar a meta.' : 'Não foi possível cadastrar a meta.',
        )
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 rounded-xl border border-slate-800 bg-slate-950 p-4 sm:p-6"
    >
      <div>
        <h2 className="text-lg font-semibold">{goal ? 'Editar meta' : 'Nova meta'}</h2>

        <p className="mt-1 text-sm text-slate-400">
          {goal
            ? 'Atualize o objetivo financeiro e o prazo da meta.'
            : 'Defina um objetivo financeiro para acompanhar sua evolução.'}
        </p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="sm:col-span-2">
          <span className="text-sm text-slate-300">Nome da meta</span>

          <input
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Ex.: Viagem para Europa"
            className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5"
          />
        </label>

        <label>
          <span className="text-sm text-slate-300">Valor da meta</span>

          <input
            required
            type="number"
            inputMode="decimal"
            min="0.01"
            step="0.01"
            value={targetAmount}
            onChange={(event) => setTargetAmount(event.target.value)}
            placeholder="0,00"
            className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
        </label>

        <label>
          <span className="text-sm text-slate-300">Data objetivo</span>

          <input
            type="date"
            value={targetDate}
            onChange={(event) => setTargetDate(event.target.value)}
            className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5"
          />
        </label>
      </div>

      {errorMessage && <p className="mt-4 text-sm text-red-400">{errorMessage}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 w-full rounded-lg bg-emerald-500 px-4 py-2.5 font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {isSubmitting ? 'Salvando...' : goal ? 'Salvar alterações' : 'Cadastrar meta'}
      </button>

      {goal && (
        <button
          type="button"
          onClick={onCancelEdit}
          disabled={isSubmitting}
          className="mt-3 w-full rounded-lg border border-slate-700 px-4 py-2.5 font-medium text-slate-300 transition hover:bg-slate-900 disabled:opacity-50 sm:mt-0 sm:ml-3 sm:w-auto"
        >
          Cancelar edição
        </button>
      )}
    </form>
  )
}

export default GoalForm
