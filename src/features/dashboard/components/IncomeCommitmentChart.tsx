import { UsersRound } from 'lucide-react'

import { Card } from '../../../components/ui/card'
import { formatCurrency } from '../../../lib/formatters/currency'
import type { CommitmentLevel, IncomeCommitmentResponse } from '../model/dashboardTypes'

type IncomeCommitmentChartProps = {
  data: IncomeCommitmentResponse
}

const commitmentLevelLabels: Record<CommitmentLevel, string> = {
  LOW: 'Baixo',
  MEDIUM: 'Moderado',
  HIGH: 'Alto',
}

const commitmentLevelStyles: Record<CommitmentLevel, string> = {
  LOW: 'text-emerald-400',
  MEDIUM: 'text-amber-400',
  HIGH: 'text-rose-400',
}

function IncomeCommitmentChart({ data }: IncomeCommitmentChartProps) {
  const {
    monthlyIncome,
    recurringExpenses,
    unpaidCreditCardInstallments,
    monthlyCommitments,
    availableIncome,
    commitmentPercentage,
    commitmentLevel,
  } = data

  return (
    <Card>
      <div>
        <div className="flex items-center gap-1.5">
          <h2 className="text-lg font-semibold">Comprometimento da renda</h2>

          <UsersRound size={15} className="text-(--color-text-muted)" aria-label="Família" />
        </div>

        <p className="mt-1 text-sm text-slate-400">Quanto da renda mensal está comprometida.</p>
      </div>

      <div className="mt-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm text-(--color-text-muted)">Renda mensal</p>

            <p className="mt-1 text-2xl font-semibold">{formatCurrency(monthlyIncome)}</p>
          </div>

          <div className="text-right">
            <p className="text-sm text-(--color-text-muted)">Comprometimento</p>

            <p className={`mt-1 text-2xl font-semibold ${commitmentLevelStyles[commitmentLevel]}`}>
              {commitmentPercentage.toFixed(2)}%
            </p>
          </div>
        </div>

        <div className="mt-5">
          <div className="h-3 overflow-hidden rounded-full bg-(--color-border)">
            <div
              className={`h-full rounded-full transition-all ${
                commitmentLevel === 'LOW'
                  ? 'bg-emerald-400'
                  : commitmentLevel === 'MEDIUM'
                    ? 'bg-amber-400'
                    : 'bg-rose-400'
              }`}
              style={{
                width: `${Math.min(commitmentPercentage, 100)}%`,
              }}
            />
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm text-(--color-text-muted)">Nível de comprometimento</span>

          <span className={`text-sm font-semibold ${commitmentLevelStyles[commitmentLevel]}`}>
            {commitmentLevelLabels[commitmentLevel]}
          </span>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 border-t border-(--color-border) pt-5">
        <div>
          <p className="text-xs text-(--color-text-muted)">Despesas recorrentes</p>

          <p className="mt-1 font-medium">{formatCurrency(recurringExpenses)}</p>
        </div>

        <div>
          <p className="text-xs text-(--color-text-muted)">Parcelas do cartão</p>

          <p className="mt-1 font-medium">{formatCurrency(unpaidCreditCardInstallments)}</p>
        </div>

        <div>
          <p className="text-xs text-(--color-text-muted)">Compromissos mensais</p>

          <p className="mt-1 font-medium">{formatCurrency(monthlyCommitments)}</p>
        </div>

        <div>
          <p className="text-xs text-(--color-text-muted)">Renda disponível</p>

          <p className="mt-1 font-medium">{formatCurrency(availableIncome)}</p>
        </div>
      </div>
    </Card>
  )
}

export default IncomeCommitmentChart
