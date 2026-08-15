import { useMutation, useQueryClient } from '@tanstack/react-query'

import { deleteAd } from '@/features/ads/api/ads-api'

export function useDeleteAdMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (adId: number) => deleteAd(adId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ads', 'mine'] })
      queryClient.invalidateQueries({ queryKey: ['ads'] })
    },
  })
}
