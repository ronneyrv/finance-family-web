export type LoginRequest = {
  email: string
  password: string
}

export type LoginResponse = {
  accessToken: string
  refreshToken: string
}

export type RefreshTokenRequest = {
  refreshToken: string
}

export type RefreshTokenResponse = {
  accessToken: string
}

export type RegisterRequest = {
  name: string
  householdName: string
  email: string
  password: string
}

export type RegisterResponse = {
  message: string
}
