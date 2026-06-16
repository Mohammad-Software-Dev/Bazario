import { Link } from 'react-router-dom'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { LoginDialog } from '@/features/auth/components/login-dialog'
import { useLogoutMutation } from '@/features/auth/hooks/use-logout-mutation'
import { useAuth } from '@/lib/auth/use-auth'

export function AppHeader() {
  const { session, isAuthenticated } = useAuth()
  const logoutMutation = useLogoutMutation()
  const [isLoginOpen, setIsLoginOpen] = useState(false)

  return (
    <>
      <header className="border-b bg-background">
        <div className="mx-auto flex min-h-16 w-full max-w-6xl items-center justify-between px-4">
          <div>
            <Button asChild variant="ghost" className="px-2 text-lg font-semibold">
              <Link to="/">Bazario</Link>
            </Button>
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
            <Button onClick={() => setIsLoginOpen(true)}>Login</Button>
          )}
        </div>
      </header>

      <LoginDialog open={isLoginOpen} onOpenChange={setIsLoginOpen} />
    </>
  )
}
