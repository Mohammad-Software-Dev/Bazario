import type { ApiSuccessResponse } from '@/lib/api/api-error'
import { httpClient } from '@/lib/api/http-client'

import { serviceEndpoints } from '@/features/services/api/service-endpoints'
import type { ServicesResult } from '@/features/services/types/service.types'

interface GetServicesParams {
  categoryId?: number
  page?: number
}

export async function getServices(params: GetServicesParams = {}) {
  const response = await httpClient.get<ApiSuccessResponse<ServicesResult>>(serviceEndpoints.list, {
    params: {
      category_id: params.categoryId,
      page: params.page,
    },
  })

  return response.data
}
