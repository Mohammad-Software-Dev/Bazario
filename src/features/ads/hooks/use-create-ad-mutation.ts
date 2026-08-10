import { useMutation, useQueryClient } from '@tanstack/react-query'

import { createAd } from '@/features/ads/api/ads-api'
import type { CreateAdPayload } from '@/features/ads/types/ad.types'

export function useCreateAdMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateAdPayload) => createAd(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ads', 'mine'] })
      queryClient.invalidateQueries({ queryKey: ['home'] })
    },
  })
}
