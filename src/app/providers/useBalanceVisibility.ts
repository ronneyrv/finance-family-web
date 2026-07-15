import { useContext } from 'react'

import { BalanceVisibilityContext } from './BalanceVisibilityContext'

export function useBalanceVisibility() {
  const context = useContext(BalanceVisibilityContext)

  if (!context) {
    throw new Error('useBalanceVisibility must be used within BalanceVisibilityProvider')
  }

  return context
}
