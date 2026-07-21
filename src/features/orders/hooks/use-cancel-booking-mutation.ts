import { useMutation, useQueryClient } from '@tanstack/react-query'

import { cancelBooking } from '@/features/orders/api/orders-api'

export function useCancelBookingMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ bookingId, reason }: { bookingId: number; reason?: string }) => cancelBooking(bookingId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] })
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['me'] })
    },
  })
}
