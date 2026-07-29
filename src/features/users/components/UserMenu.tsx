import { useState, useRef, useEffect } from 'react'
import { LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { useAuth } from '../../auth/hooks/useAuth'
import { ChevronDown } from 'lucide-react'
import { useCurrentUser } from '../hooks/useCurrentUser'
import UserAvatar from './UserAvatar'

function UserMenu() {
  const { logout } = useAuth()
  const { user } = useCurrentUser()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const profileButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return

    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  useEffect(() => {
    if (open) {
      profileButtonRef.current?.focus()
    }
  }, [open])

  function toggleMenu() {
    setOpen((previous) => !previous)
  }

  function handleProfile() {
    navigate('/profile')
    setOpen(false)
  }

  function handleLogout() {
    setOpen(false)
    logout()
    navigate('/login', { replace: true })
  }

  if (!user) {
    return null
  }

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={toggleMenu}
        className="flex items-center gap-1 rounded-lg px-2 py-1 transition-colors hover:bg-slate-900"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls="user-menu"
      >
        <UserAvatar name={user.name} avatarUrl={user.avatarUrl} size="sm" />

        <span className="hidden text-sm font-medium text-slate-200 sm:block">{user.name}</span>

        <ChevronDown size={16} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div
          role="menu"
          id="user-menu"
          className="absolute right-0 top-full z-50 mt-2 w-56 rounded-xl border border-slate-800 bg-slate-900 p-2 shadow-xl"
        >
          <button
            type="button"
            onClick={handleProfile}
            className="flex w-full rounded-lg px-3 py-2 text-left text-sm text-slate-200 hover:bg-slate-800"
            role="menuitem"
            ref={profileButtonRef}
            focus:outline-none
            focus:bg-slate-800
            focus:ring-2
            focus:ring-emerald-500
          >
            Meu Perfil
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full rounded-lg px-3 py-2 text-left text-sm text-red-400 hover:bg-slate-800"
            role="menuitem"
            focus:outline-none
            focus:bg-slate-800
            focus:ring-2
            focus:ring-emerald-500
          >
            <LogOut size={16} />
            <span>Sair</span>
          </button>
        </div>
      )}
    </div>
  )
}

export default UserMenu
