import { useMeQuery } from '@/features/account/hooks/use-me-query'
import { useAuth } from '@/lib/auth/use-auth'

type UpgradeTarget = 'seller' | 'service_provider'

// The account page hides the entry point for an upgrade that no longer
// applies. The same rule has to hold when the page is opened directly by
// its address, otherwise a user can file a request for a role they already
// hold or that is still under review.
export function useUpgradeEligibility(target: UpgradeTarget) {
  const { session } = useAuth()
  const meQuery = useMeQuery()

  const user = meQuery.data?.result.user ?? session?.user
  const roles = user?.roles ?? session?.roles ?? []
  const hasRole = roles.includes(target)
  const isPending = user?.upgrade_requests?.[target] === 'pending'

  return {
    isChecking: !hasRole && meQuery.isLoading,
    canApply: !hasRole && !isPending,
  }
}
