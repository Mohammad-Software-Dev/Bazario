import { useQuery } from '@tanstack/react-query'

import { getAdPositions } from '@/features/ads/api/ads-api'

export function useAdPositionsQuery() {
  return useQuery({
    queryKey: ['ads', 'positions'],
    queryFn: getAdPositions,
  })
}
