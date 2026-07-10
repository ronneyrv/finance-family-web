import { useState, type SubmitEvent } from 'react'

import type { FinancialAccountResponse } from '../../financial-accounts/model/financialAccountTypes'
import { formatCurrency } from '../../../lib/formatters/currency'
import { ApiError } from '../../../lib/api/apiError'
import { paymentMethodLabels } from '../../transactions/model/paymentMethods'
import type { PaymentMethod } from '../../transactions/model/transactionTypes'
import { invoicesApi } from '../api/invoicesApi'

type InvoicePaymentFormProps = {
  creditCardId: string
  month: number
  year: number
  financialAccounts: FinancialAccountResponse[]
  onPaid: () => Promise<void>
}

const invoicePaymentMethods: PaymentMethod[] = ['PIX', 'CASH', 'DEBIT_CARD', 'BANK_TRANSFER']

function InvoicePaymentForm({
  creditCardId,
  month,
  year,
  financialAccounts,
  onPaid,
}: InvoicePaymentFormProps) {
  const [accountId, setAccountId] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | ''>('')

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!paymentMethod) {
      return
    }

    try {
      setIsSubmitting(true)
      setErrorMessage(null)

      await invoicesApi.pay(creditCardId, month, year, {
        accountId,
        paymentMethod,
      })

      await onPaid()
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(error.message)
      } else {
        setErrorMessage('Não foi possível pagar a fatura.')
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
        <p className="text-sm font-medium text-emerald-400">Pagamento</p>

        <h2 className="mt-1 text-lg font-semibold">Pagar fatura</h2>

        <p className="mt-2 text-sm text-slate-400">
          Selecione a conta de origem e a forma utilizada para o pagamento.
        </p>
      </div>

      {financialAccounts.length === 0 ? (
        <div className="mt-6 rounded-lg border border-amber-500/20 bg-amber-500/10 p-4">
          <p className="text-sm text-amber-300">
            Cadastre uma conta financeira antes de pagar a fatura.
          </p>
        </div>
      ) : (
        <>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <label>
              <span className="text-sm text-slate-300">Conta financeira</span>

              <select
                required
                value={accountId}
                onChange={(event) => setAccountId(event.target.value)}
                className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5"
              >
                <option value="">Selecione uma conta</option>

                {financialAccounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.name} · {formatCurrency(account.currentBalance)}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span className="text-sm text-slate-300">Forma de pagamento</span>

              <select
                required
                value={paymentMethod}
                onChange={(event) => setPaymentMethod(event.target.value as PaymentMethod | '')}
                className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5"
              >
                <option value="">Selecione uma forma</option>

                {invoicePaymentMethods.map((method) => (
                  <option key={method} value={method}>
                    {paymentMethodLabels[method]}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {errorMessage && <p className="mt-4 text-sm text-red-400">{errorMessage}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-6 w-full rounded-lg bg-emerald-500 px-4 py-2.5 font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {isSubmitting ? 'Pagando...' : 'Pagar fatura'}
          </button>
        </>
      )}
    </form>
  )
}

export default InvoicePaymentForm
