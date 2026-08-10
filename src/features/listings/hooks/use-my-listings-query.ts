import { useQuery } from '@tanstack/react-query'

import { getMyListings } from '@/features/listings/api/listings-api'

export function useMyListingsQuery(page = 1, enabled = true) {
  return useQuery({
    queryKey: ['listings', 'mine', page],
    queryFn: () => getMyListings(page),
    enabled,
  })
}
