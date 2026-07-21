import { useQuery } from '@tanstack/react-query'

import { getOrder } from '@/features/orders/api/orders-api'

export function useOrderQuery(orderId: number, enabled = true) {
  return useQuery({
    queryKey: ['orders', orderId],
    queryFn: () => getOrder(orderId),
    enabled,
  })
}
