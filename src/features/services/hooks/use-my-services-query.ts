import { useQuery } from '@tanstack/react-query'

import { getMyServices } from '@/features/services/api/services-api'

interface UseMyServicesQueryOptions {
  page?: number
  perPage?: number
}

export function useMyServicesQuery(options: UseMyServicesQueryOptions = {}) {
  return useQuery({
    queryKey: ['my-services', options],
    queryFn: () => getMyServices(options),
  })
}
