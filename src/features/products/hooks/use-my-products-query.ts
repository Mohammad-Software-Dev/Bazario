import { useQuery } from '@tanstack/react-query'

import { getMyProducts } from '@/features/products/api/products-api'

interface UseMyProductsQueryOptions {
  page?: number
  perPage?: number
  enabled?: boolean
}

export function useMyProductsQuery(options: UseMyProductsQueryOptions = {}) {
  const { enabled = true, ...params } = options

  return useQuery({
    queryKey: ['my-products', params],
    queryFn: () => getMyProducts(params),
    enabled,
  })
}
