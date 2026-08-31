import type { FinancialAccountResponse } from '../../../financial-accounts/model/financialAccountTypes'

type FinancialAccountSelectorProps = {
  accounts: FinancialAccountResponse[]
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

function FinancialAccountSelector({
  accounts,
  value,
  onChange,
  disabled = false,
}: FinancialAccountSelectorProps) {
  return (
    <label htmlFor="financial-account">
      <span className="text-sm text-(--color-text)">Conta financeira</span>

      <select
        id="financial-account"
        required
        disabled={disabled}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-xl border border-(--color-border) bg-(--color-surface) px-3 py-2.5 text-(--color-text) transition focus:border-(--color-primary) focus:outline-none"
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
