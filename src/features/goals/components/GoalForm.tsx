import { useState, type SubmitEvent } from 'react'

import { ApiError } from '../../../lib/api/apiError'
import { goalsApi } from '../api/goalsApi'
import type { GoalResponse } from '../model/goalTypes'
import { fieldClassName } from '../../../components/ui/forms/fieldClass'
import { Button } from '../../../components/ui/button'
import { Card } from '../../../components/ui/card'

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
    <Card className="mt-8">
      <form onSubmit={handleSubmit}>
        <div>
          <h2 className="text-lg font-semibold">{goal ? 'Editar meta' : 'Nova meta'}</h2>

          <p className="mt-1 text-sm text-(--color-text-muted)">
            {goal
              ? 'Atualize o objetivo financeiro e o prazo da meta.'
              : 'Defina um objetivo financeiro para acompanhar sua evolução.'}
          </p>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="sm:col-span-2">
            <span className="text-sm text-(--color-text)">Nome da meta</span>

            <input
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Ex.: Viagem para Europa"
              className={fieldClassName}
            />
          </label>

          <label>
            <span className="text-sm text-(--color-text)">Valor da meta</span>

            <input
              required
              type="number"
              inputMode="decimal"
              min="0.01"
              step="0.01"
              value={targetAmount}
              onChange={(event) => setTargetAmount(event.target.value)}
              placeholder="0,00"
              className={`${fieldClassName} [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
            />
          </label>

          <label>
            <span className="text-sm text-(--color-text)">Data objetivo</span>

            <input
              type="date"
              value={targetDate}
              onChange={(event) => setTargetDate(event.target.value)}
              className={fieldClassName}
            />
          </label>
        </div>

        {errorMessage && <p className="mt-4 text-sm text-red-400">{errorMessage}</p>}

        <div className="mt-6 flex flex-col gap-3 border-t border-(--color-border) pt-4 sm:flex-row">
          <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
            {isSubmitting ? 'Salvando...' : goal ? 'Salvar alterações' : 'Cadastrar meta'}
          </Button>

          {goal && (
            <Button
              type="button"
              variant="secondary"
              onClick={onCancelEdit}
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              Cancelar edição
            </Button>
          )}
        </div>
      </form>
    </Card>
  )
}

export default GoalForm
