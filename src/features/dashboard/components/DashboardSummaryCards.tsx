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
  },
  {
    key: 'totalExpense',
    label: 'Despesas',
    icon: TrendingDown,
  },
  {
    key: 'balance',
    label: 'Saldo total',
    icon: Wallet,
  },
  {
    key: 'cashBalance',
    label: 'Dinheiro',
    icon: Banknote,
  },
  {
    key: 'bankBalance',
    label: 'Saldo bancário',
    icon: Landmark,
  },
] satisfies Array<{
  key: keyof DashboardSummaryResponse
  label: string
  icon: typeof Wallet
}>

function DashboardSummaryCards({ summary }: DashboardSummaryCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {summaryCards.map((card) => {
        const Icon = card.icon

        return (
          <article
            key={card.key}
            className="rounded-xl border border-slate-800 bg-slate-950 p-4 sm:p-5"
          >
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm text-slate-400">{card.label}</p>

              <Icon size={20} className="text-emerald-400" />
            </div>

            <p className="mt-3 text-xl font-semibold">{formatCurrency(summary[card.key])}</p>
          </article>
        )
      })}
    </div>
  )
}

export default DashboardSummaryCards
