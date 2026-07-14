import { Link, NavLink } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { useLogoutMutation } from '@/features/auth/hooks/use-logout-mutation'
import { useAuth } from '@/lib/auth/use-auth'
import { useUiStore } from '@/stores/ui-store'

const navigationItems = [
  { to: '/products', label: 'Products' },
  { to: '/services', label: 'Services' },
  { to: '/sellers', label: 'Sellers' },
  { to: '/service-providers', label: 'Providers' },
] as const

export function AppHeader() {
  const { session, isAuthenticated } = useAuth()
  const logoutMutation = useLogoutMutation()
  const openLoginDialog = useUiStore((state) => state.openLoginDialog)

  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex min-h-16 w-full max-w-6xl items-center justify-between gap-4 px-4">
        <div className="flex items-center gap-6">
          <Button asChild variant="ghost" className="px-2 text-lg font-semibold">
            <Link to="/">Bazario</Link>
          </Button>

          <nav className="flex items-center gap-1">
            {navigationItems.map((item) => (
              <Button key={item.to} asChild variant="ghost" className="px-3 text-sm">
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    isActive ? 'text-foreground' : 'text-muted-foreground'
                  }
                >
                  {item.label}
                </NavLink>
              </Button>
            ))}
          </nav>
        </div>

        {isAuthenticated ? (
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" className="px-3">
              <Link to="/account">{session?.user.name ?? 'Account'}</Link>
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                logoutMutation.mutate()
              }}
              disabled={logoutMutation.isPending}
            >
              {logoutMutation.isPending ? 'Logging out...' : 'Logout'}
            </Button>
          </div>
        ) : (
          <Button onClick={openLoginDialog}>Login</Button>
        )}
      </div>
    </header>
  )
}
