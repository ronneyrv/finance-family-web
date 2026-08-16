import { UserRound } from 'lucide-react'

import { formatCurrency } from '../../../lib/formatters/currency'
import type { CategoryExpenseResponse } from '../model/dashboardTypes'

type MonthlyCategoryExpensesProps = {
  expenses: CategoryExpenseResponse[]
  month: number
  year: number
}

function MonthlyCategoryExpenses({ expenses, month, year }: MonthlyCategoryExpensesProps) {
  const highestAmount = Math.max(...expenses.map((expense) => expense.amount), 0)
  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0)

  const monthLabel = new Intl.DateTimeFormat('pt-BR', {
    month: 'long',
  }).format(new Date(year, month - 1, 1))

  return (
    <section className="rounded-xl border border-(--color-border) bg-(--color-surface) p-4 lg:flex lg:h-full lg:min-h-0 lg:flex-col">
      <div>
        <div className="flex items-center gap-1.5">
          <h2 className="text-lg font-semibold">Despesa mensal</h2>

          <UserRound size={15} className="text-(--color-text-muted)" aria-label="Individual" />
        </div>

        <p className="mt-1 text-sm text-slate-400">
          Distribuição por categoria em {monthLabel} de {year}.
        </p>
      </div>

      {expenses.length === 0 ? (
        <p className="mt-6 text-sm text-(--color-text-muted)">
          Nenhuma despesa registrada para exibição.
        </p>
      ) : (
        <div className="mt-6 space-y-4 lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:pr-2">
          {expenses.map((expense) => {
            const percentage = highestAmount > 0 ? (expense.amount / highestAmount) * 100 : 0
            const share = totalAmount > 0 ? (expense.amount / totalAmount) * 100 : 0

            return (
              <div key={expense.category}>
                <div className="flex items-start justify-between gap-4">
                  <span className="text-sm font-medium text-(--color-text)">
                    {expense.category}
                  </span>

                  <div className="text-right">
                    <p className="text-sm font-semibold">{formatCurrency(expense.amount)}</p>

                    <p className="text-xs text-(--color-text-muted)">{share.toFixed(0)}%</p>
                  </div>
                </div>

                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-(--color-border)">
                  <div
                    className="h-full rounded-full bg-emerald-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}

export default MonthlyCategoryExpenses
