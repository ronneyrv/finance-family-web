import type { PaymentMethod, TransactionType } from './transactionTypes'

export const paymentMethodsByType: Record<TransactionType, PaymentMethod[]> = {
  INCOME: ['PIX', 'CASH', 'BANK_TRANSFER'],
  EXPENSE: ['PIX', 'CASH', 'DEBIT_CARD', 'CREDIT_CARD', 'BANK_TRANSFER'],
}

export const paymentMethodLabels: Record<PaymentMethod, string> = {
  PIX: 'PIX',
  CASH: 'Dinheiro',
  DEBIT_CARD: 'Débito',
  CREDIT_CARD: 'Crédito',
  BANK_TRANSFER: 'Transferência',
}
