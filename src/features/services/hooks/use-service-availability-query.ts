import { useQuery } from '@tanstack/react-query'

import { getServiceAvailability } from '@/features/services/api/services-api'

interface UseServiceAvailabilityQueryOptions {
  serviceId: number
  date: string
  ignoreBookingId?: number
  enabled?: boolean
}

export function useServiceAvailabilityQuery({
  serviceId,
  date,
  ignoreBookingId,
  enabled = true,
}: UseServiceAvailabilityQueryOptions) {
  return useQuery({
    queryKey: ['service-availability', serviceId, date, ignoreBookingId ?? null],
    queryFn: () => getServiceAvailability(serviceId, date, ignoreBookingId),
    enabled: enabled && serviceId > 0 && date.length > 0,
  })
}
