import { UserRound } from 'lucide-react'

import { formatCurrency } from '../../../lib/formatters/currency'
import type { CategoryExpenseResponse } from '../model/dashboardTypes'

type CategoryDistributionProps = {
  items: CategoryExpenseResponse[]
  title: string
  description: string
  emptyMessage: string
  variant?: 'expense' | 'income'
}

function CategoryDistribution({
  items,
  title,
  description,
  emptyMessage,
  variant = 'expense',
}: CategoryDistributionProps) {
  const highestAmount = Math.max(...items.map((item) => item.amount), 0)
  const totalAmount = items.reduce((sum, item) => sum + item.amount, 0)

  const barClassName = variant === 'income' ? 'bg-emerald-500' : 'bg-rose-500'

  return (
    <section className="rounded-xl border border-(--color-border) bg-(--color-surface) p-4 lg:flex lg:h-full lg:min-h-0 lg:flex-col">
      <div>
        <div className="flex items-center gap-1.5">
          <h2 className="text-lg font-semibold">{title}</h2>

          <UserRound size={15} className="text-(--color-text-muted)" aria-label="Individual" />
        </div>

        <p className="mt-1 text-sm text-slate-400">{description}</p>
      </div>

      {items.length === 0 ? (
        <p className="mt-6 text-sm text-(--color-text-muted)">{emptyMessage}</p>
      ) : (
        <div className="mt-6 space-y-4 lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:pr-2">
          {items.map((item) => {
            const percentage = highestAmount > 0 ? (item.amount / highestAmount) * 100 : 0
            const share = totalAmount > 0 ? (item.amount / totalAmount) * 100 : 0

            return (
              <div key={item.category}>
                <div className="flex items-start justify-between gap-4">
                  <span className="text-sm font-medium text-(--color-text)">{item.category}</span>

                  <div className="text-right">
                    <p className="text-sm font-semibold">{formatCurrency(item.amount)}</p>

                    <p className="text-xs text-(--color-text-muted)">{share.toFixed(0)}%</p>
                  </div>
                </div>

                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-(--color-border)">
                  <div
                    className={`h-full rounded-full ${barClassName}`}
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

export default CategoryDistribution
