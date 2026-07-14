import { useQuery } from '@tanstack/react-query'

import { getProviderAvailability } from '@/features/provider-availability/api/provider-availability-api'

export function useProviderAvailabilityQuery() {
  return useQuery({
    queryKey: ['provider-availability'],
    queryFn: getProviderAvailability,
  })
}
