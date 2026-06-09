import { createContext } from 'react'

import type { AuthSession } from '@/features/auth/types/auth.types'

export interface AuthContextValue {
  session: AuthSession | null
  isAuthenticated: boolean
  setSession: (session: AuthSession) => void
  clearSession: () => void
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)
