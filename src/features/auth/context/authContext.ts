import { createContext } from 'react'

import type { LoginRequest, RegisterRequest } from '../model/authTypes'

export type AuthContextValue = {
  isAuthenticated: boolean
  login: (credentials: LoginRequest) => Promise<void>
  register: (request: RegisterRequest) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)
