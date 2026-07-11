import type { TransactionType } from '../../model/transactionTypes'

type TransactionTypeSelectorProps = {
  value: TransactionType
  onChange: (value: TransactionType) => void
}

function TransactionTypeSelector({ value, onChange }: TransactionTypeSelectorProps) {
  return (
    <label className="sm:col-span-2">
      <span className="text-sm text-slate-300">Tipo</span>

      <select
        value={value}
        onChange={(event) => onChange(event.target.value as TransactionType)}
        className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5"
      >
        <option value="EXPENSE">Despesa</option>
        <option value="INCOME">Receita</option>
      </select>
    </label>
  )
}

export default TransactionTypeSelector
