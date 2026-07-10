import { apiClient } from '../../../lib/api/apiClient'
import type { FinancialAccountResponse } from '../model/financialAccountTypes'

const FINANCIAL_ACCOUNTS_PATH = '/api/v1/financial-accounts'

export const financialAccountsApi = {
  findAll() {
    return apiClient.get<FinancialAccountResponse[]>(FINANCIAL_ACCOUNTS_PATH)
  },
}
