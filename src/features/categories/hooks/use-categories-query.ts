import { useQuery } from '@tanstack/react-query'

import { getCategories } from '@/features/categories/api/categories-api'
import type { CategoryType } from '@/features/categories/types/category.types'

export function useCategoriesQuery(type: CategoryType) {
  return useQuery({
    queryKey: ['categories', type],
    queryFn: () => getCategories(type),
    staleTime: 1000 * 60 * 10,
  })
}
