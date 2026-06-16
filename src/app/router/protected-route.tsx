import type { ReactNode } from 'react'
import { Navigate, Outlet } from 'react-router-dom'

import { useAuth } from '@/lib/auth/use-auth'

interface ProtectedRouteProps {
  children?: ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isBootstrapping } = useAuth()

  if (isBootstrapping) {
    return (
      <div className="mx-auto flex min-h-[60vh] w-full max-w-6xl items-center justify-center px-4 text-sm text-muted-foreground">
        Loading account...
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate replace to="/" />
  }

  return children ?? <Outlet />
}
