import { useQuery } from '@tanstack/react-query'

import { getProviderBookings } from '@/features/orders/api/orders-api'

export function useProviderBookingsQuery(page = 1, enabled = true) {
  return useQuery({
    queryKey: ['bookings', 'provider', page],
    queryFn: () => getProviderBookings(page),
    enabled,
  })
}
