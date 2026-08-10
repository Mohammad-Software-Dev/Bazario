import { useMutation, useQueryClient } from '@tanstack/react-query'

import { createListing } from '@/features/listings/api/listings-api'
import type { CreateListingPayload } from '@/features/listings/types/listing.types'

export function useCreateListingMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateListingPayload) => createListing(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listings', 'mine'] })
      queryClient.invalidateQueries({ queryKey: ['home'] })
    },
  })
}
