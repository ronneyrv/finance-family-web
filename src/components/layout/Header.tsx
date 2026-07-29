import { LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import UserAvatar from '../../features/users/components/UserAvatar'
import { useAuth } from '../../features/auth/hooks/useAuth'
import { useCurrentUser } from '../../features/users/hooks/useCurrentUser'
import { BalanceVisibilityButton } from '../ui/balance-visibility'

function Header() {
  const { logout } = useAuth()
  const { user } = useCurrentUser()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-800 bg-slate-950 px-4 sm:px-6 lg:px-8">
      <div>
        <p className="text-sm text-slate-400">Visão geral das suas finanças</p>
      </div>

      <div className="flex items-center gap-4">
        <BalanceVisibilityButton />

        {user && (
          <div className="hidden items-center gap-3 sm:flex">
            <UserAvatar name={user.name} avatarUrl={user.avatarUrl} size="sm" />

            <span className="text-sm font-medium text-slate-200">{user.name}</span>
          </div>
        )}

        <button
          type="button"
          onClick={handleLogout}
          className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-400 transition-colors hover:bg-slate-900 hover:text-slate-100"
          aria-label="Sair da conta"
        >
          <LogOut size={18} />
          <span className="hidden sm:inline">Sair</span>
        </button>
      </div>
    </header>
  )
}

export default Header
