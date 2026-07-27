import { useQuery } from '@tanstack/react-query'

import { getBooking } from '@/features/orders/api/orders-api'

export function useBookingQuery(bookingId: number, enabled = true) {
  return useQuery({
    queryKey: ['booking', bookingId],
    queryFn: () => getBooking(bookingId),
    enabled,
  })
}
