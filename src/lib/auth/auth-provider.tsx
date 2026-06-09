import { useState, type PropsWithChildren } from 'react'

import type { AuthSession } from '@/features/auth/types/auth.types'
import { clearStoredSession, getStoredSession, persistSession } from '@/lib/auth/auth-storage'
import { AuthContext } from '@/lib/auth/auth-context'

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSessionState] = useState<AuthSession | null>(() => getStoredSession())

  const setSession = (nextSession: AuthSession) => {
    persistSession(nextSession)
    setSessionState(nextSession)
  }

  const clearSession = () => {
    clearStoredSession()
    setSessionState(null)
  }

  const value = {
    session,
    isAuthenticated: Boolean(session?.token),
    setSession,
    clearSession,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
