import type { FinancialAccountResponse } from '../../../financial-accounts/model/financialAccountTypes'

type FinancialAccountSelectorProps = {
  accounts: FinancialAccountResponse[]
  value: string
  onChange: (value: string) => void
}

function FinancialAccountSelector({ accounts, value, onChange }: FinancialAccountSelectorProps) {
  return (
    <label>
      <span className="text-sm text-slate-300">Conta financeira</span>

      <select
        required
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5"
      >
        <option value="">Selecione uma conta</option>

        {accounts.map((account) => (
          <option key={account.id} value={account.id}>
            {account.name}
          </option>
        ))}
      </select>
    </label>
  )
}

export default FinancialAccountSelector
