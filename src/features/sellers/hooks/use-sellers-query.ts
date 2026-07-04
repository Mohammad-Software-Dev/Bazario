import { useQuery } from '@tanstack/react-query'

import { getSellers } from '@/features/sellers/api/sellers-api'

interface UseSellersQueryOptions {
  page?: number
  perPage?: number
}

export function useSellersQuery(options: UseSellersQueryOptions = {}) {
  return useQuery({
    queryKey: ['sellers', options],
    queryFn: () => getSellers(options),
  })
}
