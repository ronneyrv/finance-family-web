import { CalendarDays, CreditCard, WalletCards } from 'lucide-react'

import { formatCurrency } from '../../../lib/formatters/currency'
import type { InvoiceResponse } from '../model/invoiceTypes'

type InvoiceSummaryProps = {
  invoice: InvoiceResponse
}

function InvoiceSummary({ invoice }: InvoiceSummaryProps) {
  return (
    <section className="mt-8">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <article className="rounded-xl border border-slate-800 bg-slate-950 p-4 sm:p-5">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-slate-400">Total da fatura</p>

            <CreditCard size={20} className="text-emerald-400" />
          </div>

          <p className="mt-3 text-xl font-semibold">{formatCurrency(invoice.total)}</p>
        </article>

        <article className="rounded-xl border border-slate-800 bg-slate-950 p-4 sm:p-5">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-slate-400">Limite disponível</p>

            <WalletCards size={20} className="text-emerald-400" />
          </div>

          <p className="mt-3 text-xl font-semibold">{formatCurrency(invoice.availableLimit)}</p>
        </article>

        <article className="rounded-xl border border-slate-800 bg-slate-950 p-4 sm:p-5">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-slate-400">Período</p>

            <CalendarDays size={20} className="text-emerald-400" />
          </div>

          <p className="mt-3 text-xl font-semibold">
            {String(invoice.month).padStart(2, '0')}/{invoice.year}
          </p>

          <p className="mt-2 text-xs text-slate-500">
            Fecha dia {invoice.closingDay} · Vence dia {invoice.dueDay}
          </p>
        </article>
      </div>
    </section>
  )
}

export default InvoiceSummary
