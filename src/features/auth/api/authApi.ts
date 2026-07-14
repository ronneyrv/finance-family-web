import { apiClient } from '../../../lib/api/apiClient'
import type {
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  RegisterRequest,
  RegisterResponse,
} from '../model/authTypes'

export const authApi = {
  login(credentials: LoginRequest) {
    return apiClient.post<LoginResponse, LoginRequest>('/api/v1/auth/login', {
      ...credentials,
      email: credentials.email.trim(),
    })
  },

  refresh(refreshToken: string) {
    return apiClient.post<RefreshTokenResponse, RefreshTokenRequest>('/api/v1/auth/refresh', {
      refreshToken,
    })
  },

  register(request: RegisterRequest) {
    return apiClient.post<RegisterResponse, RegisterRequest>('/api/v1/auth/register', {
      ...request,
      name: request.name.trim(),
      householdName: request.householdName.trim(),
      email: request.email.trim(),
    })
  },
}
