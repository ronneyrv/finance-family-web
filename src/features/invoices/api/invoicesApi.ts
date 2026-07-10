import { apiClient } from '../../../lib/api/apiClient'
import type { InvoicePaymentRequest, InvoiceResponse } from '../model/invoiceTypes'

function buildInvoiceQuery(month: number, year: number) {
  return new URLSearchParams({
    month: String(month),
    year: String(year),
  }).toString()
}

export const invoicesApi = {
  findByPeriod(creditCardId: string, month: number, year: number) {
    const query = buildInvoiceQuery(month, year)

    return apiClient.get<InvoiceResponse>(`/api/v1/credit-cards/${creditCardId}/invoice?${query}`)
  },

  pay(creditCardId: string, month: number, year: number, request: InvoicePaymentRequest) {
    const query = buildInvoiceQuery(month, year)

    return apiClient.post<void, InvoicePaymentRequest>(
      `/api/v1/credit-cards/${creditCardId}/invoice/pay?${query}`,
      request,
    )
  },
}
