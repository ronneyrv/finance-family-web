import { CheckCircle2, Clock3, ReceiptText } from 'lucide-react'

import { formatCurrency } from '../../../lib/formatters/currency'
import { formatDate } from '../../../lib/formatters/date'
import type { InvoiceInstallmentResponse } from '../model/invoiceTypes'

type InvoiceInstallmentListProps = {
  installments: InvoiceInstallmentResponse[]
}

function InvoiceInstallmentList({ installments }: InvoiceInstallmentListProps) {
  if (installments.length === 0) {
    return (
      <div className="mt-8 rounded-xl border border-slate-800 bg-slate-950 p-8 text-center">
        <ReceiptText className="mx-auto text-slate-500" size={32} />

        <p className="mt-4 font-medium">Nenhum lançamento nesta fatura</p>

        <p className="mt-2 text-sm text-slate-400">
          Não existem parcelas vinculadas ao período selecionado.
        </p>
      </div>
    )
  }

  return (
    <section className="mt-8 rounded-xl border border-slate-800 bg-slate-950 p-4 sm:p-6">
      <div>
        <p className="text-sm font-medium text-emerald-400">Lançamentos</p>

        <h2 className="mt-1 text-lg font-semibold">Parcelas da fatura</h2>

        <p className="mt-2 text-sm text-slate-400">
          {installments.length} {installments.length === 1 ? 'lançamento' : 'lançamentos'}
        </p>
      </div>

      <div className="mt-6 space-y-3">
        {installments.map((installment, index) => (
          <article
            key={`${installment.description}-${installment.installment}-${index}`}
            className="flex flex-col gap-4 rounded-lg border border-slate-800 bg-slate-900/50 p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-slate-800 p-2 text-slate-400">
                <ReceiptText size={18} />
              </div>

              <div>
                <p className="font-medium">{installment.description}</p>

                <p className="mt-1 text-sm text-slate-400">Parcela {installment.installment}</p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end sm:gap-2">
              <p className="font-semibold">{formatCurrency(installment.amount)}</p>

              <span
                className={
                  installment.paid
                    ? 'inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400'
                    : 'inline-flex items-center gap-1.5 text-xs font-medium text-amber-400'
                }
              >
                {installment.paid ? (
                  <>
                    <CheckCircle2 size={14} />
                    {installment.paidAt ? `Paga em ${formatDate(installment.paidAt)}` : 'Paga'}
                  </>
                ) : (
                  <>
                    <Clock3 size={14} />
                    Pendente
                  </>
                )}
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default InvoiceInstallmentList
