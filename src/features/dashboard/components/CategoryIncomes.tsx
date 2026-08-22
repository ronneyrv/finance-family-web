import CategoryDistribution from './CategoryDistribution'
import type { CategoryExpenseResponse } from '../model/dashboardTypes'

type CategoryIncomesProps = {
  incomes: CategoryExpenseResponse[]
  year: number
}

function CategoryIncomes({ incomes, year }: CategoryIncomesProps) {
  return (
    <CategoryDistribution
      items={incomes}
      title="Receita anual"
      description={`Distribuição por subcategoria de ${year}.`}
      emptyMessage="Nenhuma receita registrada para exibição."
      variant="income"
    />
  )
}

export default CategoryIncomes
