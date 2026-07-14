import type { PaymentMethod, TransactionType } from '../../transactions/model/transactionTypes'

export type RecurringTransactionRequest = {
  description: string
  amount: number
  type: TransactionType
  paymentMethod: PaymentMethod
  dayOfMonth: number
  startDate: string
  endDate?: string
  categoryId: string
  subCategoryId?: string
}

export type RecurringTransactionResponse = {
  id: string
  description: string
  amount: number
  type: TransactionType
  paymentMethod: PaymentMethod
  dayOfMonth: number
  startDate: string
  endDate?: string
  active: boolean
  categoryId: string
  category: string
  subCategoryId?: string
  subCategory?: string
}
