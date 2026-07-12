import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { formatCurrency } from '../../../lib/formatters/currency'
import type { Month, MonthlyProjectionResponse } from '../model/dashboardTypes'

type MonthlyProjectionChartProps = {
  data: MonthlyProjectionResponse[]
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

function MonthlyProjectionChart({ data }: MonthlyProjectionChartProps) {
  const chartData = data.map((item) => ({
    ...item,
    monthLabel: monthLabels[item.month],
  }))

  return (
    <section className="rounded-xl border border-(--color-border) bg-(--color-surface) p-4">
      <div>
        <h2 className="text-lg font-semibold">Projeção financeira</h2>

        <p className="mt-1 text-sm text-slate-400">
          Previsão mensal baseada em receitas e despesas recorrentes e parcelas futuras do cartão.
        </p>
      </div>

      {chartData.length === 0 ? (
        <p className="mt-6 text-sm text-(--color-text-muted)">
          Nenhuma projeção encontrada para o período.
        </p>
      ) : (
        <div className="mt-6 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} barCategoryGap="28%">
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

              <Bar
                dataKey="projectedIncome"
                name="Receitas previstas"
                fill="#34d399"
                radius={[4, 4, 0, 0]}
              />

              <Bar
                dataKey="projectedTotalExpense"
                name="Despesas previstas"
                fill="#fb7185"
                radius={[4, 4, 0, 0]}
              />

              <Bar
                dataKey="projectedBalance"
                name="Saldo projetado"
                fill="#38bdf8"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  )
}

export default MonthlyProjectionChart
