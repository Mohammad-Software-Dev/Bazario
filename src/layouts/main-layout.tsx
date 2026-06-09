import { Outlet } from 'react-router-dom'

import { AppHeader } from '@/components/shared/app-header'

export function MainLayout() {
  return (
    <div className="min-h-screen bg-muted/30">
      <AppHeader />
      <main>
        <Outlet />
      </main>
    </div>
  )
}
