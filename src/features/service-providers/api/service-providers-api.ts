import type { ApiSuccessResponse } from '@/lib/api/api-error'
import { httpClient } from '@/lib/api/http-client'

import { serviceProviderEndpoints } from '@/features/service-providers/api/service-provider-endpoints'
import type { ServiceProvidersResult } from '@/features/service-providers/types/service-provider.types'

interface GetServiceProvidersParams {
  page?: number
  perPage?: number
}

export async function getServiceProviders(params: GetServiceProvidersParams = {}) {
  const response = await httpClient.get<ApiSuccessResponse<ServiceProvidersResult>>(serviceProviderEndpoints.list, {
    params: {
      page: params.page,
      per_page: params.perPage,
    },
  })

  return response.data
}
