import { createContext } from 'react'

import type { CurrentUserResponse } from '../model/currentUserTypes'

export type CurrentUserContextValue = {
  user: CurrentUserResponse | null
  loading: boolean
  refreshUser: () => Promise<void>
  updateUser: (user: CurrentUserResponse) => void
}

export const CurrentUserContext = createContext<CurrentUserContextValue | undefined>(undefined)
