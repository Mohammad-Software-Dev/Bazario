import { useQuery } from '@tanstack/react-query'

import { getServices } from '@/features/services/api/services-api'

interface UseServicesQueryOptions {
  categoryId?: number
  page?: number
  perPage?: number
}

export function useServicesQuery(options: UseServicesQueryOptions = {}) {
  return useQuery({
    queryKey: ['services', options],
    queryFn: () => getServices(options),
  })
}
