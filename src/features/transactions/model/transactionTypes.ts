export type TransactionType = 'INCOME' | 'EXPENSE'

export type PaymentMethod = 'PIX' | 'CASH' | 'DEBIT_CARD' | 'BANK_TRANSFER'

export type TransactionRequest = {
  description: string
  amount: number
  transactionDate: string
  type: TransactionType
  paymentMethod: PaymentMethod
  categoryId: string
  subCategoryId?: string
}

export type TransactionResponse = {
  id: string
  description: string
  amount: number
  transactionDate: string
  type: TransactionType
  paymentMethod: PaymentMethod
  categoryId: string
  category: string
  subCategoryId: string | null
  subCategory: string | null
}
