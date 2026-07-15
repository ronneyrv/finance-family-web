import { createContext } from 'react'

export type BalanceVisibilityContextValue = {
  isVisible: boolean
  toggleVisibility: () => void
}

export const BalanceVisibilityContext = createContext<BalanceVisibilityContextValue | null>(null)
