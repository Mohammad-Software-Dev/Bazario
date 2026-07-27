import { useMutation, useQueryClient } from '@tanstack/react-query'

import { rescheduleBooking } from '@/features/orders/api/orders-api'
import type { RescheduleBookingPayload } from '@/features/orders/types/order.types'

export function useRescheduleBookingMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ bookingId, payload }: { bookingId: number; payload: RescheduleBookingPayload }) =>
      rescheduleBooking(bookingId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] })
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['me'] })
      queryClient.invalidateQueries({ queryKey: ['booking', variables.bookingId] })
    },
  })
}
