import { useState, type SubmitEvent } from 'react'

import { ApiError } from '../../../lib/api/apiError'
import { financialAccountsApi } from '../api/financialAccountsApi'
import type { AccountType, FinancialAccountResponse } from '../model/financialAccountTypes'

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
      className="mt-8 rounded-xl border border-slate-800 bg-slate-950 p-4 sm:p-6"
    >
      <div>
        <h2 className="text-lg font-semibold">
          {financialAccount ? 'Editar conta' : 'Nova conta financeira'}
        </h2>

        <p className="mt-1 text-sm text-slate-400">
          {financialAccount
            ? 'Atualize as informações da conta financeira.'
            : 'Cadastre uma conta para acompanhar seus saldos e pagamentos.'}
        </p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label>
          <span className="text-sm text-slate-300">Nome da conta</span>

          <input
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Ex.: Nubank"
            className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5"
          />
        </label>

        <label>
          <span className="text-sm text-slate-300">Tipo da conta</span>

          <select
            value={accountType}
            onChange={(event) => setAccountType(event.target.value as AccountType)}
            className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5"
          >
            {Object.entries(accountTypeLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <label className="sm:col-span-2">
          <span className="text-sm text-slate-300">Saldo inicial</span>

          <input
            required
            type="number"
            inputMode="decimal"
            step="0.01"
            value={initialBalance}
            onChange={(event) => setInitialBalance(event.target.value)}
            placeholder="0,00"
            className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
        </label>
      </div>

      {errorMessage && <p className="mt-4 text-sm text-red-400">{errorMessage}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 w-full rounded-lg bg-emerald-500 px-4 py-2.5 font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {isSubmitting ? 'Salvando...' : financialAccount ? 'Salvar alterações' : 'Cadastrar conta'}
      </button>

      {financialAccount && (
        <button
          type="button"
          onClick={onCancelEdit}
          disabled={isSubmitting}
          className="mt-3 w-full rounded-lg border border-slate-700 px-4 py-2.5 font-medium text-slate-300 transition hover:bg-slate-900 disabled:opacity-50 sm:mt-0 sm:ml-3 sm:w-auto"
        >
          Cancelar edição
        </button>
      )}
    </form>
  )
}

export default FinancialAccountForm
