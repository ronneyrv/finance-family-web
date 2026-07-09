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
    <section className="rounded-xl border border-slate-800 bg-slate-950 p-4 sm:p-6">
      <div>
        <h2 className="text-lg font-semibold">Projeção financeira</h2>

        <p className="mt-1 text-sm text-slate-400">
          Previsão mensal baseada em receitas e despesas recorrentes e parcelas futuras do cartão.
        </p>
      </div>

      {chartData.length === 0 ? (
        <p className="mt-6 text-sm text-slate-400">Nenhuma projeção encontrada para o período.</p>
      ) : (
        <div className="mt-6 h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
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
