import type { PaymentMethod } from '../../transactions/model/transactionTypes'

export type InvoicePaymentRequest = {
  accountId: string
  paymentMethod: PaymentMethod
}

export type InvoiceInstallmentResponse = {
  description: string
  purchaseDate: string
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
  dueDate: string
  total: number
  availableLimit: number
  installments: InvoiceInstallmentResponse[]
}

export type PendingPurchaseResponse = {
  id: string
  description: string
  purchaseDate: string
  totalAmount: number
  installmentCount: number
  creditCardId: string
  creditCardName: string
  categoryId: string | null
  categoryName: string | null
  subCategoryId: string | null
  subCategoryName: string | null
}
