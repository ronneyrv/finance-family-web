import { usersApi } from '../api/usersApi'

export function useCurrentUser() {
  return {
    getCurrentUser: usersApi.getCurrentUser,
    updateCurrentUser: usersApi.updateCurrentUser,
    uploadAvatar: usersApi.uploadAvatar,
  }
}
