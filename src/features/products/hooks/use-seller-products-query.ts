import { useQuery } from '@tanstack/react-query'

import { getProductsBySeller } from '@/features/products/api/products-api'

interface UseSellerProductsQueryOptions {
  page?: number
  perPage?: number
  sellerId?: number
}

export function useSellerProductsQuery(options: UseSellerProductsQueryOptions = {}) {
  return useQuery({
    queryKey: ['seller-products', options],
    queryFn: () => getProductsBySeller(options.sellerId as number, options),
    enabled: typeof options.sellerId === 'number' && options.sellerId > 0,
  })
}
