import { apiClient } from '../../../lib/api/apiClient'
import type { LoginRequest, LoginResponse } from '../model/authTypes'

export const authApi = {
  login(credentials: LoginRequest) {
    return apiClient.post<LoginResponse, LoginRequest>('/api/v1/auth/login', credentials)
  },
}
