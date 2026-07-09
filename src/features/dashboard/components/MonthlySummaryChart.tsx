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
    <section className="rounded-xl border border-slate-800 bg-slate-950 p-4 sm:p-6">
      <div>
        <h2 className="text-lg font-semibold">Evolução mensal</h2>

        <p className="mt-1 text-sm text-slate-400">
          Comparativo mensal entre receitas, despesas e saldo.
        </p>
      </div>

      {chartData.length === 0 ? (
        <p className="mt-6 text-sm text-slate-400">
          Nenhuma movimentação encontrada para o período.
        </p>
      ) : (
        <div className="mt-6 h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid horizontal vertical={false} stroke="#1e293b" />
              <XAxis
                dataKey="monthLabel"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94a3b8', fontSize: 12 }}
                dy={8}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94a3b8', fontSize: 12 }}
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
                  backgroundColor: '#0f172a',
                  border: '1px solid #334155',
                  borderRadius: '12px',
                }}
                labelStyle={{ color: '#cbd5e1' }}
              />

              <Legend iconType="circle" iconSize={8} wrapperStyle={{ paddingTop: '20px' }} />

              <Line
                type="monotone"
                dataKey="income"
                name="Receitas"
                stroke="#34d399"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 5 }}
              />

              <Line
                type="monotone"
                dataKey="expense"
                name="Despesas"
                stroke="#fb7185"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 5 }}
              />

              <Line
                type="monotone"
                dataKey="balance"
                name="Saldo"
                stroke="#38bdf8"
                strokeWidth={3}
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
