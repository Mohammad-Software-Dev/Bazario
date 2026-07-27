import { useMutation, useQueryClient } from '@tanstack/react-query'

import { confirmBooking } from '@/features/orders/api/orders-api'

export function useConfirmBookingMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (bookingId: number) => confirmBooking(bookingId),
    onSuccess: (_, bookingId) => {
      queryClient.invalidateQueries({ queryKey: ['me'] })
      queryClient.invalidateQueries({ queryKey: ['bookings'] })
      queryClient.invalidateQueries({ queryKey: ['booking', bookingId] })
    },
  })
}
