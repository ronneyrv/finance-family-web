import {
  Bar,
  BarChart,
  LabelList,
  Rectangle,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import type { RectangleProps } from 'recharts'

import { formatCurrency } from '../../../lib/formatters/currency'
import type { MonthlySummaryResponse } from '../model/dashboardTypes'
import { monthLabels } from '../utils/monthLabels'

type CustomBarLabelProps = {
  x?: number
  y?: number
  width?: number
  value?: number | string
}

function CustomBarLabel({ x, y, width, value }: CustomBarLabelProps) {
  if (x == null || y == null || width == null || value == null || Number(value) === 0) {
    return null
  }

  return (
    <text
      x={x + width / 2}
      y={y - 8}
      textAnchor="middle"
      fontSize={10}
      fontWeight={600}
      fill="var(--color-text)"
    >
      {formatCurrency(Number(value))}
    </text>
  )
}

type BalanceBarProps = RectangleProps & {
  payload?: MonthlySummaryResponse
  isMobile?: boolean
}

function BalanceBar({
  payload,
  isMobile = false,
  x = 0,
  y = 0,
  width = 0,
  height = 0,
}: BalanceBarProps) {
  const balance = payload?.balance ?? 0

  const centerX = x + width / 2
  const centerY = y + height / 2

  return (
    <>
      <Rectangle
        x={x}
        y={y}
        width={width}
        height={height}
        fill={balance >= 0 ? '#34d399' : '#fb7185'}
        radius={[6, 6, 0, 0]}
      />

      {isMobile && balance !== 0 && (
        <text
          x={centerX}
          y={centerY}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={9}
          fontWeight={700}
          fill="#fff"
          transform={`rotate(-90 ${centerX} ${centerY})`}
        >
          {new Intl.NumberFormat('pt-BR', {
            notation: 'compact',
            compactDisplay: 'short',
            maximumFractionDigits: 1,
          }).format(balance)}
        </text>
      )}
    </>
  )
}

type MonthlyResultChartProps = {
  data: MonthlySummaryResponse[]
}

function MonthlyResultChart({ data }: MonthlyResultChartProps) {
  const chartData = data.map((item) => ({
    ...item,
    monthLabel: monthLabels[item.month],
  }))
  const isMobile = window.innerWidth < 640

  return (
    <section className="rounded-xl border border-(--color-border) bg-(--color-surface) p-4">
      <div>
        <h2 className="text-lg font-semibold">Resultado mensal</h2>

        <p className="mt-1 text-sm text-slate-400">
          Resultado financeiro consolidado de cada mês, destacando saldos positivos e negativos.
        </p>
      </div>

      {chartData.length === 0 ? (
        <p className="mt-6 text-sm text-(--color-text-muted)">
          Nenhuma movimentação encontrada para o período.
        </p>
      ) : (
        <div className="mt-6 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} barCategoryGap="20%" barSize={88}>
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

              <ReferenceLine y={0} stroke="var(--color-border)" strokeWidth={1.5} />

              <Tooltip
                cursor={false}
                formatter={(value) => {
                  const amount = Number(value ?? 0)

                  return [
                    <span
                      style={{
                        color: amount >= 0 ? '#34d399' : '#fb7185',
                        fontWeight: 600,
                      }}
                    >
                      {formatCurrency(amount)}
                    </span>,
                    'Saldo',
                  ]
                }}
                labelFormatter={(label) => (
                  <span
                    style={{
                      color: 'var(--color-text)',
                      fontWeight: 600,
                    }}
                  >
                    {label}
                  </span>
                )}
                contentStyle={{
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '12px',
                  color: 'var(--color-text)',
                  boxShadow: '0 8px 24px rgba(0,0,0,.25)',
                }}
              />

              <Bar dataKey="balance" name="Saldo" shape={<BalanceBar isMobile={isMobile} />}>
                {!isMobile && <LabelList dataKey="balance" content={<CustomBarLabel />} />}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  )
}

export default MonthlyResultChart
