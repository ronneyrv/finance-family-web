import { useEffect, useMemo, useState, type ReactNode } from 'react'

import { BalanceVisibilityContext } from './BalanceVisibilityContext'

type BalanceVisibilityProviderProps = {
  children: ReactNode
}

function BalanceVisibilityProvider({ children }: BalanceVisibilityProviderProps) {
  const [isVisible, setIsVisible] = useState(() => {
    const storedPreference = localStorage.getItem('balance-visibility')

    return storedPreference === null ? false : storedPreference === 'true'
  })

  useEffect(() => {
    const storedPreference = localStorage.getItem('balance-visibility')

    if (storedPreference !== null) {
      setIsVisible(storedPreference === 'true')
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('balance-visibility', String(isVisible))
  }, [isVisible])

  const value = useMemo(
    () => ({
      isVisible,
      toggleVisibility: () => setIsVisible((current) => !current),
    }),
    [isVisible],
  )

  return (
    <BalanceVisibilityContext.Provider value={value}>{children}</BalanceVisibilityContext.Provider>
  )
}

export default BalanceVisibilityProvider
