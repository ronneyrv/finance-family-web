export type TransactionType = 'INCOME' | 'EXPENSE'

export type PaymentMethod = 'PIX' | 'CASH' | 'DEBIT_CARD' | 'BANK_TRANSFER'

export type TransactionKind = 'REGULAR' | 'CREDIT_CARD_PAYMENT'

export type TransactionRequest = {
  description: string
  amount: number
  transactionDate: string
  type: TransactionType
  paymentMethod: PaymentMethod
  accountId: string
  categoryId: string
  subCategoryId?: string
}

export type TransactionResponse = {
  id: string
  description: string
  amount: number
  transactionDate: string
  type: TransactionType
  transactionKind: TransactionKind
  paymentMethod: PaymentMethod
  accountId: string
  accountName: string
  categoryId: string | null
  category: string | null
  subCategoryId: string | null
  subCategory: string | null
}
