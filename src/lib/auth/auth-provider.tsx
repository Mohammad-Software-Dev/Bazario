import { useCallback, useEffect, useMemo, useState, type PropsWithChildren } from 'react'
import { useQueryClient } from '@tanstack/react-query'

import type { AuthSession } from '@/features/auth/types/auth.types'
import { useMeQuery } from '@/features/account/hooks/use-me-query'
import {
  clearStoredSession,
  getStoredSession,
  persistSession,
} from '@/lib/auth/auth-storage'
import { AuthContext } from '@/lib/auth/auth-context'

export function AuthProvider({ children }: PropsWithChildren) {
  const queryClient = useQueryClient()
  const [storedSession, setStoredSession] = useState<AuthSession | null>(() => getStoredSession())
  const sessionToken = storedSession?.token ?? null
  const hasToken = Boolean(sessionToken)
  const meQuery = useMeQuery(false, undefined, hasToken)

  const setSession = useCallback((nextSession: AuthSession) => {
    persistSession(nextSession)
    setStoredSession(nextSession)
  }, [])

  const clearSession = useCallback(() => {
    clearStoredSession()
    queryClient.removeQueries({ queryKey: ['me'] })
    setStoredSession(null)
  }, [queryClient])

  useEffect(() => {
    if (!sessionToken || !meQuery.isError) {
      return
    }

    clearStoredSession()
  }, [meQuery.isError, sessionToken])

  const session = useMemo<AuthSession | null>(() => {
    if (!storedSession) {
      return null
    }

    if (meQuery.isError) {
      return null
    }

    const verifiedUser = meQuery.data?.result.user

    if (!verifiedUser) {
      return storedSession
    }

    return {
      token: storedSession.token,
      user: verifiedUser,
      roles: verifiedUser.roles ?? storedSession.roles,
    }
  }, [meQuery.data, meQuery.isError, storedSession])

  const value = {
    session,
    isAuthenticated: Boolean(session?.token),
    isBootstrapping: hasToken && meQuery.isFetching,
    setSession,
    clearSession,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
