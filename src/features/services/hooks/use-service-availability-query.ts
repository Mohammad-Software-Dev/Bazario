import { useQuery } from '@tanstack/react-query'

import { getServiceAvailability } from '@/features/services/api/services-api'

interface UseServiceAvailabilityQueryOptions {
  serviceId: number
  date: string
  timezone: string
}

export function useServiceAvailabilityQuery({ serviceId, date, timezone }: UseServiceAvailabilityQueryOptions) {
  return useQuery({
    queryKey: ['service-availability', serviceId, date, timezone],
    queryFn: () => getServiceAvailability(serviceId, date, timezone),
    enabled: serviceId > 0 && date.length > 0,
  })
}
