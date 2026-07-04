import type { ApiSuccessResponse } from '@/lib/api/api-error'
import { httpClient } from '@/lib/api/http-client'

import { productEndpoints } from '@/features/products/api/product-endpoints'
import type {
  ProductListItem,
  ProductsResult,
  SellerProductsResult,
} from '@/features/products/types/product.types'

interface GetProductsParams {
  categoryId?: number
  page?: number
  perPage?: number
}

export async function getProducts(params: GetProductsParams = {}) {
  const response = await httpClient.get<ApiSuccessResponse<ProductsResult>>(productEndpoints.list, {
    params: {
      category_id: params.categoryId,
      page: params.page,
      per_page: params.perPage,
    },
  })

  return response.data
}

export async function getProductsBySeller(sellerId: number, params: Omit<GetProductsParams, 'categoryId'> = {}) {
  const response = await httpClient.get<ApiSuccessResponse<SellerProductsResult>>(
    productEndpoints.bySeller(sellerId),
    {
      params: {
        page: params.page,
        per_page: params.perPage,
      },
    },
  )

  return response.data
}

export async function getProduct(productId: number) {
  const response = await httpClient.get<ApiSuccessResponse<ProductListItem>>(productEndpoints.detail(productId))

  return response.data
}
