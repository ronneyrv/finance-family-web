import { Outlet } from 'react-router-dom'

import Header from './Header'
import MobileNavigation from './MobileNavigation'
import Sidebar from './Sidebar'

function AppLayout() {
  return (
    <div className="flex min-h-screen bg-slate-900 text-slate-100">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header />

        <main className="flex-1 p-4 pb-24 sm:p-6 sm:pb-24 lg:p-8">
          <Outlet />
        </main>
      </div>

      <MobileNavigation />
    </div>
  )
}

export default AppLayout
