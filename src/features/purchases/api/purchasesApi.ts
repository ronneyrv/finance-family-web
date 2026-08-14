import { apiClient } from '../../../lib/api/apiClient'
import type { InstallmentResponse, PurchaseRequest } from '../model/purchaseTypes'

export type PurchaseCategoryRequest = {
  categoryId: string | null
  subCategoryId: string | null
}

export const purchasesApi = {
  create(creditCardId: string, request: PurchaseRequest) {
    return apiClient.post<InstallmentResponse[], PurchaseRequest>(
      `/api/v1/credit-cards/${creditCardId}/purchases`,
      request,
    )
  },

  updateCategory(purchaseId: string, request: PurchaseCategoryRequest) {
    return apiClient.patch<void, PurchaseCategoryRequest>(
      `/api/v1/credit-cards/purchases/${purchaseId}/category`,
      request,
    )
  },
}
