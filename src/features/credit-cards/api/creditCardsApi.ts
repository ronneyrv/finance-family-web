import { apiClient } from '../../../lib/api/apiClient'
import type { CreditCardRequest, CreditCardResponse } from '../model/creditCardTypes'

const CREDIT_CARDS_PATH = '/api/v1/credit-cards'

export const creditCardsApi = {
  findAll() {
    return apiClient.get<CreditCardResponse[]>(CREDIT_CARDS_PATH)
  },

  findById(id: string) {
    return apiClient.get<CreditCardResponse>(`${CREDIT_CARDS_PATH}/${id}`)
  },

  create(request: CreditCardRequest) {
    return apiClient.post<CreditCardResponse, CreditCardRequest>(CREDIT_CARDS_PATH, request)
  },

  update(id: string, request: CreditCardRequest) {
    return apiClient.put<CreditCardResponse, CreditCardRequest>(
      `${CREDIT_CARDS_PATH}/${id}`,
      request,
    )
  },

  delete(id: string) {
    return apiClient.delete(`${CREDIT_CARDS_PATH}/${id}`)
  },
}
