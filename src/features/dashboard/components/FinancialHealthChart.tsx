import { UserRound, UsersRound } from 'lucide-react'
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  LabelList,
  Legend,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { Card } from '../../../components/ui/card'
import { monthLabels } from '../utils/monthLabels'
import { formatCurrency } from '../../../lib/formatters/currency'
import type { CumulativeResultResponse } from '../model/dashboardTypes'

type FinancialHealthChartProps = {
  data: CumulativeResultResponse[]
  title: string
  description: string
  scope: 'individual' | 'family'
}

type CustomLabelProps = {
  x?: number
  y?: number
  value?: number | string
}

function CustomLineLabel({ x, y, value }: CustomLabelProps) {
  if (x == null || y == null || value == null) {
    return null
  }

  return (
    <text
      x={x}
      y={y - 12}
      fill="var(--color-text)"
      fontSize={9}
      fontWeight={600}
      textAnchor="middle"
      transform={`rotate(-35 ${x - 12} ${y - 12})`}
    >
      {formatCurrency(Number(value))}
    </text>
  )
}

function FinancialHealthChart({ data, title, description, scope }: FinancialHealthChartProps) {
  const chartData = data.map((item) => ({
    ...item,
    monthLabel: monthLabels[item.month],
  }))
  const ScopeIcon = scope === 'individual' ? UserRound : UsersRound

  return (
    <Card>
      <div>
        <div className="flex items-center gap-1.5">
          <h2 className="text-lg font-semibold">{title}</h2>

          <ScopeIcon
            size={15}
            className="text-(--color-text-muted)"
            aria-label={scope === 'individual' ? 'Individual' : 'Família'}
          />
        </div>

        <p className="mt-1 text-sm text-slate-400">{description}</p>
      </div>

      {chartData.length === 0 ? (
        <p className="mt-6 text-sm text-(--color-text-muted)">
          Nenhuma movimentação encontrada para o período.
        </p>
      ) : (
        <div className="mt-6 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={chartData}
              barCategoryGap="20%"
              margin={{ top: 55, right: 20, left: 10 }}
            >
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

              <ReferenceLine y={0} stroke="var(--color-border)" strokeWidth={1.5} />

              <Tooltip
                cursor={false}
                formatter={(value, name) => {
                  const labels: Record<string, string> = {
                    expense: 'Despesas',
                    income: 'Receitas',
                    accumulatedResult: 'Resultado acumulado',
                  }

                  return [formatCurrency(Number(value ?? 0)), labels[String(name)] ?? String(name)]
                }}
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

              <Bar dataKey="expense" name="Despesas" fill="#fb7185" radius={[6, 6, 0, 0]} />

              <Bar dataKey="income" name="Receitas" fill="#34d399" radius={[6, 6, 0, 0]} />

              <Line
                type="monotone"
                dataKey="accumulatedResult"
                name="Acumulado"
                stroke="#ffffff"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              >
                <LabelList dataKey="accumulatedResult" content={<CustomLineLabel />} />
              </Line>
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  )
}

export default FinancialHealthChart
