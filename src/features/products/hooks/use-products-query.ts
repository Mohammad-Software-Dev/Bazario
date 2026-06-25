import { useQuery } from '@tanstack/react-query'

import { getProducts } from '@/features/products/api/products-api'

interface UseProductsQueryOptions {
  categoryId?: number
  page?: number
}

export function useProductsQuery(options: UseProductsQueryOptions = {}) {
  return useQuery({
    queryKey: ['products', options],
    queryFn: () => getProducts(options),
  })
}
