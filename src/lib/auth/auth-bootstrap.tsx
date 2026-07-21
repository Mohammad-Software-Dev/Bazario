import { useEffect, type PropsWithChildren } from 'react'

import { useMeQuery } from '@/features/account/hooks/use-me-query'
import { useAuthStore } from '@/stores/auth-store'
import { useCartStore } from '@/stores/cart-store'

export function AuthBootstrap({ children }: PropsWithChildren) {
  const session = useAuthStore((state) => state.session)
  const clearSession = useAuthStore((state) => state.clearSession)
  const setBootstrapping = useAuthStore((state) => state.setBootstrapping)
  const syncVerifiedUser = useAuthStore((state) => state.syncVerifiedUser)
  const syncCartOwner = useCartStore((state) => state.syncOwner)

  const sessionToken = session?.token ?? null
  const hasToken = Boolean(sessionToken)
  const meQuery = useMeQuery(false, undefined, hasToken)

  useEffect(() => {
    if (!hasToken) {
      setBootstrapping(false)
      return
    }

    setBootstrapping(meQuery.isLoading)
  }, [hasToken, meQuery.isLoading, setBootstrapping])

  useEffect(() => {
    syncCartOwner(session?.user.id ?? null)
  }, [session?.user.id, syncCartOwner])

  useEffect(() => {
    if (!hasToken || !meQuery.isError) {
      return
    }

    clearSession()
  }, [clearSession, hasToken, meQuery.isError])

  useEffect(() => {
    const verifiedUser = meQuery.data?.result.user

    if (!hasToken || !verifiedUser) {
      return
    }

    syncVerifiedUser(verifiedUser)
  }, [hasToken, meQuery.data, syncVerifiedUser])

  return children
}
