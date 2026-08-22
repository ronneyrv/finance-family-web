import CategoryDistribution from './CategoryDistribution'
import type { CategoryExpenseResponse } from '../model/dashboardTypes'

type MonthlyCategoryIncomesProps = {
  incomes: CategoryExpenseResponse[]
  month: number
  year: number
}

function MonthlyCategoryIncomes({ incomes, month, year }: MonthlyCategoryIncomesProps) {
  const monthLabel = new Intl.DateTimeFormat('pt-BR', {
    month: 'long',
  }).format(new Date(year, month - 1, 1))

  return (
    <CategoryDistribution
      items={incomes}
      title="Receita mensal"
      description={`Distribuição por subcategoria em ${monthLabel} de ${year}.`}
      emptyMessage="Nenhuma receita registrada para exibição."
      variant="income"
    />
  )
}

export default MonthlyCategoryIncomes
