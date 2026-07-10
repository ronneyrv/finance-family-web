import type { PaymentMethod } from '../../transactions/model/transactionTypes'

export type InvoicePaymentRequest = {
  accountId: string
  paymentMethod: PaymentMethod
}

export type InvoiceInstallmentResponse = {
  description: string
  installment: string
  amount: number
  paid: boolean
  paidAt: string | null
}

export type InvoiceResponse = {
  card: string
  closingDay: number
  dueDay: number
  month: number
  year: number
  total: number
  availableLimit: number
  installments: InvoiceInstallmentResponse[]
}
