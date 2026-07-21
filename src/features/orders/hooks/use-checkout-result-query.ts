import { useQuery } from '@tanstack/react-query'

import { reconcileCheckoutSession } from '@/features/orders/api/orders-api'

export function useCheckoutResultQuery(orderId: number, sessionId: string, enabled = true) {
  return useQuery({
    queryKey: ['checkout-result', orderId, sessionId],
    queryFn: () => reconcileCheckoutSession(orderId, { session_id: sessionId }),
    enabled,
    retry: false,
  })
}
