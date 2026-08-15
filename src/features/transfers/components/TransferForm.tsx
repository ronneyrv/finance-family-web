import { useState, type SubmitEvent } from 'react'

import MoneyInput from '../../../components/ui/money/MoneyInput'
import { Button } from '../../../components/ui/button'
import { fieldClassName } from '../../../components/ui/forms/fieldClass'
import { useNotification } from '../../../app/providers/useNotification'
import { parseCurrencyInput } from '../../../lib/parsers/currency'
import { getApiErrorMessage } from '../../../lib/api/getApiErrorMessage'
import { transfersApi } from '../api/transfersApi'
import type { FinancialAccountResponse } from '../../financial-accounts/model/financialAccountTypes'

type TransferFormProps = {
  financialAccounts: FinancialAccountResponse[]
  onSuccess?: () => void
  onCancel?: () => void
}

function TransferForm({ financialAccounts, onSuccess, onCancel }: TransferFormProps) {
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [transactionDate, setTransactionDate] = useState('')
  const [sourceAccountId, setSourceAccountId] = useState('')
  const [destinationAccountId, setDestinationAccountId] = useState('')

  const [isSubmitting, setIsSubmitting] = useState(false)

  const { notify } = useNotification()

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()

    try {
      setIsSubmitting(true)

      if (sourceAccountId === destinationAccountId) {
        notify.error('A conta de origem e a conta de destino devem ser diferentes.')
        return
      }

      await transfersApi.create({
        description,
        amount: parseCurrencyInput(amount),
        transactionDate,
        sourceAccountId,
        destinationAccountId,
      })

      setDescription('')
      setAmount('')
      setTransactionDate('')
      setSourceAccountId('')
      setDestinationAccountId('')

      notify.success('Transferência realizada com sucesso.')

      onSuccess?.()
    } catch (error) {
      notify.error(getApiErrorMessage(error, 'Não foi possível realizar a transferência.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <label>
          <span className="text-sm text-(--color-text)">Descrição</span>

          <input
            required
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Ex.: Aporte na poupança"
            className={fieldClassName}
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label>
            <span className="text-sm text-(--color-text)">Conta de origem</span>

            <select
              required
              value={sourceAccountId}
              onChange={(event) => setSourceAccountId(event.target.value)}
              className={fieldClassName}
            >
              <option value="">Selecione</option>

              {financialAccounts.map((financialAccount) => (
                <option key={financialAccount.id} value={financialAccount.id}>
                  {financialAccount.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span className="text-sm text-(--color-text)">Conta de destino</span>

            <select
              required
              value={destinationAccountId}
              onChange={(event) => setDestinationAccountId(event.target.value)}
              className={fieldClassName}
            >
              <option value="">Selecione</option>

              {financialAccounts.map((financialAccount) => (
                <option key={financialAccount.id} value={financialAccount.id}>
                  {financialAccount.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label>
            <span className="text-sm text-(--color-text)">Valor</span>

            <MoneyInput required placeholder="0,00" value={amount} onChange={setAmount} />
          </label>

          <label>
            <span className="text-sm text-(--color-text)">Data</span>

            <input
              required
              type="date"
              value={transactionDate}
              onChange={(event) => setTransactionDate(event.target.value)}
              className={fieldClassName}
            />
          </label>
        </div>
      </div>

      <div className="mt-6 flex flex-col-reverse gap-3 border-t border-(--color-border) pt-4 sm:flex-row sm:justify-end">
        <Button type="button" variant="secondary" disabled={isSubmitting} onClick={onCancel}>
          Cancelar
        </Button>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Transferindo...' : 'Transferir'}
        </Button>
      </div>
    </form>
  )
}

export default TransferForm
