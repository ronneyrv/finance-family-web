export type TransferRequest = {
  description: string
  amount: number
  transactionDate: string
  sourceAccountId: string
  destinationAccountId: string
}

export type TransferResponse = {
  id: string
  description: string
  amount: number
  transactionDate: string
  sourceAccountId: string
  sourceAccountName: string
  destinationAccountId: string
  destinationAccountName: string
}
