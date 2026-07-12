import { useState, type SubmitEvent } from 'react'

import { ApiError } from '../../../lib/api/apiError'
import { financialAccountsApi } from '../api/financialAccountsApi'
import type { AccountType, FinancialAccountResponse } from '../model/financialAccountTypes'
import { fieldClassName } from '../../../components/ui/forms/fieldClass'

type FinancialAccountFormProps = {
  financialAccount?: FinancialAccountResponse
  onCreated?: (financialAccount: FinancialAccountResponse) => void
  onUpdated?: (financialAccount: FinancialAccountResponse) => void
  onCancelEdit?: () => void
}

const accountTypeLabels: Record<AccountType, string> = {
  CHECKING_ACCOUNT: 'Conta corrente',
  SAVINGS_ACCOUNT: 'Conta poupança',
  DIGITAL_ACCOUNT: 'Conta digital',
  CASH: 'Dinheiro',
}

function FinancialAccountForm({
  financialAccount,
  onCreated,
  onUpdated,
  onCancelEdit,
}: FinancialAccountFormProps) {
  const [name, setName] = useState(financialAccount?.name ?? '')
  const [accountType, setAccountType] = useState<AccountType>(
    financialAccount?.accountType ?? 'CHECKING_ACCOUNT',
  )
  const [initialBalance, setInitialBalance] = useState(
    financialAccount ? String(financialAccount.initialBalance) : '',
  )

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()

    try {
      setIsSubmitting(true)
      setErrorMessage(null)

      const request = {
        name,
        accountType,
        initialBalance: Number(initialBalance),
      }

      if (financialAccount) {
        const updatedFinancialAccount = await financialAccountsApi.update(
          financialAccount.id,
          request,
        )

        onUpdated?.(updatedFinancialAccount)
      } else {
        const createdFinancialAccount = await financialAccountsApi.create(request)

        onCreated?.(createdFinancialAccount)

        setName('')
        setAccountType('CHECKING_ACCOUNT')
        setInitialBalance('')
      }
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(error.message)
      } else {
        setErrorMessage(
          financialAccount
            ? 'Não foi possível atualizar a conta financeira.'
            : 'Não foi possível cadastrar a conta financeira.',
        )
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 rounded-xl border border-(--color-border) bg-(--color-surface) p-4"
    >
      <div>
        <h2 className="text-lg font-semibold">
          {financialAccount ? 'Editar conta' : 'Nova conta financeira'}
        </h2>

        <p className="mt-1 text-sm text-(--color-text-muted)">
          {financialAccount
            ? 'Atualize as informações da conta financeira.'
            : 'Cadastre uma conta para acompanhar seus saldos e pagamentos.'}
        </p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label>
          <span className="text-sm text-(--color-text)">Nome da conta</span>

          <input
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Ex.: Nubank"
            className={fieldClassName}
          />
        </label>

        <label>
          <span className="text-sm text-(--color-text)">Tipo da conta</span>

          <select
            value={accountType}
            onChange={(event) => setAccountType(event.target.value as AccountType)}
            className={fieldClassName}
          >
            {Object.entries(accountTypeLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <label className="sm:col-span-2">
          <span className="text-sm text-(--color-text)">Saldo inicial</span>

          <input
            required
            type="number"
            inputMode="decimal"
            step="0.01"
            value={initialBalance}
            onChange={(event) => setInitialBalance(event.target.value)}
            placeholder="0,00"
            className={`${fieldClassName} [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
          />
        </label>
      </div>

      {errorMessage && <p className="mt-4 text-sm text-red-400">{errorMessage}</p>}

      <div className="mt-6 flex flex-col gap-3 border-t border-(--color-border) pt-4 sm:flex-row">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-emerald-500 px-4 py-2.5 font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {isSubmitting
            ? 'Salvando...'
            : financialAccount
              ? 'Salvar alterações'
              : 'Cadastrar conta'}
        </button>

        {financialAccount && (
          <button
            type="button"
            onClick={onCancelEdit}
            disabled={isSubmitting}
            className="w-full rounded-lg border border-(--color-border) px-4 py-2.5 font-medium text-(--color-text) transition hover:bg-(--color-surface-hover) disabled:opacity-50 sm:w-auto"
          >
            Cancelar edição
          </button>
        )}
      </div>
    </form>
  )
}

export default FinancialAccountForm
