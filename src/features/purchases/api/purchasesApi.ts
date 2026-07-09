import { apiClient } from '../../../lib/api/apiClient'
import type { InstallmentResponse, PurchaseRequest } from '../model/purchaseTypes'

export const purchasesApi = {
  create(creditCardId: string, request: PurchaseRequest) {
    return apiClient.post<InstallmentResponse[], PurchaseRequest>(
      `/api/v1/credit-cards/${creditCardId}/purchases`,
      request,
    )
  },
}
