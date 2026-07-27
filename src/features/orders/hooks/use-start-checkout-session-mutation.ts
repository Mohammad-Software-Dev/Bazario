import { useMutation } from '@tanstack/react-query'

import { createCheckoutSession } from '@/features/orders/api/orders-api'

export function useStartCheckoutSessionMutation() {
  return useMutation({
    mutationFn: (orderId: number) => createCheckoutSession(orderId),
    onSuccess: (result) => {
      window.location.assign(result.checkout_url)
    },
  })
}
