import type { ReactNode } from 'react'

import { AuthProvider } from './AuthProvider'
import BalanceVisibilityProvider from './BalanceVisibilityProvider'

type AppProvidersProps = {
  children: ReactNode
}

function AppProviders({ children }: AppProvidersProps) {
  return (
    <AuthProvider>
      <BalanceVisibilityProvider>{children}</BalanceVisibilityProvider>
    </AuthProvider>
  )
}

export default AppProviders
