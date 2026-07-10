import { apiClient } from '../../../lib/api/apiClient'
import type {
  FinancialAccountRequest,
  FinancialAccountResponse,
} from '../model/financialAccountTypes'

const FINANCIAL_ACCOUNTS_PATH = '/api/v1/financial-accounts'

export const financialAccountsApi = {
  findAll() {
    return apiClient.get<FinancialAccountResponse[]>(FINANCIAL_ACCOUNTS_PATH)
  },

  findById(id: string) {
    return apiClient.get<FinancialAccountResponse>(`${FINANCIAL_ACCOUNTS_PATH}/${id}`)
  },

  create(request: FinancialAccountRequest) {
    return apiClient.post<FinancialAccountResponse, FinancialAccountRequest>(
      FINANCIAL_ACCOUNTS_PATH,
      request,
    )
  },

  update(id: string, request: FinancialAccountRequest) {
    return apiClient.put<FinancialAccountResponse, FinancialAccountRequest>(
      `${FINANCIAL_ACCOUNTS_PATH}/${id}`,
      request,
    )
  },

  delete(id: string) {
    return apiClient.delete(`${FINANCIAL_ACCOUNTS_PATH}/${id}`)
  },
}
