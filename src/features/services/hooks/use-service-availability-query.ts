import { useQuery } from '@tanstack/react-query'

import { getServiceAvailability } from '@/features/services/api/services-api'

interface UseServiceAvailabilityQueryOptions {
  serviceId: number
  date: string
  timezone: string
  ignoreBookingId?: number
  enabled?: boolean
}

export function useServiceAvailabilityQuery({
  serviceId,
  date,
  timezone,
  ignoreBookingId,
  enabled = true,
}: UseServiceAvailabilityQueryOptions) {
  return useQuery({
    queryKey: ['service-availability', serviceId, date, timezone, ignoreBookingId ?? null],
    queryFn: () => getServiceAvailability(serviceId, date, timezone, ignoreBookingId),
    enabled: enabled && serviceId > 0 && date.length > 0,
  })
}
