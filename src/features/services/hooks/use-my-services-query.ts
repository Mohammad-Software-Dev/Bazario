import { useQuery } from '@tanstack/react-query'

import { getMyServices } from '@/features/services/api/services-api'

interface UseMyServicesQueryOptions {
  page?: number
  perPage?: number
  enabled?: boolean
}

export function useMyServicesQuery(options: UseMyServicesQueryOptions = {}) {
  const { enabled = true, ...params } = options

  return useQuery({
    queryKey: ['my-services', params],
    queryFn: () => getMyServices(params),
    enabled,
  })
}
