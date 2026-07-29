import type { ReactNode } from 'react'

import { AuthProvider } from './AuthProvider'
import BalanceVisibilityProvider from './BalanceVisibilityProvider'
import { CurrentUserProvider } from '../../features/users/context/CurrentUserProvider'

type AppProvidersProps = {
  children: ReactNode
}

function AppProviders({ children }: AppProvidersProps) {
  return (
    <AuthProvider>
      <CurrentUserProvider>
        <BalanceVisibilityProvider>{children}</BalanceVisibilityProvider>
      </CurrentUserProvider>
    </AuthProvider>
  )
}

export default AppProviders
