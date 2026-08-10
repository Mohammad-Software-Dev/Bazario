import { useQuery } from '@tanstack/react-query'

import { getMyAds } from '@/features/ads/api/ads-api'

export function useMyAdsQuery(page = 1, enabled = true) {
  return useQuery({
    queryKey: ['ads', 'mine', page],
    queryFn: () => getMyAds(page),
    enabled,
  })
}
