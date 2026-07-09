import { formatCurrency } from '../../../lib/formatters/currency'
import type { CategoryExpenseResponse } from '../model/dashboardTypes'

type CategoryExpensesProps = {
  expenses: CategoryExpenseResponse[]
}

function CategoryExpenses({ expenses }: CategoryExpensesProps) {
  const highestAmount = Math.max(...expenses.map((expense) => expense.amount), 0)

  return (
    <section className="rounded-xl border border-slate-800 bg-slate-950 p-4 sm:p-6">
      <div>
        <h2 className="text-lg font-semibold">Despesas por categoria</h2>

        <p className="mt-1 text-sm text-slate-400">
          Distribuição das despesas registradas por categoria.
        </p>
      </div>

      {expenses.length === 0 ? (
        <p className="mt-6 text-sm text-slate-400">Nenhuma despesa registrada para exibição.</p>
      ) : (
        <div className="mt-6 space-y-5">
          {expenses.map((expense) => {
            const percentage = highestAmount > 0 ? (expense.amount / highestAmount) * 100 : 0

            return (
              <div key={expense.category}>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm font-medium">{expense.category}</span>

                  <span className="whitespace-nowrap text-sm text-slate-300">
                    {formatCurrency(expense.amount)}
                  </span>
                </div>

                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800">
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

export default CategoryExpenses
