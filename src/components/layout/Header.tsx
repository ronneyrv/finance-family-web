import { LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { useAuth } from '../../features/auth/hooks/useAuth'

function Header() {
  const { logout } = useAuth()
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

      <button
        type="button"
        onClick={handleLogout}
        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-400 transition-colors hover:bg-slate-900 hover:text-slate-100"
        aria-label="Sair da conta"
      >
        <LogOut size={18} />
        <span className="hidden sm:inline">Sair</span>
      </button>
    </header>
  )
}

export default Header
