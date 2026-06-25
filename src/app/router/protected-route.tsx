import type { ReactNode } from 'react'
import { Navigate, Outlet } from 'react-router-dom'

import type { Role } from '@/features/auth/types/auth.types'
import { useAuth } from '@/lib/auth/use-auth'

interface ProtectedRouteProps {
  children?: ReactNode
  requiredRoles?: Role[]
}

export function ProtectedRoute({ children, requiredRoles }: ProtectedRouteProps) {
  const { isAuthenticated, isBootstrapping, session } = useAuth()

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

  if (requiredRoles?.length) {
    const roles = session?.roles ?? []
    const hasRequiredRole = requiredRoles.some((role) => roles.includes(role))

    if (!hasRequiredRole) {
      return <Navigate replace to="/account" />
    }
  }

  return children ?? <Outlet />
}
