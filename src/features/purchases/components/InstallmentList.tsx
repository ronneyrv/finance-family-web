import { CalendarDays, CheckCircle2, Clock3 } from 'lucide-react'

import { formatCurrency } from '../../../lib/formatters/currency'
import type { InstallmentResponse } from '../model/purchaseTypes'

type InstallmentListProps = {
  installments: InstallmentResponse[]
}

function InstallmentList({ installments }: InstallmentListProps) {
  if (installments.length === 0) {
    return null
  }

  const purchaseDescription = installments[0].description
  const totalAmount = installments.reduce((total, installment) => total + installment.amount, 0)

  return (
    <section className="mt-8 rounded-xl border border-slate-800 bg-slate-950 p-4 sm:p-6">
      <div>
        <p className="text-sm font-medium text-emerald-400">Compra registrada</p>

        <h2 className="mt-1 text-lg font-semibold">{purchaseDescription}</h2>

        <p className="mt-2 text-sm text-slate-400">
          {installments.length} {installments.length === 1 ? 'parcela' : 'parcelas'} geradas ·{' '}
          {formatCurrency(totalAmount)}
        </p>
      </div>

      <div className="mt-6 space-y-3">
        {installments.map((installment) => (
          <article
            key={installment.id}
            className="flex flex-col gap-4 rounded-lg border border-slate-800 bg-slate-900/50 p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-slate-800 p-2 text-slate-400">
                <CalendarDays size={18} />
              </div>

              <div>
                <p className="font-medium">
                  Parcela {installment.installmentNumber}/{installment.totalInstallments}
                </p>

                <p className="mt-1 text-sm text-slate-400">
                  Fatura {String(installment.invoiceMonth).padStart(2, '0')}/
                  {installment.invoiceYear}
                </p>
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
                    Paga
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

export default InstallmentList
