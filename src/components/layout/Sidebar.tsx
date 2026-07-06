import { NavLink } from 'react-router-dom'

import { navigationItems } from './navigation'

function Sidebar() {
  return (
    <aside className="hidden min-h-screen w-64 shrink-0 border-r border-slate-800 bg-slate-950 lg:block">
      <div className="flex h-16 items-center border-b border-slate-800 px-6">
        <span className="text-lg font-bold text-emerald-400">Finance Family</span>
      </div>

      <nav className="space-y-1 p-4">
        {navigationItems.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              [
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-emerald-500/10 text-emerald-400'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-100',
              ].join(' ')
            }
          >
            <Icon size={20} />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar
