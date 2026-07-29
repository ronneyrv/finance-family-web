import { useContext } from 'react'

import { CurrentUserContext } from '../context/currentUserContext'

export function useCurrentUser() {
  const context = useContext(CurrentUserContext)

  if (context === undefined) {
    throw new Error('useCurrentUser must be used within a CurrentUserProvider')
  }

  return context
}
