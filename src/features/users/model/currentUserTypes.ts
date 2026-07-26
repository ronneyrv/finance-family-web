export type CurrentUserResponse = {
  id: string
  name: string
  email: string
  avatarUrl: string | null
}

export type UpdateCurrentUserRequest = {
  name: string
}
