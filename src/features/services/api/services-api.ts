import type { ApiSuccessResponse } from '@/lib/api/api-error'
import { httpClient } from '@/lib/api/http-client'

import { serviceEndpoints } from '@/features/services/api/service-endpoints'
import type {
  ServiceListItem,
  ServiceProviderServicesResult,
  ServicesResult,
} from '@/features/services/types/service.types'

interface GetServicesParams {
  categoryId?: number
  page?: number
  perPage?: number
}

export async function getServices(params: GetServicesParams = {}) {
  const response = await httpClient.get<ApiSuccessResponse<ServicesResult>>(serviceEndpoints.list, {
    params: {
      category_id: params.categoryId,
      page: params.page,
      per_page: params.perPage,
    },
  })

  return response.data
}

export async function getServicesByServiceProvider(
  serviceProviderId: number,
  params: Omit<GetServicesParams, 'categoryId'> = {},
) {
  const response = await httpClient.get<ApiSuccessResponse<ServiceProviderServicesResult>>(
    serviceEndpoints.byServiceProvider(serviceProviderId),
    {
      params: {
        page: params.page,
        per_page: params.perPage,
      },
    },
  )

  return response.data
}

export async function getService(serviceId: number) {
  const response = await httpClient.get<ApiSuccessResponse<ServiceListItem>>(serviceEndpoints.detail(serviceId))

  return response.data
}
