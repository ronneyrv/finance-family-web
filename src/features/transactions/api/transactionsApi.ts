import { apiClient } from '../../../lib/api/apiClient'
import type { PageResponse } from '../../../lib/api/pageTypes'
import type { TransactionRequest, TransactionResponse } from '../model/transactionTypes'

type FindAllTransactionsParams = {
  page?: number
  size?: number
  startDate?: string
  endDate?: string
}

function buildQueryString(params: FindAllTransactionsParams) {
  const searchParams = new URLSearchParams()

  if (params.page !== undefined) {
    searchParams.set('page', String(params.page))
  }

  if (params.size !== undefined) {
    searchParams.set('size', String(params.size))
  }

  if (params.startDate) {
    searchParams.set('startDate', params.startDate)
  }

  if (params.endDate) {
    searchParams.set('endDate', params.endDate)
  }

  const queryString = searchParams.toString()

  return queryString ? `?${queryString}` : ''
}

export const transactionsApi = {
  findAll(params: FindAllTransactionsParams = {}) {
    const queryString = buildQueryString(params)

    return apiClient.get<PageResponse<TransactionResponse>>(`/api/v1/transactions${queryString}`)
  },

  findById(id: string) {
    return apiClient.get<TransactionResponse>(`/api/v1/transactions/${id}`)
  },

  create(request: TransactionRequest) {
    return apiClient.post<TransactionResponse, TransactionRequest>('/api/v1/transactions', request)
  },

  update(id: string, request: TransactionRequest) {
    return apiClient.put<TransactionResponse, TransactionRequest>(
      `/api/v1/transactions/${id}`,
      request,
    )
  },

  delete(id: string) {
    return apiClient.delete(`/api/v1/transactions/${id}`)
  },
}
