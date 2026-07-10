export type AccountType = 'CHECKING_ACCOUNT' | 'SAVINGS_ACCOUNT' | 'DIGITAL_ACCOUNT' | 'CASH'

export type FinancialAccountRequest = {
  name: string
  accountType: AccountType
  initialBalance: number
}

export type FinancialAccountResponse = {
  id: string
  name: string
  accountType: AccountType
  initialBalance: number
  currentBalance: number
}
