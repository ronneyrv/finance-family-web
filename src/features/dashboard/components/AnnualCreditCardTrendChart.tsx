import {
  Bar,
  CartesianGrid,
  ComposedChart,
  LabelList,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { formatCurrency } from '../../../lib/formatters/currency'
import type { CreditCardExpenseTrendResponse, Month } from '../model/dashboardTypes'

type AnnualCreditCardTrendChartProps = {
  data: CreditCardExpenseTrendResponse[]
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

const COLORS = [
  '#3b82f6',
  '#10b981',
  '#f59e0b',
  '#8b5cf6',
  '#ef4444',
  '#06b6d4',
  '#84cc16',
  '#f97316',
]

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

function AnnualCreditCardTrendChart({ data }: AnnualCreditCardTrendChartProps) {
  const cardNames = Array.from(
    new Set(data.flatMap((month) => month.cards.map((card) => card.cardName))),
  )

  const chartData = data.map((month) => {
    const cardValues = Object.fromEntries(month.cards.map((card) => [card.cardName, card.amount]))

    return {
      monthLabel: monthLabels[month.month],
      total: month.total,
      ...cardValues,
    }
  })

  return (
    <section className="rounded-xl border border-(--color-border) bg-(--color-surface) p-4">
      <div>
        <h2 className="text-lg font-semibold">Projeção das faturas</h2>

        <p className="mt-1 text-sm text-slate-400">
          Comparativo mensal entre as despesas de cada cartão de crédito e o total consolidado.
        </p>
      </div>

      {chartData.length === 0 ? (
        <p className="mt-6 text-sm text-(--color-text-muted)">
          Nenhuma movimentação encontrada para o período.
        </p>
      ) : (
        <div className="mt-6 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData}>
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

              <Line
                type="monotone"
                dataKey="total"
                name="Total"
                stroke="#ffffff"
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              >
                <LabelList dataKey="total" content={<CustomLineLabel />} />
              </Line>

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

              {cardNames.map((cardName, index) => (
                <Bar
                  key={cardName}
                  dataKey={cardName}
                  name={cardName}
                  fill={COLORS[index % COLORS.length]}
                  radius={[4, 4, 0, 0]}
                />
              ))}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  )
}

export default AnnualCreditCardTrendChart
