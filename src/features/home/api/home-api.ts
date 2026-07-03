import type { ApiSuccessResponse } from '@/lib/api/api-error'
import { httpClient } from '@/lib/api/http-client'

import { homeEndpoints } from '@/features/home/api/home-endpoints'
import type { HomeResult } from '@/features/home/types/home.types'

interface GetHomeParams {
  latestLimit?: number
}

export async function getHome(params: GetHomeParams = {}) {
  const response = await httpClient.get<ApiSuccessResponse<HomeResult>>(homeEndpoints.show, {
    params: {
      latest_limit: params.latestLimit,
    },
  })

  return response.data
}
