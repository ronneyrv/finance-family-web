import CategoryDistribution from './CategoryDistribution'
import type { CategoryExpenseResponse } from '../model/dashboardTypes'

type CategoryExpensesProps = {
  expenses: CategoryExpenseResponse[]
  year: number
}

function CategoryExpenses({ expenses, year }: CategoryExpensesProps) {
  return (
    <CategoryDistribution
      items={expenses}
      title="Despesa anual"
      description={`Distribuição por categoria de ${year}.`}
      emptyMessage="Nenhuma despesa registrada para exibição."
      variant="expense"
    />
  )
}

export default CategoryExpenses
