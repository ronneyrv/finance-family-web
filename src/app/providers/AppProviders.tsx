import type { ReactNode } from 'react'

import BalanceVisibilityProvider from './BalanceVisibilityProvider'
import NotificationProvider from './NotificationProvider'
import { AuthProvider } from './AuthProvider'
import { CurrentUserProvider } from '../../features/users/context/CurrentUserProvider'

type AppProvidersProps = {
  children: ReactNode
}

function AppProviders({ children }: AppProvidersProps) {
  return (
    <AuthProvider>
      <CurrentUserProvider>
        <BalanceVisibilityProvider>
          <NotificationProvider>{children}</NotificationProvider>
        </BalanceVisibilityProvider>
      </CurrentUserProvider>
    </AuthProvider>
  )
}

export default AppProviders
