import CategoryDistribution from './CategoryDistribution'
import type { CategoryExpenseResponse } from '../model/dashboardTypes'

type MonthlyCategoryExpensesProps = {
  expenses: CategoryExpenseResponse[]
  month: number
  year: number
}

function MonthlyCategoryExpenses({ expenses, month, year }: MonthlyCategoryExpensesProps) {
  const monthLabel = new Intl.DateTimeFormat('pt-BR', {
    month: 'long',
  }).format(new Date(year, month - 1, 1))

  return (
    <CategoryDistribution
      items={expenses}
      title="Despesa mensal"
      description={`Distribuição por categoria em ${monthLabel} de ${year}.`}
      emptyMessage="Nenhuma despesa registrada para exibição."
    />
  )
}

export default MonthlyCategoryExpenses
