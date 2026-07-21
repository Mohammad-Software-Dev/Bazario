import { useQuery } from '@tanstack/react-query'

import { getMyBookings } from '@/features/orders/api/orders-api'

export function useMyBookingsQuery(page = 1, enabled = true) {
  return useQuery({
    queryKey: ['bookings', 'mine', page],
    queryFn: () => getMyBookings(page),
    enabled,
  })
}
