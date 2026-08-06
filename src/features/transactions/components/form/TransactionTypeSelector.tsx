import { ArrowDownCircle, ArrowUpCircle } from 'lucide-react'

import { SegmentedButton } from '../../../../components/ui/button'
import type { TransactionType } from '../../model/transactionTypes'

type TransactionTypeSelectorProps = {
  value: TransactionType
  onChange: (value: TransactionType) => void
}

function TransactionTypeSelector({ value, onChange }: TransactionTypeSelectorProps) {
  return (
    <fieldset className="sm:col-span-2">
      <legend className="text-sm font-medium text-(--color-text)">Tipo</legend>

      <div className="mt-2 grid grid-cols-2 gap-3">
        <SegmentedButton
          selected={value === 'INCOME'}
          icon={<ArrowUpCircle size={16} />}
          onClick={() => onChange('INCOME')}
        >
          Receita
        </SegmentedButton>

        <SegmentedButton
          selected={value === 'EXPENSE'}
          icon={<ArrowDownCircle size={16} />}
          onClick={() => onChange('EXPENSE')}
        >
          Despesa
        </SegmentedButton>
      </div>
    </fieldset>
  )
}

export default TransactionTypeSelector
