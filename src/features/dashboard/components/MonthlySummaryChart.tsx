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
import type { Month, MonthlySummaryResponse } from '../model/dashboardTypes'

type MonthlySummaryChartProps = {
  data: MonthlySummaryResponse[]
}

const monthLabels: Record<Month, string> = {
  JANUARY: 'Jan',
  FEBRUARY: 'Fev',
  MARCH: 'Mar',
  APRIL: 'Abr',
  MAY: 'Mai',
  JUNE: 'Jun',
  JULY: 'Jul',
  AUGUST: 'Ago',
  SEPTEMBER: 'Set',
  OCTOBER: 'Out',
  NOVEMBER: 'Nov',
  DECEMBER: 'Dez',
}

function MonthlySummaryChart({ data }: MonthlySummaryChartProps) {
  const chartData = data.map((item) => ({
    ...item,
    monthLabel: monthLabels[item.month],
  }))

  return (
    <section className="rounded-xl border border-(--color-border) bg-(--color-surface) p-4">
      <div>
        <h2 className="text-lg font-semibold">Evolução mensal</h2>

        <p className="mt-1 text-sm text-slate-400">
          Comparativo mensal entre receitas, despesas e saldo.
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
                tick={{
                  fill: 'var(--color-text-muted)',
                  fontSize: 12,
                }}
                width={55}
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
                  color: 'var(--color-text)',
                  boxShadow: '0 8px 24px rgba(0,0,0,.25)',
                  borderRadius: '12px',
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
                name="Receitas"
                stroke="#34d399"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5 }}
              />

              <Line
                type="monotone"
                dataKey="expense"
                name="Despesas"
                stroke="#fb7185"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5 }}
              />

              <Line
                type="monotone"
                dataKey="balance"
                name="Saldo"
                stroke="#38bdf8"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  )
}

export default MonthlySummaryChart
