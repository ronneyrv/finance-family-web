export type CreditCardRequest = {
  name: string
  creditLimit: number
  closingDay: number
  dueDay: number
}

export type CreditCardResponse = {
  id: string
  name: string
  creditLimit: number
  closingDay: number
  dueDay: number
}
