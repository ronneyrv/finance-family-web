import { apiClient } from '../../../lib/api/apiClient'
import type { GoalRequest, GoalResponse } from '../model/goalTypes'

const GOALS_PATH = '/api/v1/goals'

export const goalsApi = {
  findAll() {
    return apiClient.get<GoalResponse[]>(GOALS_PATH)
  },

  findById(id: string) {
    return apiClient.get<GoalResponse>(`${GOALS_PATH}/${id}`)
  },

  create(request: GoalRequest) {
    return apiClient.post<GoalResponse, GoalRequest>(GOALS_PATH, request)
  },

  update(id: string, request: GoalRequest) {
    return apiClient.put<GoalResponse, GoalRequest>(`${GOALS_PATH}/${id}`, request)
  },

  delete(id: string) {
    return apiClient.delete(`${GOALS_PATH}/${id}`)
  },
}
