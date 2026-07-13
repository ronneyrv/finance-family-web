import { useState, type ReactNode } from 'react'

import { authApi } from '../../features/auth/api/authApi'
import { AuthContext } from '../../features/auth/context/authContext'
import type { LoginRequest, RegisterRequest } from '../../features/auth/model/authTypes'
import { authStorage } from '../../features/auth/storage/authStorage'

type AuthProviderProps = {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => authStorage.getAccessToken() !== null,
  )

  async function login(credentials: LoginRequest) {
    const response = await authApi.login(credentials)

    authStorage.setAccessToken(response.accessToken)
    authStorage.setRefreshToken(response.refreshToken)

    setIsAuthenticated(true)
  }

  function logout() {
    authStorage.clear()
    setIsAuthenticated(false)
  }

  async function register(request: RegisterRequest) {
    await authApi.register(request)
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
