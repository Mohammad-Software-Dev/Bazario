import { useQuery } from '@tanstack/react-query'

import { getServicesByServiceProvider } from '@/features/services/api/services-api'

interface UseServiceProviderServicesQueryOptions {
  page?: number
  perPage?: number
  serviceProviderId?: number
}

export function useServiceProviderServicesQuery(options: UseServiceProviderServicesQueryOptions = {}) {
  return useQuery({
    queryKey: ['service-provider-services', options],
    queryFn: () => getServicesByServiceProvider(options.serviceProviderId as number, options),
    enabled: typeof options.serviceProviderId === 'number' && options.serviceProviderId > 0,
  })
}
