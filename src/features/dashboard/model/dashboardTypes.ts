export type Month =
  | 'JANUARY'
  | 'FEBRUARY'
  | 'MARCH'
  | 'APRIL'
  | 'MAY'
  | 'JUNE'
  | 'JULY'
  | 'AUGUST'
  | 'SEPTEMBER'
  | 'OCTOBER'
  | 'NOVEMBER'
  | 'DECEMBER'

export type DashboardSummaryResponse = {
  totalIncome: number
  totalExpense: number
  balance: number
  cashBalance: number
  bankBalance: number
}

export type CategoryExpenseResponse = {
  category: string
  amount: number
}

export type MonthlySummaryResponse = {
  month: Month
  income: number
  expense: number
  balance: number
}

export type MonthlyProjectionResponse = {
  month: Month
  projectedIncome: number
  projectedRecurringExpense: number
  projectedCreditCardExpense: number
  projectedTotalExpense: number
  projectedBalance: number
}

export type DashboardFiltersResponse = {
  years: number[]
  months: number[]
  defaultYear: number
  defaultMonth: number
}

export type CreditCardInvoiceSummaryResponse = {
  creditCardId: string
  cardName: string
  invoiceAmount: number
  installmentCount: number
  dueDay: number
  hasOpenInvoice: boolean
}

export type CreditCardTrendItemResponse = {
  cardName: string
  amount: number
}

export type CreditCardExpenseTrendResponse = {
  month: Month
  total: number
  cards: CreditCardTrendItemResponse[]
}
