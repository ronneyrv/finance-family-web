import { useLocation } from 'react-router-dom'

import UserMenu from '../../features/users/components/UserMenu'
import { BalanceVisibilityButton } from '../ui/balance-visibility'
import { getPageTitle } from './pageTitles'

function Header() {
  const { pathname } = useLocation()
  const pageTitle = getPageTitle(pathname)

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-800 bg-slate-950 px-4 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-base font-semibold text-slate-100">{pageTitle}</h1>
      </div>

      <div className="flex items-center gap-4">
        <BalanceVisibilityButton />
        <UserMenu />
      </div>
    </header>
  )
}

export default Header
