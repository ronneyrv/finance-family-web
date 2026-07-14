import { NavLink } from 'react-router-dom'

import { navigationItems } from './navigation'

function MobileNavigation() {
  return (
    <nav className="fixed right-0 bottom-0 left-0 z-50 border-t border-slate-800 bg-slate-950 lg:hidden">
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${navigationItems.length}, minmax(0, 1fr))`,
        }}
      >
        {navigationItems.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              [
                'flex min-h-14 flex-col items-center justify-center gap-0.5 px-0.5 text-[10px]',
                isActive ? 'text-emerald-400' : 'text-slate-500',
              ].join(' ')
            }
          >
            <Icon size={20} />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

export default MobileNavigation
