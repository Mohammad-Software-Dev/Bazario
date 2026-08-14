import { Outlet } from 'react-router-dom'

import { AppHeader } from '@/components/shared/app-header'
import { LoginDialog } from '@/features/auth/components/login-dialog'

export function MainLayout() {
  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main>
        <Outlet />
      </main>
      <LoginDialog />
    </div>
  )
}
