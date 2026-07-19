import { CalendarDays, Goal } from 'lucide-react'

import { formatDate } from '../../../lib/formatters/date'
import { EmptyState } from '../../../components/ui/empty-state'
import { formatCurrency } from '../../../lib/formatters/currency'
import type { GoalResponse } from '../model/goalTypes'
import { ActionButton } from '../../../components/ui/action-button'

type GoalListProps = {
  goals: GoalResponse[]
  onEdit: (goal: GoalResponse) => void
  onDelete: (goal: GoalResponse) => void
}

function GoalList({ goals, onEdit, onDelete }: GoalListProps) {
  if (goals.length === 0) {
    return (
      <EmptyState
        title="Nenhuma meta cadastrada"
        description="Cadastre uma meta para acompanhar a evolução dos seus objetivos financeiros."
      />
    )
  }

  return (
    <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {goals.map((goal) => (
        <article
          key={goal.id}
          className="rounded-xl border border-(--color-border) bg-(--color-surface) p-4"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-400">
                <Goal size={20} />
              </div>

              <div className="min-w-0">
                <h2 className="truncate font-semibold">{goal.name}</h2>

                <p className="mt-1 text-xs text-(--color-text-muted)">Meta financeira</p>
              </div>
            </div>

            <div className="flex shrink-0 gap-1">
              <ActionButton
                variant="edit"
                label={`Editar ${goal.name}`}
                onClick={() => onEdit(goal)}
              />

              <ActionButton
                variant="delete"
                label={`Excluir ${goal.name}`}
                onClick={() => onDelete(goal)}
              />
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between gap-4 text-sm">
              <span className="text-(--color-text-muted)">Progresso</span>
              <span className="font-medium text-emerald-400">{goal.progress}%</span>
            </div>

            <div className="mt-2 h-2 overflow-hidden rounded-full bg-(--color-border)">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all"
                style={{
                  width: `${Math.min(Math.max(goal.progress, 0), 100)}%`,
                }}
              />
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-(--color-text-muted)">Valor atual</p>
              <p className="mt-1 font-medium">{formatCurrency(goal.currentAmount)}</p>
            </div>

            <div>
              <p className="text-xs text-(--color-text-muted)">Objetivo</p>
              <p className="mt-1 font-medium">{formatCurrency(goal.targetAmount)}</p>
            </div>
          </div>

          <div className="mt-4 border-t border-(--color-border) pt-4">
            <p className="text-xs text-(--color-text-muted)">Valor restante</p>

            <p className="mt-1 font-medium">{formatCurrency(goal.remainingAmount)}</p>

            {goal.targetDate && (
              <div className="mt-4 flex items-center gap-2 text-sm text-(--color-text-muted)">
                <CalendarDays size={16} />

                <span>Prazo: {formatDate(goal.targetDate)}</span>
              </div>
            )}
          </div>
        </article>
      ))}
    </div>
  )
}

export default GoalList
