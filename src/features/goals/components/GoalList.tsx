import { CalendarDays, Goal, Pencil, Trash2 } from 'lucide-react'

import { formatCurrency } from '../../../lib/formatters/currency'
import { formatDate } from '../../../lib/formatters/date'
import type { GoalResponse } from '../model/goalTypes'

type GoalListProps = {
  goals: GoalResponse[]
  onEdit: (goal: GoalResponse) => void
  onDelete: (goal: GoalResponse) => void
}

function GoalList({ goals, onEdit, onDelete }: GoalListProps) {
  if (goals.length === 0) {
    return (
      <div className="mt-8 rounded-xl border border-slate-800 bg-slate-950 p-8 text-center">
        <Goal className="mx-auto text-slate-500" size={32} />

        <p className="mt-4 font-medium">Nenhuma meta cadastrada</p>

        <p className="mt-2 text-sm text-slate-400">
          Cadastre uma meta para acompanhar a evolução dos seus objetivos financeiros.
        </p>
      </div>
    )
  }

  return (
    <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {goals.map((goal) => (
        <article key={goal.id} className="rounded-xl border border-slate-800 bg-slate-950 p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-400">
                <Goal size={22} />
              </div>

              <div className="min-w-0">
                <h2 className="truncate font-semibold">{goal.name}</h2>

                <p className="mt-1 text-xs text-slate-500">Meta financeira</p>
              </div>
            </div>

            <div className="flex shrink-0 gap-1">
              <button
                type="button"
                onClick={() => onEdit(goal)}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-emerald-500/10 hover:text-emerald-400"
                aria-label={`Editar ${goal.name}`}
                title="Editar meta"
              >
                <Pencil size={17} />
              </button>

              <button
                type="button"
                onClick={() => onDelete(goal)}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-red-500/10 hover:text-red-400"
                aria-label={`Excluir ${goal.name}`}
                title="Excluir meta"
              >
                <Trash2 size={17} />
              </button>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between gap-4 text-sm">
              <span className="text-slate-400">Progresso</span>
              <span className="font-medium text-emerald-400">{goal.progress}%</span>
            </div>

            <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800">
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
              <p className="text-xs text-slate-500">Valor atual</p>
              <p className="mt-1 font-medium">{formatCurrency(goal.currentAmount)}</p>
            </div>

            <div>
              <p className="text-xs text-slate-500">Objetivo</p>
              <p className="mt-1 font-medium">{formatCurrency(goal.targetAmount)}</p>
            </div>
          </div>

          <div className="mt-4 border-t border-slate-800 pt-4">
            <p className="text-xs text-slate-500">Valor restante</p>

            <p className="mt-1 font-medium">{formatCurrency(goal.remainingAmount)}</p>

            {goal.targetDate && (
              <div className="mt-4 flex items-center gap-2 text-sm text-slate-400">
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
