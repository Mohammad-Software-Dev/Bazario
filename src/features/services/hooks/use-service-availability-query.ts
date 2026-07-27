import { useQuery } from '@tanstack/react-query'

import { getServiceAvailability } from '@/features/services/api/services-api'

interface UseServiceAvailabilityQueryOptions {
  serviceId: number
  date: string
  timezone: string
  ignoreBookingId?: number
}

export function useServiceAvailabilityQuery({
  serviceId,
  date,
  timezone,
  ignoreBookingId,
}: UseServiceAvailabilityQueryOptions) {
  return useQuery({
    queryKey: ['service-availability', serviceId, date, timezone, ignoreBookingId ?? null],
    queryFn: () => getServiceAvailability(serviceId, date, timezone, ignoreBookingId),
    enabled: serviceId > 0 && date.length > 0,
  })
}
