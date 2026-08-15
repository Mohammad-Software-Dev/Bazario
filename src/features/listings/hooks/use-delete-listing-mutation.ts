import { useMutation, useQueryClient } from '@tanstack/react-query'

import { deleteListing } from '@/features/listings/api/listings-api'

export function useDeleteListingMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (listingId: number) => deleteListing(listingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listings', 'mine'] })
      queryClient.invalidateQueries({ queryKey: ['listings'] })
    },
  })
}
