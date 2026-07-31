import { apiClient } from '../../../lib/api/apiClient'
import type {
  ChangePasswordRequest,
  CurrentUserResponse,
  UpdateCurrentUserRequest,
} from '../model/currentUserTypes'

const USERS_PATH = '/api/v1/users'

export const usersApi = {
  getCurrentUser() {
    return apiClient.get<CurrentUserResponse>(`${USERS_PATH}/me`)
  },

  updateCurrentUser(request: UpdateCurrentUserRequest) {
    return apiClient.put<CurrentUserResponse, UpdateCurrentUserRequest>(`${USERS_PATH}/me`, request)
  },

  uploadAvatar(file: FormData) {
    return apiClient.post<CurrentUserResponse, FormData>(`${USERS_PATH}/me/avatar`, file)
  },

  changePassword(request: ChangePasswordRequest) {
    return apiClient.put<void, ChangePasswordRequest>(`${USERS_PATH}/me/password`, request)
  },
}
