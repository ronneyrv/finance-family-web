import { UsersRound } from 'lucide-react'

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { formatCurrency } from '../../../lib/formatters/currency'
import { monthLabels } from '../utils/monthLabels'
import type { CashFlowResponse } from '../model/dashboardTypes'

type CashFlowChartProps = {
  data: CashFlowResponse[]
}

function CashFlowChart({ data }: CashFlowChartProps) {
  const chartData = data.map((item) => ({
    ...item,
    monthLabel: monthLabels[item.month],
  }))

  return (
    <section className="rounded-xl border border-(--color-border) bg-(--color-surface) p-4">
      <div>
        <div className="flex items-center gap-1.5">
          <h2 className="text-lg font-semibold">Fluxo de caixa</h2>

          <UsersRound size={15} className="text-(--color-text-muted)" aria-label="Família" />
        </div>

        <p className="mt-1 text-sm text-slate-400">
          Comparativo mensal entre entradas e saídas realizadas ao longo do ano.
        </p>
      </div>

      {chartData.length === 0 ? (
        <p className="mt-6 text-sm text-(--color-text-muted)">
          Nenhuma movimentação encontrada para o período.
        </p>
      ) : (
        <div className="mt-6 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid
                horizontal
                vertical={false}
                stroke="var(--color-border)"
                strokeDasharray="4 4"
              />

              <XAxis
                dataKey="monthLabel"
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: 'var(--color-text-muted)',
                  fontSize: 12,
                }}
                dy={8}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                width={55}
                tick={{
                  fill: 'var(--color-text-muted)',
                  fontSize: 12,
                }}
                tickFormatter={(value: number) =>
                  new Intl.NumberFormat('pt-BR', {
                    notation: 'compact',
                    compactDisplay: 'short',
                  }).format(value)
                }
              />

              <Tooltip
                formatter={(value) => formatCurrency(Number(value))}
                contentStyle={{
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '12px',
                  color: 'var(--color-text)',
                  boxShadow: '0 8px 24px rgba(0,0,0,.25)',
                }}
                labelStyle={{
                  color: 'var(--color-text-muted)',
                }}
              />

              <Legend
                iconType="circle"
                iconSize={8}
                wrapperStyle={{
                  paddingTop: 12,
                  fontSize: 12,
                }}
              />

              <Line
                type="monotone"
                dataKey="income"
                name="Entradas"
                stroke="#34d399"
                strokeWidth={2}
                dot={{ r: 3 }}
              />

              <Line
                type="monotone"
                dataKey="expense"
                name="Saídas"
                stroke="#fb7185"
                strokeWidth={2}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  )
}

export default CashFlowChart
