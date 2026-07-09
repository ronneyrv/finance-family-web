export type PurchaseRequest = {
  description: string
  totalAmount: number
  installments: number
  purchaseDate: string
}

export type InstallmentResponse = {
  id: string
  description: string
  installmentNumber: number
  totalInstallments: number
  amount: number
  invoiceMonth: number
  invoiceYear: number
  paid: boolean
}
