import { useAuthStore } from '@/stores/auth-store'

export function useAuth() {
  const session = useAuthStore((state) => state.session)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const isBootstrapping = useAuthStore((state) => state.isBootstrapping)
  const setSession = useAuthStore((state) => state.setSession)
  const clearSession = useAuthStore((state) => state.clearSession)

  return {
    session,
    isAuthenticated,
    isBootstrapping,
    setSession,
    clearSession,
  }
}
