import { create } from 'zustand'

import type { User, AuthSession } from '@/features/auth/types/auth.types'
import { queryClient } from '@/app/providers/query-client'
import {
  clearStoredSession,
  getStoredSession,
  persistSession,
} from '@/lib/auth/auth-storage'

interface AuthStoreState {
  session: AuthSession | null
  isAuthenticated: boolean
  isBootstrapping: boolean
  setBootstrapping: (isBootstrapping: boolean) => void
  setSession: (session: AuthSession) => void
  syncVerifiedUser: (user: User) => void
  clearSession: () => void
}

const initialSession = getStoredSession()

export const useAuthStore = create<AuthStoreState>((set, get) => ({
  session: initialSession,
  isAuthenticated: Boolean(initialSession?.token),
  isBootstrapping: Boolean(initialSession?.token),
  setBootstrapping: (isBootstrapping) => {
    set({ isBootstrapping })
  },
  setSession: (session) => {
    persistSession(session)
    set({
      session,
      isAuthenticated: true,
      isBootstrapping: false,
    })
  },
  syncVerifiedUser: (user) => {
    const session = get().session

    if (!session) {
      return
    }

    const nextSession = {
      token: session.token,
      user,
      roles: user.roles ?? session.roles,
    }

    persistSession(nextSession)
    set({
      session: nextSession,
      isAuthenticated: true,
      isBootstrapping: false,
    })
  },
  clearSession: () => {
    clearStoredSession()
    queryClient.removeQueries({ queryKey: ['me'] })
    set({
      session: null,
      isAuthenticated: false,
      isBootstrapping: false,
    })
  },
}))
