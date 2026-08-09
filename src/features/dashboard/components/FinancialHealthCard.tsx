import { formatCurrency } from '../../../lib/formatters/currency'
import { Card } from '../../../components/ui/card'
import type { FinancialHealthLevel, FinancialHealthResponse } from '../model/dashboardTypes'

type FinancialHealthCardProps = {
  data: FinancialHealthResponse
}

const healthLevelLabels: Record<FinancialHealthLevel, string> = {
  EXCELLENT: 'Excelente',
  GOOD: 'Boa',
  MODERATE: 'Moderada',
  WEAK: 'Fraca',
  CRITICAL: 'Crítica',
}

const healthLevelStyles: Record<FinancialHealthLevel, string> = {
  EXCELLENT: 'text-emerald-400',
  GOOD: 'text-green-400',
  MODERATE: 'text-amber-400',
  WEAK: 'text-orange-400',
  CRITICAL: 'text-rose-400',
}

const healthLevelProgressStyles: Record<FinancialHealthLevel, string> = {
  EXCELLENT: 'bg-emerald-400',
  GOOD: 'bg-green-400',
  MODERATE: 'bg-amber-400',
  WEAK: 'bg-orange-400',
  CRITICAL: 'bg-rose-400',
}

function FinancialHealthCard({ data }: FinancialHealthCardProps) {
  const { totalAssets, totalLiabilities, netWorth, healthScore, healthLevel } = data

  const progressWidth = Math.min(Math.max(healthScore, 0), 100)

  return (
    <Card>
      <div>
        <h2 className="text-base font-semibold text-(--color-text)">Saúde financeira da família</h2>

        <p className="mt-1 text-sm text-slate-400">
          Acompanhe a situação patrimonial atual da família.
        </p>
      </div>

      <div className="mt-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm text-(--color-text-muted)">Patrimônio líquido</p>

            <p className="mt-1 text-2xl font-semibold">{formatCurrency(netWorth)}</p>
          </div>

          <div className="text-right">
            <p className="text-sm text-(--color-text-muted)">Saúde financeira</p>

            <p className={`mt-1 text-2xl font-semibold ${healthLevelStyles[healthLevel]}`}>
              {healthScore.toFixed(2)}%
            </p>
          </div>
        </div>

        <div className="mt-5">
          <div className="h-3 overflow-hidden rounded-full bg-(--color-border)">
            <div
              className={`h-full rounded-full transition-all ${healthLevelProgressStyles[healthLevel]}`}
              style={{
                width: `${progressWidth}%`,
              }}
            />
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm text-(--color-text-muted)">Nível de saúde</span>

          <span className={`text-sm font-semibold ${healthLevelStyles[healthLevel]}`}>
            {healthLevelLabels[healthLevel]}
          </span>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 border-t border-(--color-border) pt-5">
        <div>
          <p className="text-xs text-(--color-text-muted)">Ativos</p>

          <p className="mt-1 font-medium">{formatCurrency(totalAssets)}</p>
        </div>

        <div>
          <p className="text-xs text-(--color-text-muted)">Passivos</p>

          <p className="mt-1 font-medium">{formatCurrency(totalLiabilities)}</p>
        </div>
      </div>
    </Card>
  )
}

export default FinancialHealthCard
