import { CreditCard } from 'lucide-react'

import { formatCurrency } from '../../../lib/formatters/currency'
import type { CreditCardInvoiceSummaryResponse } from '../model/dashboardTypes'

type CreditCardInvoicesProps = {
  invoices: CreditCardInvoiceSummaryResponse[]
}

function CreditCardInvoices({ invoices }: CreditCardInvoicesProps) {
  return (
    <section className="rounded-xl border border-(--color-border) bg-(--color-surface) p-4">
      <div>
        <h2 className="text-lg font-semibold">Faturas do mês</h2>

        <p className="mt-1 text-sm text-(--color-text-muted)">
          Resumo das faturas abertas dos seus cartões de crédito.
        </p>
      </div>

      {invoices.length === 0 ? (
        <p className="mt-6 text-sm text-(--color-text-muted)">Nenhum cartão cadastrado.</p>
      ) : (
        <div className="mt-6 space-y-4">
          {invoices.map((invoice) => (
            <div
              key={invoice.creditCardId}
              className="flex items-center justify-between rounded-xl border border-(--color-border) p-4"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-(--color-primary)/10 p-2">
                  <CreditCard size={20} className="text-(--color-primary)" />
                </div>

                <div>
                  <p className="font-medium">{invoice.cardName}</p>

                  <p className="text-sm text-(--color-text-muted)">
                    {invoice.installmentCount} parcela
                    {invoice.installmentCount !== 1 && 's'}
                    {' • '}
                    Vence dia {invoice.dueDay}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="font-semibold">{formatCurrency(invoice.invoiceAmount)}</p>

                <p
                  className={`text-xs ${
                    invoice.hasOpenInvoice ? 'text-amber-400' : 'text-emerald-400'
                  }`}
                >
                  {invoice.hasOpenInvoice ? 'Em aberto' : 'Sem pendências'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export default CreditCardInvoices
