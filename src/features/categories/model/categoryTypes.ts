import type { TransactionType } from '../../transactions/model/transactionTypes'

export type CategoryResponse = {
  id: string
  name: string
  type: TransactionType
}

export type SubCategoryResponse = {
  id: string
  name: string
}
