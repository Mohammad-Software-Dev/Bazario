import type { ApiSuccessResponse } from '@/lib/api/api-error'
import { httpClient } from '@/lib/api/http-client'

import { productEndpoints } from '@/features/products/api/product-endpoints'
import type { ProductsResult } from '@/features/products/types/product.types'

interface GetProductsParams {
  categoryId?: number
  page?: number
}

export async function getProducts(params: GetProductsParams = {}) {
  const response = await httpClient.get<ApiSuccessResponse<ProductsResult>>(productEndpoints.list, {
    params: {
      category_id: params.categoryId,
      page: params.page,
    },
  })

  return response.data
}
