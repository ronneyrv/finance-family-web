import { formatCurrency } from '../../../lib/formatters/currency'
import { useBalanceVisibility } from '../../../app/providers/useBalanceVisibility'

type MoneyProps = {
  value: number
  hiddenValue?: string
}

function Money({ value, hiddenValue = '••••••' }: MoneyProps) {
  const { isVisible } = useBalanceVisibility()

  return isVisible ? formatCurrency(value) : hiddenValue
}

export default Money
