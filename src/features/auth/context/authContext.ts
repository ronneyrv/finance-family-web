import { createContext } from 'react'

import type { LoginRequest } from '../model/authTypes'

export type AuthContextValue = {
  isAuthenticated: boolean
  login: (credentials: LoginRequest) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)
