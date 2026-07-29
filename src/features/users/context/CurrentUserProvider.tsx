import { useCallback, useEffect, useState, type ReactNode } from 'react'

import { useAuth } from '../../auth/hooks/useAuth'
import { usersApi } from '../api/usersApi'
import { CurrentUserContext } from './currentUserContext'
import type { CurrentUserResponse } from '../model/currentUserTypes'

type CurrentUserProviderProps = {
  children: ReactNode
}

export function CurrentUserProvider({ children }: CurrentUserProviderProps) {
  const { isAuthenticated } = useAuth()

  const [user, setUser] = useState<CurrentUserResponse | null>(null)
  const [loading, setLoading] = useState(false)

  const refreshUser = useCallback(async () => {
    if (!isAuthenticated) {
      setUser(null)
      return
    }

    setLoading(true)

    try {
      const currentUser = await usersApi.getCurrentUser()

      setUser(currentUser)
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated])

  function updateUser(updatedUser: CurrentUserResponse) {
    setUser(updatedUser)
  }

  useEffect(() => {
    void refreshUser()
  }, [refreshUser])

  return (
    <CurrentUserContext.Provider
      value={{
        user,
        loading,
        refreshUser,
        updateUser,
      }}
    >
      {children}
    </CurrentUserContext.Provider>
  )
}
