import { useQuery } from '@tanstack/react-query'

import { getMyOrders } from '@/features/orders/api/orders-api'

export function useMyOrdersQuery(page = 1, enabled = true) {
  return useQuery({
    queryKey: ['orders', 'mine', page],
    queryFn: () => getMyOrders(page),
    enabled,
  })
}
