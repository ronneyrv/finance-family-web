import UserMenu from '../../features/users/components/UserMenu'
import { BalanceVisibilityButton } from '../ui/balance-visibility'

function Header() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-800 bg-slate-950 px-4 sm:px-6 lg:px-8">
      <div>
        <p className="text-sm text-slate-400">Visão geral das suas finanças</p>
      </div>

      <div className="flex items-center gap-4">
        <BalanceVisibilityButton />
        <UserMenu />
      </div>
    </header>
  )
}

export default Header
