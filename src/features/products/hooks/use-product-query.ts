import { useQuery } from '@tanstack/react-query'

import { getProduct } from '@/features/products/api/products-api'

export function useProductQuery(productId: number, enabled = true) {
  return useQuery({
    queryKey: ['product', productId],
    queryFn: () => getProduct(productId),
    enabled,
  })
}
