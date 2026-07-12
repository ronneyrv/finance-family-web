import { Banknote, Landmark, TrendingDown, TrendingUp, Wallet } from 'lucide-react'

import { formatCurrency } from '../../../lib/formatters/currency'
import type { DashboardSummaryResponse } from '../model/dashboardTypes'

type DashboardSummaryCardsProps = {
  summary: DashboardSummaryResponse
}

const summaryCards = [
  {
    key: 'totalIncome',
    label: 'Receitas',
    icon: TrendingUp,
    iconClass: 'text-green-500',
    iconBackground: 'bg-green-500/15',
  },
  {
    key: 'totalExpense',
    label: 'Despesas',
    icon: TrendingDown,
    iconClass: 'text-red-500',
    iconBackground: 'bg-red-500/15',
  },
  {
    key: 'balance',
    label: 'Saldo total',
    icon: Wallet,
    iconClass: 'text-blue-500',
    iconBackground: 'bg-blue-500/15',
  },
  {
    key: 'cashBalance',
    label: 'Dinheiro',
    icon: Banknote,
    iconClass: 'text-amber-500',
    iconBackground: 'bg-amber-500/15',
  },
  {
    key: 'bankBalance',
    label: 'Saldo bancário',
    icon: Landmark,
    iconClass: 'text-violet-500',
    iconBackground: 'bg-violet-500/15',
  },
] satisfies Array<{
  key: keyof DashboardSummaryResponse
  label: string
  icon: typeof Wallet
  iconClass: string
  iconBackground: string
}>

function DashboardSummaryCards({ summary }: DashboardSummaryCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {summaryCards.map((card) => {
        const Icon = card.icon

        return (
          <article
            key={card.key}
            className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-4 transition-colors hover:border-slate-600"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-(--color-text-muted)">
                  {card.label}
                </p>

                <p className="mt-2 text-xl font-bold text-(--color-text)">
                  {formatCurrency(summary[card.key])}
                </p>
              </div>

              <div
                className={`flex h-10 w-10 items-center justify-center rounded-lg ${card.iconBackground}`}
              >
                <Icon size={20} className={card.iconClass} />
              </div>
            </div>
          </article>
        )
      })}
    </div>
  )
}

export default DashboardSummaryCards
