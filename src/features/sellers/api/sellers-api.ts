import type { ApiSuccessResponse } from '@/lib/api/api-error'
import { httpClient } from '@/lib/api/http-client'

import { sellerEndpoints } from '@/features/sellers/api/seller-endpoints'
import type { SellersResult } from '@/features/sellers/types/seller.types'

interface GetSellersParams {
  page?: number
  perPage?: number
}

export async function getSellers(params: GetSellersParams = {}) {
  const response = await httpClient.get<ApiSuccessResponse<SellersResult>>(sellerEndpoints.list, {
    params: {
      page: params.page,
      per_page: params.perPage,
    },
  })

  return response.data
}
