import type { ApiSuccessResponse } from '@/lib/api/api-error'
import { httpClient } from '@/lib/api/http-client'

import { categoryEndpoints } from '@/features/categories/api/category-endpoints'
import type { CategoryType, CategoryItem } from '@/features/categories/types/category.types'

export async function getCategories(type: CategoryType) {
  const response = await httpClient.get<ApiSuccessResponse<CategoryItem[]>>(categoryEndpoints.list, {
    params: { type },
  })

  return response.data
}
