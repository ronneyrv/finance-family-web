import { apiClient } from '../../../lib/api/apiClient'
import type {
  RecurringTransactionRequest,
  RecurringTransactionResponse,
} from '../model/recurringTransactionTypes'

export const recurringTransactionsApi = {
  create(request: RecurringTransactionRequest) {
    return apiClient.post<RecurringTransactionResponse, RecurringTransactionRequest>(
      '/api/v1/recurring-transactions',
      request,
    )
  },

  findAll() {
    return apiClient.get<RecurringTransactionResponse[]>('/api/v1/recurring-transactions')
  },

  findById(id: string) {
    return apiClient.get<RecurringTransactionResponse>(`/api/v1/recurring-transactions/${id}`)
  },

  update(id: string, request: RecurringTransactionRequest) {
    return apiClient.put<RecurringTransactionResponse, RecurringTransactionRequest>(
      `/api/v1/recurring-transactions/${id}`,
      request,
    )
  },

  updateStatus(id: string, active: boolean) {
    return apiClient.patch<RecurringTransactionResponse>(
      `/api/v1/recurring-transactions/${id}/status?active=${active}`,
    )
  },

  delete(id: string) {
    return apiClient.delete(`/api/v1/recurring-transactions/${id}`)
  },
}
