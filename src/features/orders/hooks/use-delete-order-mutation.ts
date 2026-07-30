import { useMutation, useQueryClient } from '@tanstack/react-query'

import { deleteOrder } from '@/features/orders/api/orders-api'

export function useDeleteOrderMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (orderId: number) => deleteOrder(orderId),
    onSuccess: (_, orderId) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['bookings'] })
      queryClient.invalidateQueries({ queryKey: ['me'] })
      queryClient.removeQueries({ queryKey: ['orders', orderId] })
    },
  })
}
