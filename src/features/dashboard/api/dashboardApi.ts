import { apiClient } from '../../../lib/api/apiClient'
import type {
  CashFlowResponse,
  CategoryExpenseResponse,
  CreditCardExpenseTrendResponse,
  CreditCardInvoiceSummaryResponse,
  CumulativeResultResponse,
  DashboardFiltersResponse,
  DashboardSummaryResponse,
  FinancialHealthResponse,
  IncomeCommitmentResponse,
  MonthlyProjectionResponse,
  MonthlySummaryResponse,
} from '../model/dashboardTypes'

export const dashboardApi = {
  getSummary() {
    return apiClient.get<DashboardSummaryResponse>('/api/v1/dashboard/summary')
  },

  getFinancialHealth() {
    return apiClient.get<FinancialHealthResponse>('/api/v1/dashboard/financial-health')
  },

  getIncomeCommitment() {
    return apiClient.get<IncomeCommitmentResponse>('/api/v1/dashboard/income-commitment')
  },

  getExpensesByCategory() {
    return apiClient.get<CategoryExpenseResponse[]>('/api/v1/dashboard/categories')
  },

  getMonthlySummary(year: number) {
    return apiClient.get<MonthlySummaryResponse[]>(`/api/v1/dashboard/monthly?year=${year}`)
  },

  getCumulativeResult(year: number) {
    return apiClient.get<CumulativeResultResponse[]>(
      `/api/v1/dashboard/cumulative-result?year=${year}`,
    )
  },

  getMyCumulativeResult(year: number) {
    return apiClient.get<CumulativeResultResponse[]>(
      `/api/v1/dashboard/cumulative-result/me?year=${year}`,
    )
  },

  getCashFlow(year: number) {
    return apiClient.get<CashFlowResponse[]>(`/api/v1/dashboard/cash-flow?year=${year}`)
  },

  getProjection(year: number) {
    return apiClient.get<MonthlyProjectionResponse[]>(`/api/v1/dashboard/projection?year=${year}`)
  },

  getFilters() {
    return apiClient.get<DashboardFiltersResponse>('/api/v1/dashboard/filters')
  },

  getCreditCardInvoices() {
    return apiClient.get<CreditCardInvoiceSummaryResponse[]>('/api/v1/dashboard/credit-cards')
  },

  getCreditCardTrend(year: number) {
    return apiClient.get<CreditCardExpenseTrendResponse[]>(
      `/api/v1/dashboard/credit-cards/trend?year=${year}`,
    )
  },
}
