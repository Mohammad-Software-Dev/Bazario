import { useMutation, useQueryClient } from '@tanstack/react-query'

import { upgradeToServiceProvider } from '@/features/account/api/account-api'
import type { UpgradeToServiceProviderPayload } from '@/features/account/types/account.types'

export function useUpgradeServiceProviderMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpgradeToServiceProviderPayload) => upgradeToServiceProvider(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['me'] })
    },
  })
}
