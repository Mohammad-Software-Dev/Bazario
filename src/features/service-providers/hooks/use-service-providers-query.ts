import { useQuery } from '@tanstack/react-query'

import { getServiceProviders } from '@/features/service-providers/api/service-providers-api'

interface UseServiceProvidersQueryOptions {
  page?: number
  perPage?: number
}

export function useServiceProvidersQuery(options: UseServiceProvidersQueryOptions = {}) {
  return useQuery({
    queryKey: ['service-providers', options],
    queryFn: () => getServiceProviders(options),
  })
}
