import { useMutation, useQueryClient } from '@tanstack/react-query'

import { completeBooking } from '@/features/orders/api/orders-api'

export function useCompleteBookingMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (bookingId: number) => completeBooking(bookingId),
    onSuccess: (_, bookingId) => {
      queryClient.invalidateQueries({ queryKey: ['me'] })
      queryClient.invalidateQueries({ queryKey: ['bookings'] })
      queryClient.invalidateQueries({ queryKey: ['booking', bookingId] })
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
  })
}
