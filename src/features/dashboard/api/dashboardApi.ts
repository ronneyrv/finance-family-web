import { apiClient } from '../../../lib/api/apiClient'
import type {
  CategoryExpenseResponse,
  DashboardSummaryResponse,
  MonthlyProjectionResponse,
  MonthlySummaryResponse,
} from '../model/dashboardTypes'

export const dashboardApi = {
  getSummary() {
    return apiClient.get<DashboardSummaryResponse>('/api/v1/dashboard/summary')
  },

  getExpensesByCategory() {
    return apiClient.get<CategoryExpenseResponse[]>('/api/v1/dashboard/categories')
  },

  getMonthlySummary(year: number) {
    return apiClient.get<MonthlySummaryResponse[]>(`/api/v1/dashboard/monthly?year=${year}`)
  },

  getProjection(year: number) {
    return apiClient.get<MonthlyProjectionResponse[]>(`/api/v1/dashboard/projection?year=${year}`)
  },
}
