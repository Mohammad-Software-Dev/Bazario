import { useMutation, useQueryClient } from '@tanstack/react-query'

import { upgradeToSeller } from '@/features/account/api/account-api'
import type { UpgradeToSellerPayload } from '@/features/account/types/account.types'

export function useUpgradeSellerMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpgradeToSellerPayload) => upgradeToSeller(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['me'] })
    },
  })
}
