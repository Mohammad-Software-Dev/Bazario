import { useQuery } from '@tanstack/react-query'

import { getMyProducts } from '@/features/products/api/products-api'

interface UseMyProductsQueryOptions {
  page?: number
  perPage?: number
}

export function useMyProductsQuery(options: UseMyProductsQueryOptions = {}) {
  return useQuery({
    queryKey: ['my-products', options],
    queryFn: () => getMyProducts(options),
  })
}
