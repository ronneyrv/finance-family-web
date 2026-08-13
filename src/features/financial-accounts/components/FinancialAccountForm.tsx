import { useState, type SubmitEvent } from 'react'

import MoneyInput from '../../../components/ui/money/MoneyInput'
import { Card } from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import { fieldClassName } from '../../../components/ui/forms/fieldClass'
import { useNotification } from '../../../app/providers/useNotification'
import { parseCurrencyInput } from '../../../lib/parsers/currency'
import { getApiErrorMessage } from '../../../lib/api/getApiErrorMessage'
import { financialAccountsApi } from '../api/financialAccountsApi'
import { formatCurrencyInputValue } from '../../../lib/formatters/currencyInput'
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
    financialAccount ? formatCurrencyInputValue(financialAccount.initialBalance) : '',
  )

  const [isSubmitting, setIsSubmitting] = useState(false)
  const { notify } = useNotification()

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()

    try {
      setIsSubmitting(true)

      const request = {
        name,
        accountType,
        initialBalance: parseCurrencyInput(initialBalance),
      }

      if (financialAccount) {
        const updatedFinancialAccount = await financialAccountsApi.update(
          financialAccount.id,
          request,
        )

        onUpdated?.(updatedFinancialAccount)

        notify.success('Conta financeira atualizada com sucesso.')
      } else {
        const createdFinancialAccount = await financialAccountsApi.create(request)

        onCreated?.(createdFinancialAccount)

        setName('')
        setAccountType('CHECKING_ACCOUNT')
        setInitialBalance('')

        notify.success('Conta financeira cadastrada com sucesso.')
      }
    } catch (error) {
      notify.error(
        getApiErrorMessage(
          error,
          financialAccount
            ? 'Não foi possível atualizar a conta financeira.'
            : 'Não foi possível cadastrar a conta financeira.',
        ),
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="mt-8">
      <form onSubmit={handleSubmit}>
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

            <MoneyInput
              required
              placeholder="0,00"
              value={initialBalance}
              onChange={setInitialBalance}
            />
          </label>
        </div>

        <div className="mt-6 flex flex-col gap-3 border-t border-(--color-border) pt-4 sm:flex-row">
          <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
            {isSubmitting
              ? 'Salvando...'
              : financialAccount
                ? 'Salvar alterações'
                : 'Cadastrar conta'}
          </Button>

          {financialAccount && (
            <Button
              type="button"
              variant="secondary"
              onClick={onCancelEdit}
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              Cancelar edição
            </Button>
          )}
        </div>
      </form>
    </Card>
  )
}

export default FinancialAccountForm
