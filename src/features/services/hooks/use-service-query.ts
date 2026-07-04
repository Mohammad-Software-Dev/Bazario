import { useQuery } from '@tanstack/react-query'

import { getService } from '@/features/services/api/services-api'

export function useServiceQuery(serviceId: number, enabled = true) {
  return useQuery({
    queryKey: ['service', serviceId],
    queryFn: () => getService(serviceId),
    enabled,
  })
}
